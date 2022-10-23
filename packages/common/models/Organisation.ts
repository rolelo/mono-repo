import {model, Model, Schema} from 'mongoose';
import {IUser, User} from './User';

export interface CreateOrganisationInput {
  name: string,
  website: string,
  companyLogo: string,
  companyDescription: string,
  email: string,
  totalPositions: number,
}

export interface CreateOrganisation {
  name: string;
  website: string;
  companyLogo: string;
  companyDescription: string;
  email: string;
}

export interface Organisation {
  _id: string;
  admin: User;
  name: string;
  website: string;
  companyLogo: string;
  companyDescription: string;
  email: string;
  totalPositions: number;
  createdDate: string;
}

export interface IOrganisation {
  _id: string;
  adminId: string;
  people: IUser[];
  name: string;
  website: string;
  companyLogo: string;
  companyDescription: string;
  email: string;
  totalPositions: number;
  createdDate: string;
}

const organisationSchema = new Schema<IOrganisation>({
  _id: {type: String, required: true},
  adminId: {type: String, required: true},
  people: {type: [Object], required: true},
  name: {type: String, required: true},
  website: {type: String, required: true},
  companyLogo: {type: String, required: true},
  companyDescription: {type: String, required: true},
  email: {type: String, required: true},
  totalPositions: {type: Number, required: true},
  createdDate: {type: String, required: true},
});

export const Organisation: Model<IOrganisation> = model(
    'Organisation', organisationSchema);
