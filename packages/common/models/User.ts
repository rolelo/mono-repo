import { model, Model, Schema } from 'mongoose';
import { Organisation } from './Organisation';
import { Profile } from './Profile';

export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  organisations: Organisation[]
  profile?: Profile
  jobApplicants: string[]
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  organisationIds: string[];
  profile?: Profile;
  jobApplicants: string[];
}

const userSchema = new Schema<IUser>({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  name: {type: String, required: true},
  organisationIds: {type: [String], required: true, default: []},
  phoneNumber: { type: String, required: false },
  profile: { type: Object, required: false },
  jobApplicants: { type: [String], required: true, default: [] }
});

export const User: Model<IUser> = model('User', userSchema);
