import {Context, IOrganisation, IUser, Organisation, User} from '../../../common/models';

export const resolvers = {
  Query: {
    user: async (parent, args, {sub}: Context): Promise<IUser> => {
      const {_id, name,
        email, phoneNumber, organisationIds} = await User.findById(sub);
      return {
        _id,
        name,
        email,
        phoneNumber,
        organisationIds,
      };
    },
  },
  Mutation: {
    createUser: async (
        parent,
        args,
        {sub, email, name, phoneNumber}: Context,
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
  },
  User: {
    async organisations({organisationIds},
        _, {sub}: Context): Promise<IOrganisation[]> {
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
