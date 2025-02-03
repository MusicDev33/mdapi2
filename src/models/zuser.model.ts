// A ZUser is just a Zokyo user. Maybe I'll add some attribute that will let me differentiate...

import { Document } from 'mongoose';

export interface IZUser extends Document {
  username: string;
  password: string;
  modelPref: string;
}
