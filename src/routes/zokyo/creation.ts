import { Request, Response } from 'express';
import { OPEN_AI_API_KEY } from '@config/constants';

import { get_encoding, encoding_for_model } from '@dqbd/tiktoken';

import axios from 'axios';

const TOKEN_THRESHOLD = 4096;
const encoder = encoding_for_model('gpt-3.5-turbo-0301');

export const createNewChatRoute = async (req: Request, res: Response) => {
  let temperature = 1;
  let top_p = 1;

  const userChats = req.body.chats;

  const url ='https://api.openai.com/v1/chat/completions';
  const reqConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPEN_AI_API_KEY}`
    }
  }

  let messages = [];

  if (req.body.mode == 'code') {
    temperature = 0.3;

    messages.push({'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.'});
    messages.push({'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!'});
  }

  messages.push({'role': 'system', 'content': `The date is ${getDate()} in San Francisco.`});
  messages = messages.concat(userChats);

  while (!tokenCountValid(messages)) {
    userChats.shift();

    messages = [];

    if (req.body.mode == 'code') {
      temperature = 0.3;

      messages.push({'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more. Do not bother explaining what the code does.'});
      messages.push({'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!'});
    }

    messages.push({'role': 'system', 'content': `The date is ${getDate()} in San Francisco.`});
    messages = messages.concat(userChats);
  }

  console.log('Chats');

  const data = {
    model: 'gpt-3.5-turbo',
    messages,
    temperature,
    top_p
  }

  console.log(data);

  try {
    // TODO: Get rid of this garbage. any should be banned, but it's currently 12:23 AM and I have to wake up early tomorrow
    const openAiRes = await axios.post(url, data, reqConfig);
    let resData = openAiRes.data;
    resData['success'] = true;


    console.log(resData);

    return res.status(200).json(resData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({success: false, msg: 'Something broke with Zokyo\'s backend'});
  }
};

const tokenCountValid = (messages: any[]) => {
  let total = 0;

  for (let message of messages) {
    total += encoder.encode(message.content).length;
  }

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


