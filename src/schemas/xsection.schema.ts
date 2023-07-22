import mongoose, { Schema, Model } from 'mongoose';
import { IXSection } from '@models/xsection.model';

const XSectionSchema: Schema = new Schema({
	sourceName: {type: String, required: true},
	sourceId: {type: String, required: true},
	sectionId: {type: String, required: true},
	sectionName: {type: String, required: true},
	content: {type: String, required: true},
},{
	minimize: false
});

export const XSection: Model<IXSection> = mongoose.model<IXSection>('XSection', XSectionSchema);
