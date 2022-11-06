import {Context, IOrganisation, IUser, Organisation, Profile, User} from '../../../common/models';

export const resolvers = {
  Query: {
    user: async (parent, args, { sub }: Context): Promise<IUser> => {
      const { _id, name, email, phoneNumber, organisationIds, profile } =
        await User.findById(sub);
      return {
        _id,
        name,
        email,
        phoneNumber,
        organisationIds,
        profile,
      };
    },
  },
  Mutation: {
    createUser: async (
      parent,
      { sub, email, name, phoneNumber }: Context
    ): Promise<IUser> => {
      const user = new User({
        _id: sub,
        name,
        email,
        phoneNumber,
      });

      await user.save();
      return user.toObject();
    },
    createProfile: async (parent, { input }: { input: Profile }, { sub }: Context): Promise<Profile> => {
      const user = await User.findById(sub);
      user.profile = input;
      await user.save();
      return input;
    },
  },
  User: {
    async organisations(
      { organisationIds },
      _,
      { sub }: Context
    ): Promise<IOrganisation[]> {
      let ogids: string[] = organisationIds || [];
      if (!ogids) {
        const user = await User.findById(sub);
        ogids = user.organisationIds;
      }

      const organisationPromises = [];
      for (let i = 0; i < ogids.length; i++) {
        organisationPromises.push(Organisation.findById(ogids[i]));
      }

      return Promise.all(organisationPromises);
    },
  },
};
