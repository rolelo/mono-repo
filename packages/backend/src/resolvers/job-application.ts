import { v4 as uuidv4 } from "uuid";
import { Context, IJobApplication, IUser, JobApplicationInput, Listing, User } from '../../../common/models';
import { s3Client } from '../app';

export const resolvers = {
  Query: {
    jobApplicants: async (_, { jobId }): Promise<IUser[]> => {
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
      { input: { jobId } }: { input: JobApplicationInput },
      { sub, name, email, phoneNumber }: Context
    ): Promise<IJobApplication> => {
      const user = await (await User.findById(sub)).toObject();
      if (!user.profile) throw Error("User does not have a profile setup");
      const listing = await Listing.findById(jobId);
      const createdDate = Date.now().toString();
      listing.applications.push({
        ...user
      });
      await listing.save();
      return {
        _id: sub,
        createdDate,
        name,
        email,
        phoneNumber,
        cvUrl: user.profile.cv
      };
    },
  },
};
