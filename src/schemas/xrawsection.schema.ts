import mongoose, { Schema, Model } from 'mongoose';
import { IXRawSection } from '@models/xrawsection.model';

const XRawSectionSchema: Schema = new Schema({
	sourceId: {type: String, required: true},
	sectionId: {type: String, required: true},
	content: {type: String, required: true},
	sequence: {type: Number, required: true},
},{
	minimize: false
});

export const XRawSection: Model<IXRawSection> = mongoose.model<IXRawSection>('XRawSection', XRawSectionSchema);
