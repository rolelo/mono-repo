import { v4 as uuidv4 } from "uuid";
import { ApplicantStatus, Context, IApplicant, JobApplicationInput, Listing } from '../../../common/models';
import { s3Client } from '../app';

export const resolvers = {
  Mutation: {
    async createCVS3PreSignedUrl(_, { contentType }) {
      const uuid = uuidv4();
      const { url, fields } = s3Client.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Conditions: [
          { acl: "public-read" },
          { bucket: process.env.BUCKET_NAME },
          ["starts-with", "$key", "cv/"],
          ["eq", "$Content-Type", "application/pdf"],
        ],
        Fields: {
          acl: "public-read",
          key: `cv/${uuid}`,
        },
      });

      return {
        url,
        uuid,
        fields: JSON.stringify(fields),
      };
    },
    createJobApplication: async (
      parent,
      { input: { jobId } }: { input: JobApplicationInput },
      { sub }: Context
    ): Promise<IApplicant> => {
      const applicationId = uuidv4();
      const listing = await Listing.findById(jobId);
      const createdDate = Date.now().toString();
      listing.applicants.push({
        id: uuidv4(),
        createdDate,
        userId: sub,
        status: ApplicantStatus.PENDING
      });
      await listing.save();
      return {
        id: applicationId,
        createdDate,
        userId: sub,
        status: ApplicantStatus.PENDING,
      };
    }
  },
};
