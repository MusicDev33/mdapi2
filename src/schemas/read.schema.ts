import mongoose, { Schema, Model } from 'mongoose';
import { IRead } from '@models/read.model';

const ReadSchema: Schema = new Schema({
	bookId: {type: String, required: true},
	currentPage: {type: Number, required: false},
	current: {type: Boolean, required: true},
	finishDate: {type: Date, required: true}
},{
	minimize: false
});

export const Read: Model<IRead> = mongoose.model<IRead>('Read', ReadSchema);
