import { Document } from 'mongoose';

// Xenon Book Section - Raw version
// The raw version is not parsed by a human
export interface IXRawSection extends Document {
  sourceId: string;
  sectionId: string;
  content: string;
  sequence: number;
}
