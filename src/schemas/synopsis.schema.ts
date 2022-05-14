import mongoose, { Schema, Model } from 'mongoose';
import { ISynopsis } from '@models/synopsis.model';

const SynopsisSchema: Schema = new Schema({
	bookId: {type: String, required: true, unique: true},
	writeUpLink: {type: String, required: false},
	description: {type: String, required: false}
},{
	minimize: false
});

export const Synopsis: Model<ISynopsis> = mongoose.model<ISynopsis>('Synopsis', SynopsisSchema);
