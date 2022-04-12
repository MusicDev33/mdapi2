import { Document } from 'mongoose';

/*

Role Format: a0

This format allows 260 levels of clearance, a0 being the lowest, z9 being the highest.

*/

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}
