import {
  Context,
  IOrganisation,
  IUser,
  Organisation,
  Profile,
  User,
} from "../../../common/models";

const createUser = async (_id, name, email, phoneNumber) => {
  const user = new User({
    _id,
    name,
    email,
    phoneNumber,
  });

  await user.save();
  return user.toObject();
};

export const resolvers = {
  Query: {
    user: async (
      _parent,
      _args,
      { sub, email, name, phoneNumber, ...rest }: Context
    ): Promise<IUser> => {
      const user = await (await User.findById(sub)).toObject();

      if (!user) {
        return createUser(sub, name, email, phoneNumber);
      }

      return {
        ...user
      };
    },
  },
  Mutation: {
    createUser: async (
      _parent,
      { sub, email, name, phoneNumber }: Context
    ): Promise<IUser> => createUser(sub, name, email, phoneNumber),
    createProfile: async (
      _parent,
      { input }: { input: Profile },
      { sub }: Context
    ): Promise<Profile> => {
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
