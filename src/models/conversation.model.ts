import { Document } from 'mongoose';

export interface IConversation extends Document {
  user: string;
}
