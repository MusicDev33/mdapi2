import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@models/user.model';

const UserSchema: Schema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true, minlength: 8},
	role: {type: String, required: true, default: 'a0'}
},{
	minimize: false
});

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
