import { Document } from 'mongoose';

// Xenon Book Section - Raw version
// The raw version is not parsed by a human
export interface IXRawSection extends Document {
  sourceName: string;
  sourceId: string;
  sectionId: string;
  content: string;
}
