import { Document } from 'mongoose';

// Fixed up by a human
export interface IXSection extends Document {
  sourceName: string;
  sourceId: string;
  sectionId: string;
  sectionName: string;
  content: string;
  sequence: number;
}
