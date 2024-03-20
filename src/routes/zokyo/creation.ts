import axios from 'axios';
import { Request, Response } from 'express';

import { OPEN_AI_API_KEY, ANTHROPIC_API_KEY } from '@config/constants';

import chatService from '@services/chat.service';
import conversationService from '@services/conversation.service';

import { Chat } from '@schemas/chat.schema';
import { Conversation } from '@schemas/conversation.schema';

import { generateName } from './naming';
import { getDate } from './chatutil';
import { tokenCountDict, ChatEngine } from './engine';

const TOKEN_THRESHOLD = 4096;

/*
Chat abstraction handlers. I really only care about supporting both ChatGPT and Claude here, 
*/

const genChatConfig = (engine: ChatEngine) => {
  const urlMap: Record<ChatEngine, string> = {
    'chatgpt': 'https://api.openai.com/v1/chat/completions',
    'claude': 'https://api.anthropic.com/v1/messages'
  }

  const headersMap: Record<ChatEngine, Record<string, string>> = {
    'chatgpt': {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPEN_AI_API_KEY}`
    },
    'claude': {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    }
  }

  const modelMap: Record<ChatEngine, string> = {
    'chatgpt': 'gpt-3.5-turbo',
    'claude': 'claude-3-sonnet-20240229'
  }

  return {
    url: urlMap[engine],
    headers: headersMap[engine],
    model: modelMap[engine]
  }
}

type AgentConfig = {
  top_p: number;
  temperature: number;
}

const genChatOpenAi = async (messages: any[], agentConfig: AgentConfig): Promise<string> => {
  console.log('Using ChatGPT');
  const config = genChatConfig('chatgpt');
  const data = {
    messages,
    top_p: agentConfig.top_p,
    temperature: agentConfig.temperature,
    model: config.model
  }

  const res = await axios.post(config.url, data, { headers: config.headers });
  return res.data.choices[0].message.content as string
}

const genChatClaude = async (messages: any[], agentConfig: AgentConfig): Promise<string> => {
  console.log('Using Claude');
  const config = genChatConfig('claude');
  const data = {
    messages,
    temperature: agentConfig.temperature,
    model: config.model,
    max_tokens: 1024,
    system: `The date is ${getDate()} in San Francisco.`
  }

  const res = await axios.post(config.url, data, { headers: config.headers });
  return res.data.content[0].text as string;
}

const genChat = async (engine: ChatEngine, messages: any[], agentConfig: AgentConfig): Promise<string> => {
  const chatMap: Record<ChatEngine, (messages: any[], agentConfig: AgentConfig) => Promise<string>> = {
    'claude': genChatClaude,
    'chatgpt': genChatOpenAi
  }

  const data = await chatMap[engine](messages, agentConfig);
  return data;
}

/*
In msg body:
convId: string
newMsg: string
*/

// Return validated vody with types
type CreateChatBody = {
  user: string;
  convId: string;
  msg: string;
  mode: string;
  engine: ChatEngine;
}

const isChatEngine = (str: string): str is ChatEngine => {
  return ['claude', 'chatgpt'].includes(str);
}

const validateBody = (body: any): CreateChatBody | false => {
  let engine: ChatEngine = 'claude'; // default engine

  if (!body.user) { // user can't be an empty string
    return false;
  }

  if (!('convId' in body)) {
    return false;
  }

  if (!body.msg) { // We also don't want an empty message
    return false;
  }

  if (!body.msg.trim()) { // Seriously. No empty strings, not even ones that only have whitespace.
    return false;
  }

  if (!body.mode) {
    return false;
  }

  if (body.engine && isChatEngine(body.engine)) {
    engine = body.engine;
  }

  return { // Implicit string conversions
    user: '' + body.user,
    convId: '' + body.convId,
    msg: '' + body.msg,
    mode: '' + body.mode,
    engine: 'claude'
  }
}

export const createNewChatRoute = async (req: Request, res: Response) => {
  const body = validateBody(req.body);
  if (!body) {
    return res.status(400).json({ success: false });
  }

  const user = body.user;
  const mode = body.mode;
  const newMsg = body.msg;
  const engine = body.engine;
  let convId = body.convId;
  let conv = null;

  const tokenCountFunc = tokenCountDict[engine];

  if (convId == '') {
    const convName = generateName();
    const newConv = new Conversation({
      user,
      name: convName
    });

    conv = await conversationService.saveModel(newConv);
    if (!conv) {
      return res.status(500).json({ success: false, msg: 'Something broke with Zokyo\'s backend' });
    }

    // Implicit conversion to string
    convId = '' + conv.id;
  }

  let temperature = 1;
  let top_p = 1;

  const userChat = {
    conversationId: convId,
    role: 'user',
    content: newMsg,
    timestamp: Date.now()
  }

  let messages = [];
  let allPrevChatsData = await chatService.findModelsByParameter('conversationId', convId, { timestamp: 1 });
  if (!allPrevChatsData) {
    return res.status(500).json({ success: false, msg: 'Something broke with Zokyo\'s backend' });
  }

  let allPrevChats = allPrevChatsData?.map((chat) => {
    return {
      role: chat.role,
      content: chat.content
    }
  })

  if (mode == 'code') {
    temperature = 0.3;

    messages.push({ 'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.' });
    messages.push({ 'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets, and no other text. Let\'s get started!' });
  }

  messages = messages.concat(allPrevChats);
  messages.push({ role: 'user', content: newMsg });

  // Make sure I'm not going over the max token limit.
  while (!tokenCountFunc(messages, TOKEN_THRESHOLD)) {
    allPrevChats.shift();
    messages = [];

    if (mode == 'code') {
      temperature = 0.3;

      messages.push({ 'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.' });
      messages.push({ 'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!' });
    }

    messages = messages.concat(allPrevChats);
    messages.push({ role: 'user', content: newMsg });
  }

  try {
    const content = await genChat(engine, messages, { top_p, temperature });

    // TODO: Get rid of this garbage. any should be banned, but it's currently 12:23 AM and I have to wake up early tomorrow
    // const openAiRes = await axios.post(url, data, reqConfig);
    const assistantChat = {
      conversationId: convId,
      role: 'assistant',
      content,
      timestamp: Date.now()
    }

    const responseData: any = {
      success: true,
      msg: 'Successfully received response.',
      newChat: assistantChat
    }

    if (conv) {
      responseData['newConversation'] = conv;
    }

    const savedAssistantChat = await chatService.saveModel(new Chat(assistantChat));
    const savedUserChat = await chatService.saveModel(new Chat(userChat));

    if (!savedAssistantChat || !savedUserChat) {
      console.log('SAVE ERROR:');
      console.log(savedAssistantChat);
      console.log(savedUserChat);
    }

    return res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: 'Something broke with Zokyo\'s backend' });
  }
};
