import { v4 as uuidv4 } from "uuid";
import {
  Context, IListing,
  Listing,
  ListingInput,
  Organisation,
  User
} from "../../../common/models";

export const resolvers = {
  Query: {
    async listings(_, { organisationId }: { organisationId: string }, { sub }: Context) {
      const query = {
        ...(organisationId ? { organisationId } : { createdById: sub }),
    }
      const listings = (await Listing.find(query).exec());
      return listings.map(l => l.toObject());
    }
  },
  Mutation: {
    async createListing(
      _,
      { input }: { input: ListingInput },
      { sub }: Context
    ) {
      const { organisationId, ...listingBase } = input;
      const user = (await User.findById(sub)).toObject();
      const organisation = (await Organisation.findById(organisationId)).toObject();
      
      const newListing: IListing = {
        _id: uuidv4(),
        organisationId: organisation._id,
        organisationName: organisation.name,
        organisationDescription: organisation.companyDescription,
        organisationWebsite: organisation.website,
        createdDate: Date.now().toString(),
        createdByName: user.name,
        createdById: sub,
        ...listingBase,
      };

      const listing = new Listing(newListing);
      await listing.save();

      return { ...listing.toObject() }
    },
  }
};
