export type JobApplicationInput = {
  jobId: string,
}
export interface IJobApplication {
  _id: string,
}

export enum ApplicantStatus {
  'LISTED' = 'LISTED',
  'REJECTED' = 'REJECTED',
  'PENDING' = 'PENDING',
}
export type UpdateApplicationStatusInput = {
  jobId: string
  userId: string
  status: ApplicantStatus
}
export type IApplicant = {
  id: string;
  userId: string;
  createdDate: string;
  status: ApplicantStatus;
}