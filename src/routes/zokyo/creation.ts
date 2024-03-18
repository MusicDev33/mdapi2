import axios from 'axios';
import { Request, Response } from 'express';

import { encode } from 'gpt-3-encoder';
import { countTokens } from '@anthropic-ai/tokenizer';
import { OPEN_AI_API_KEY } from '@config/constants';

import chatService from '@services/chat.service';
import conversationService from '@services/conversation.service';

import { Chat } from '@schemas/chat.schema';
import { Conversation } from '@schemas/conversation.schema';

import { generateName } from './naming';
import { getDate } from './chatutil';
import { brotliCompress } from 'zlib';

const TOKEN_THRESHOLD = 4096;

/*
Chat abstraction handlers. I really only care about supporting both ChatGPT and Claude here, 
*/

const genChatOpenAi = () => {
  return false;
}

const genChatClaude = () => {
  return false;
}

const genChat = () => {
  const chatMap = {
    'claude': genChatClaude,
    'chatgpt': genChatOpenAi
  }

  const generalConfig = {

  }

  const generalHeaders = {
    'Content-Type': 'application/json',
  }
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
}
const validateBody = (body: any): CreateChatBody | false => {
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

  return { // Implicit string conversions
    user: '' + body.user,
    convId: '' + body.convId,
    msg: '' + body.msg,
  }
}

export const createNewChatRoute = async (req: Request, res: Response) => {
  const body = validateBody(req.body);
  if (!body) {
    return res.status(400).json({ success: false });
  }

  let user = body.user;
  let convId = body.convId;
  let conv = null;

  if (convId == '') {
    const convName = generateName();
    const newConv = new Conversation({
      user: user,
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

  const newMsg = body.msg;

  const url = 'https://api.openai.com/v1/chat/completions';
  const reqConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPEN_AI_API_KEY}`
    }
  }

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

  if (req.body.mode == 'code') {
    temperature = 0.3;

    messages.push({ 'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.' });
    messages.push({ 'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!' });
  }

  messages.push({ 'role': 'system', 'content': `The date is ${getDate()} in San Francisco.` });
  messages = messages.concat(allPrevChats);
  messages.push({ role: 'user', content: newMsg });

  // Make sure I'm not going over the max token limit.
  while (!tokenCountValid(messages)) {
    allPrevChats.shift();
    console.log(allPrevChats);

    messages = [];

    if (req.body.mode == 'code') {
      temperature = 0.3;

      messages.push({ 'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.' });
      messages.push({ 'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!' });
    }

    messages.push({ 'role': 'system', 'content': `The date is ${getDate()} in San Francisco.` });
    messages = messages.concat(allPrevChats);
    messages.push({ role: 'user', content: newMsg });
  }

  const data = {
    model: 'gpt-3.5-turbo',
    messages,
    temperature,
    top_p
  }

  try {
    // TODO: Get rid of this garbage. any should be banned, but it's currently 12:23 AM and I have to wake up early tomorrow
    const openAiRes = await axios.post(url, data, reqConfig);
    const assistantChat = {
      conversationId: convId,
      role: 'assistant',
      content: openAiRes.data.choices[0].message.content,
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

const tokenCountValid = (messages: any[]) => {
  let total = 0;

  for (let message of messages) {
    total += encode(message.content).length;
  }

  console.log(total);

  if (total > TOKEN_THRESHOLD) {
    return false;
  }

  return true;
}

const tokenCountValidOpenAi = (messages: any[]) => {
  let total = 0;

  for (let message of messages) {
    total += encode(message.content).length;
  }

  console.log(total);

  if (total > TOKEN_THRESHOLD) {
    return false;
  }

  return true;
}

const tokenCountValidClaude = (messages: any[]) => {
  let total = 0;

  for (let message of messages) {
    total += countTokens(message.content);
  }

  if (total > TOKEN_THRESHOLD) {
    return false;
  }

  return true;
}
