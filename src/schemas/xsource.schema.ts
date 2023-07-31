import mongoose, { Schema, Model } from 'mongoose';
import { IXRawSection } from '@models/xrawsection.model';
import { IXSource } from '@models/xsource.model';

const XSourceSchema: Schema = new Schema({
	sourceId: {type: String, required: true},
	sourceName: {type: String, required: true},
},{
	minimize: false
});

export const XSource: Model<IXSource> = mongoose.model<IXSource>('XSource', XSourceSchema);
