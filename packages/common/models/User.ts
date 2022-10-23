import {model, Model, Schema} from 'mongoose';
import { Organisation } from './Organisation';

export interface IUser {
  _id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  organisationIds: string[];
}

export interface User {
  name: string
  email: string
  phoneNumber: string
  organisations: Organisation[]
}

const userSchema = new Schema<IUser>({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  name: {type: String, required: true},
  organisationIds: {type: [String], required: true, default: []},
  phoneNumber: {type: String, required: false},
});

export const User: Model<IUser> = model('User', userSchema);
