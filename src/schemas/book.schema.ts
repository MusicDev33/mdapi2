import mongoose, { Schema, Model } from 'mongoose';
import { IBook } from '@models/book.model';

const BookSchema: Schema = new Schema({
	pages: {type: Number, required: true},
	title: {type: String, required: true},
	author: {type: String, required: true},
	finished: {type: Boolean, required: true}
},{
	minimize: false
});

export const Book: Model<IBook> = mongoose.model<IBook>('Book', BookSchema);
