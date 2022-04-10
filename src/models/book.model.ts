import { Document } from 'mongoose';

export interface IBook extends Document {
  pages: number;
  title: number;
  author: string;
  finished: boolean;
  synopsisId: string;
}
