import { Document } from 'mongoose';

export interface IXSource extends Document {
  sourceId: string;
  sourceName: string;
}
