import {model, Model, Schema} from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  organisationIds: string[];
}

const userSchema = new Schema<IUser>({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  name: {type: String, required: true},
  organisationIds: {type: [String], required: true, default: []},
  phoneNumber: {type: String, required: false},
});

export const User: Model<IUser> = model('User', userSchema);
