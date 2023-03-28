import { Document } from 'mongoose';

export interface IChat extends Document {
  created: number;
  body: string;
  conversationId: string;
  user: string;
}
