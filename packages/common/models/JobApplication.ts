import { model, Model, Schema } from "mongoose";

export type JobApplicationInput = {
  name: string,
  phoneNumber: string,
  email: string,
  cvUrl: string,
  jobId: string,
}
export interface IJobApplication {
  _id: string,
  name: string,
  email: string,
  cvUrl: string,
  phoneNumber: string,
  createdDate: string,
}

const jobApplicationSchema = new Schema<IJobApplication>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  cvUrl: { type: String, required: true },
  createdDate: { type: String, required: true },
});
export const JobApplication: Model<IJobApplication> = model("JobApplication", jobApplicationSchema);

