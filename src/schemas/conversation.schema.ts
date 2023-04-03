import mongoose, { Schema, Model } from 'mongoose';
import { IConversation } from '@models/conversation.model';

const ConversationSchema: Schema = new Schema({
	user: {type: String, required: true},
	name: {type: String, required: true}
},{
	minimize: false
});

export const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', ConversationSchema);
