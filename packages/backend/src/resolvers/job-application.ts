import { v4 as uuidv4 } from "uuid";
import { IJobApplication, JobApplication, JobApplicationInput, Listing } from '../../../common/models';
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
      { input: { jobId, ...rest } }: { input: JobApplicationInput } 
    ): Promise<IJobApplication> => {
      const listing = await Listing.findById(jobId);
      listing.applications.push(rest);
      await listing.save();
      return rest;
    },
  },
};
