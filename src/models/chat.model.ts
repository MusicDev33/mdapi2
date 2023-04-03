import { Document } from 'mongoose';

/*
Still planning this thing out, so I'm not sure how I want to structure it. Here are some considerations:

- conversationId: You should be able to store multiple conversations with ChatGPT, which is also done in the 
normal web app. The conversationId will just be a Mongo-generated ID.

- role: This will be either user or assistant, per OpenAI's specs

- content: I like message or simply just 'msg', but I'll use content just so it's interchangeable with OpenAI's spec. This is the message body.

- timestamp: This will be millis since epoch, and will be how I order the chats. The question is, do I do this server side or client side?

*/

export interface IChat extends Document {
  conversationId: string;
  role: string;
  content: string;
  timestamp: number;
}
