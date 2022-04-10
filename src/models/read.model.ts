import { Document } from 'mongoose';

export interface IRead extends Document {
  bookId: string;
  currentPage?: number;
  current: boolean;
  finishDate: Date;
}
