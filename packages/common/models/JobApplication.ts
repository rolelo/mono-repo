import { model, Model, Schema } from "mongoose";

type JobApplicationInput = {
  name: string
  email: string
  cvUrl: string
}
export interface IJobApplication {
  _id: string,
  name: string,
  email: string,
  phoneNumber: string,
  cvUrl: string,
}

const jobApplicationSchema = new Schema<IJobApplication>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  cvUrl: { type: String, required: true },
});
export const JobApplication: Model<IJobApplication> = model("JobApplication", jobApplicationSchema);

