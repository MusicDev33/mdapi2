import mongoose, { Schema, Model } from 'mongoose';
import { IXRawSection } from '@models/xrawsection.model';

const XRawSectionSchema: Schema = new Schema({
	sourceName: {type: String, required: true},
	sourceId: {type: String, required: true},
	sectionId: {type: String, required: true},
	content: {type: String, required: true}
},{
	minimize: false
});

export const XRawSection: Model<IXRawSection> = mongoose.model<IXRawSection>('XRawSection', XRawSectionSchema);
