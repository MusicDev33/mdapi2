import { Document } from 'mongoose';

export interface IBook extends Document {
  pages: number;
  title: string;
  author: string;
  finished: boolean;
}
