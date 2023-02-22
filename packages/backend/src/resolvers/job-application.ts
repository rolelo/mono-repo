import { v4 as uuidv4 } from "uuid";
import { ApplicantStatus, Context, IApplicant, JobApplicationInput, Listing, User } from '../../../common/models';
import { s3Client } from '../app';
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const resolvers = {
  Query: {
    jobApplications: async (_parent, _params, { sub }): Promise<IApplicant[]> => {
      const user = (await User.findById(sub)).toObject();

      if (!user) throw Error("No user found");
      const listings = await Listing.find({
        _id: {
          $in: user.jobApplicants
        }
      });

      const applicants: IApplicant[] = [];
      
      listings.forEach(l => {
        const application = l.applicants.find(a => a.userId === sub);
        if (application) applicants.push({ ...application, jobId: l.id });
      })

      return applicants;
    }
  },
  Mutation: {
    async createCVS3PreSignedUrl(_, { contentType }) {
      const uuid = uuidv4();
      const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: process.env.BUCKET_NAME,
        Conditions: [
          { acl: "public-read" },
          { bucket: process.env.BUCKET_NAME },
          ["starts-with", "$key", "cv/"],
          ["eq", "$Content-Type", "application/pdf"],
        ],
        Key: `cv/${uuid}`,
        Fields: {
          acl: "public-read",
        },
      });

      return {
        url,
        uuid,
        fields: JSON.stringify(fields),
      };
    },
    createJobApplication: async (
      _parent,
      { input: { jobId } }: { input: JobApplicationInput },
      { sub }: Context
    ): Promise<IApplicant> => {
      const applicationId = uuidv4();
      const user = await User.findById(sub);
      const listing = await Listing.findById(jobId);
      const createdDate = Date.now().toString();
      listing.applicants.push({
        id: uuidv4(),
        createdDate,
        userId: sub,
        status: ApplicantStatus.PENDING
      });

      const isExist = user.jobApplicants.find(ja => ja === listing.id);

      if (isExist) throw Error("You have applied to this position already");
      user.jobApplicants.push(listing.id);

      await Promise.all([listing.save(), user.save()]);

      return {
        id: applicationId,
        createdDate,
        userId: sub,
        status: ApplicantStatus.PENDING,
      };
    }
  },
};
