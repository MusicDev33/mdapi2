import axios from 'axios';
import { Request, Response } from 'express';
import { encode } from 'gpt-3-encoder';

import chatService from '@services/chat.service';
import { Chat } from '@schemas/chat.schema';

import conversationService from '@services/conversation.service';
import { Conversation } from '@schemas/conversation.schema';

import { OPEN_AI_API_KEY } from '@config/constants';

import { generateName } from './naming';

const TOKEN_THRESHOLD = 4096;

export const createNewChatRoute = async (req: Request, res: Response) => {
  let user = req.body.user;
  let convId: string = req.body.convId;

  let conv = null;

  if (convId == '') {
    const convName = generateName();
    const newConv = new Conversation({
      user: user,
      name: convName
    });

    conv = await conversationService.saveModel(newConv);
    if (!conv) {
      return res.status(500).json({success: false, msg: 'Something broke with Zokyo\'s backend'});
    }
    
    convId = '' + conv.id;
  }

  let temperature = 1;
  let top_p = 1;

  const newMsg: string = req.body.msg;

  const url ='https://api.openai.com/v1/chat/completions';
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
  let allPrevChatsData = await chatService.findModelsByParameter('conversationId', convId, {timestamp: 1});
  if (!allPrevChatsData) {
    return res.status(500).json({success: false, msg: 'Something broke with Zokyo\'s backend'});
  }

  let allPrevChats = allPrevChatsData?.map((chat) => {
    return {
      role: chat.role,
      content: chat.content
    }
  })

  if (req.body.mode == 'code') {
    temperature = 0.3;

    messages.push({'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.'});
    messages.push({'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!'});
  }

  messages.push({'role': 'system', 'content': `The date is ${getDate()} in San Francisco.`});
  messages = messages.concat(allPrevChats);
  messages.push({role: 'user', content: newMsg});

  // Make sure I'm not going over the max token limit.
  while (!tokenCountValid(messages)) {
    allPrevChats.shift();
    console.log(allPrevChats);

    messages = [];

    if (req.body.mode == 'code') {
      temperature = 0.3;

      messages.push({'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.'});
      messages.push({'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!'});
    }

    messages.push({'role': 'system', 'content': `The date is ${getDate()} in San Francisco.`});
    messages = messages.concat(allPrevChats);
    messages.push({role: 'user', content: newMsg});
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
    return res.status(500).json({success: false, msg: 'Something broke with Zokyo\'s backend'});
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

// Written by ChatGPT!
const getDate = (): string => {
  const date: Date = new Date();

  const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month: string = months[date.getMonth()];

  const suffixes: string[] = ['st', 'nd', 'rd', 'th'];
  let day: number = date.getDate();
  let suffix: string;
  if (day < 4 || day > 20) {
    suffix = suffixes[day % 10 - 1] || suffixes[3];
  } else {
    suffix = suffixes[3];
  }
  const dayString: string = `${day}${suffix}`;

  const year: number = date.getFullYear();

  let hours: number = date.getHours();
  const ampm: string = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12;
  const minutes: number = date.getMinutes();

  const dateString: string = `${month} ${dayString}, ${year}, ${hours}:${minutes} ${ampm}`;

  const utcString: string = date.toUTCString();

  return `${dateString} (${utcString})`;
};


