import { Document } from 'mongoose';

export interface ISynopsis extends Document {
  bookId: string;
  writeUpLink?: string; // this allows for flexibility on where I host the write up
  description: string; // this will be a string of markdown
}
