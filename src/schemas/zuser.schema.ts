import mongoose, { Schema, Model } from 'mongoose';
import { IZUser } from '@models/zuser.model';

const ZUserSchema: Schema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 8 },
	modelPref: { type: String, required: false },
}, {
	minimize: false
});

export const ZUser: Model<IZUser> = mongoose.model<IZUser>('ZUser', ZUserSchema);
