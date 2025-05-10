import axios from 'axios';
import { Request, Response } from 'express';

import { OPEN_AI_API_KEY, ANTHROPIC_API_KEY, DEEPSEEK_API_KEY } from '@config/constants';

import chatService from '@services/chat.service';
import conversationService from '@services/conversation.service';

import { Chat } from '@schemas/chat.schema';
import { Conversation } from '@schemas/conversation.schema';

import { generateName } from './naming';
import { getDate } from './chatutil';
import { tokenCountDict, ChatEngine } from './engine';
import { genErrorMessage } from './err';
import { getSystemErrorMap } from 'util';

const TOKEN_THRESHOLD = 4096 * 2;

/*
Chat abstraction handlers. I really only care about supporting both ChatGPT and Claude here
*/

const genChatConfig = (engine: ChatEngine) => {
  const urlMap: Record<ChatEngine, string> = {
    'chatgpt': 'https://api.openai.com/v1/chat/completions',
    'claude': 'https://api.anthropic.com/v1/messages',
    'deepseek': 'https://api.deepseek.com/v1/chat/completions',
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
    },
    'deepseek': {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
  }

  // TODO: Add model selection
  // TODO: Add automatic model updates
  const modelMap: Record<ChatEngine, string> = {
    'chatgpt': 'gpt-4o',
    'claude': 'claude-3-7-sonnet-20250219',
    'deepseek': 'deepseek-chat',
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

const getSysPrompt = (): string => {
  return `The date is ${getDate()} in San Francisco.`;
}

const genChatOpenAi = async (messages: any[], agentConfig: AgentConfig): Promise<string> => {
  const config = genChatConfig('chatgpt');
  const data = {
    messages,
    top_p: agentConfig.top_p,
    temperature: agentConfig.temperature,
    model: config.model,
  }

  const res = await axios.post(config.url, data, { headers: config.headers });
  return res.data.choices[0].message.content as string
}

const genChatClaude = async (messages: any[], agentConfig: AgentConfig): Promise<string> => {
  const config = genChatConfig('claude');
  const data = {
    messages,
    temperature: agentConfig.temperature,
    model: config.model,
    max_tokens: 1024,
    system: getSysPrompt()
  }

  const res = await axios.post(config.url, data, { headers: config.headers });
  return res.data.content[0].text as string;
}

const genChatDeepSeek = async (messages: any[], agentConfig: AgentConfig): Promise<string> => {
  const config = genChatConfig('deepseek');
  const data = {
    messages,
    temperature: agentConfig.temperature,
    model: config.model,
    max_tokens: 1024,
    system: getSysPrompt()
  }

  const res = await axios.post(config.url, data, { headers: config.headers });
  return res.data.content[0].text as string;
}

const genChat = async (engine: ChatEngine, messages: any[], agentConfig: AgentConfig): Promise<string> => {
  const chatFunctions: Record<ChatEngine, (messages: any[], agentConfig: AgentConfig) => Promise<string>> = {
    'claude': genChatClaude,
    'chatgpt': genChatOpenAi,
    'deepseek': genChatDeepSeek,
  }

  const chatFunction = chatFunctions[engine];
  return await chatFunction(messages, agentConfig);
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
  // Oh, the things we do to keep TypeScript
  const engines: Record<ChatEngine, true> = {
    chatgpt: true,
    claude: true,
    deepseek: true,
  }
  return str in engines;
}

const validateBody = (body: any): CreateChatBody | false => {
  if (
    !body.user ||
    !body.mode ||
    !('convId' in body) ||
    !body.msg?.trim()) {
    return false;
  }

  const engine: ChatEngine = isChatEngine(body.engine) ? body.engine : 'claude';

  return { // Implicit string conversions
    user: '' + body.user,
    convId: '' + body.convId,
    msg: '' + body.msg,
    mode: '' + body.mode,
    engine
  }
}

// TODO: This should be middleware to be honest, but I have better things to do than write good code in my free time
// It turns out it's really hard to track IPs these days.
const handleSecureEngine = (ip: string, engine: ChatEngine): ChatEngine => {
  // If IP in some range, turn off DeepSeek for security reasons
  // Basically check if the IP is from a range where I need more security,
  // and if so, check if the engine is compatible with those security settings
  if (engine == 'deepseek') {
    return 'claude'
  }
  return engine;
}

export const createNewChatRoute = async (req: Request, res: Response) => {
  const body = validateBody(req.body);
  if (!body) {
    return res.status(400).json({ success: false });
  }

  const user = body.user;
  const mode = body.mode;
  const newMsg = body.msg;
  const engine = handleSecureEngine(req.ip, body.engine);
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
    // TODO: More detailed error handling
    // I would like to give SOME amount of debug info to the client. Like those annoying 529 errors.
    // Also add a proper data property that Zokyo can use
    console.log(err);
    return res.status(500).json({ success: false, msg: 'Something broke with Zokyo\'s backend' });
  }
};
