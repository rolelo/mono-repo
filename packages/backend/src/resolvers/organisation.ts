import { v4 as uuidv4 } from 'uuid';
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { Context, CreateOrganisationInput, Organisation, User } from '../../../common/models';
import { s3Client } from '../app';

export const resolvers = {
  Mutation: {
    async createOrganisationS3PreSignedUrl(
      _, { contentType }) {
          const uuid = uuidv4();
          const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: process.env.BUCKET_NAME,
            Conditions: [
              { acl: "public-read" },
              { bucket: process.env.BUCKET_NAME },
              ["starts-with", "$key", "organisation-logos/"],
              ["starts-with", "$Content-Type", "image/"],
            ],
            Key: `organisation-logos/${uuid}`,
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
    async createOrganisation(
        _, {input}: { input: CreateOrganisationInput }, {sub}: Context) {
      const user = await User.findById(sub);
      const _id = uuidv4();
      const organisation = new Organisation({
        _id,
        adminId: sub,
        ...input,
        totalPositions: 0,
        people: [],
        createdDate: Date.now().toString(),
      });
      user.organisationIds.push(_id);
      user.save();
      organisation.save();

      return {
        ...organisation.toObject(),
        admin: user,
      };
    },
    deleteOrganisation: async (_, {_id}: { _id: string }, {sub}: Context) => {
      const user = await User.findById(sub);
      const orgFiltered = user.organisationIds.filter(
          (oid) => oid !== _id);
      user.organisationIds = orgFiltered;
      await user.save();
      await Organisation.deleteOne({
        $and: [{_id, adminId: sub}],
      });
      return _id;
    },
  },
  Organisation: {
    admin: async ({adminId}) => {
      return User.findById(adminId);
    },
  },
};
