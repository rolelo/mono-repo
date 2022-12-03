export const typedef = `
input JobApplicationInput {
  jobId: String!
}
input UpdateApplicationStatusInput {
  jobId: String!
  userId: String!
  status: ApplicantStatus!
}
  type Applicant {
    id: String!
    createdDate: String!
    user: User!
    status: ApplicantStatus
  }
  type JobApplication {
    name: String!
    email: String!
    cvUrl: String!
    jobId: String!
    createdDate: String!
  }
`;