import mongoose, { Schema, Model } from 'mongoose';
import { IChat } from '@models/chat.model';

const ChatSchema: Schema = new Schema({
	conversationId: {type: String, required: true},
	role: {type: String, required: true},
	content: {type: String, required: true},
	timstamp: {type: Number, required: true}
},{
	minimize: false
});

export const Chat: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);
