import {Context, CreateOrganisationInput, Organisation, User} from '../models';
import {v4 as uuidv4} from 'uuid';

export const resolvers = {
  Mutation: {
    async createOrganisation(
        _, {input}: { input: CreateOrganisationInput }, {sub}: Context) {
      const user = await User.findById(sub);
      const _id = uuidv4();
      const organisation = new Organisation({
        _id,
        adminId: sub,
        ...input,
        totalPositions: 0,
        companyLogo: 'amir',
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
