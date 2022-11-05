import { v4 as uuidv4 } from "uuid";
import { IJobApplication, JobApplicationInput, Listing } from '../../../common/models';
import { s3Client } from '../app';

export const resolvers = {
  Query: {
    jobApplicants: async (_, { jobId }): Promise<IJobApplication[]> => {
      const jobApplicants = await Listing.findById(jobId);
      return jobApplicants.applications;
    }
  },
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
      { input: { jobId, phoneNumber, ...rest } }: { input: JobApplicationInput } 
    ): Promise<IJobApplication> => {
      const _id = uuidv4();
      const listing = await Listing.findById(jobId);
      const createdDate = Date.now().toString();
      listing.applications.push({
        _id,
        createdDate,
        phoneNumber,
        ...rest,
      });
      await listing.save();
      return {
        _id,
        createdDate,
        phoneNumber,
        ...rest,
      };
    },
  },
};
