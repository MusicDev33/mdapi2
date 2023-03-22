import { Request, Response } from 'express';
import { OPEN_AI_API_KEY } from '@config/constants';

import axios from 'axios';

export const createNewChatRoute = async (req: Request, res: Response) => {
  console.log(req.body.msg)

  const url ='https://api.openai.com/v1/chat/completions';
  const reqConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPEN_AI_API_KEY}`
    }
  }

  let messages = [
    {'role': 'user', 'content': 'You are a terse code completion machine. You will answer future questions with just code and nothing more.'},
    {'role': 'assistant', 'content': 'Okay, I will answer your future questions with just code snippets. Let\'s get started!'}
  ]

  messages.push({
    role: 'user',
    content: req.body.msg
  });

  const data = {
    model: 'gpt-3.5-turbo',
    messages
  }

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
