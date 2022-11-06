import { v4 as uuidv4 } from "uuid";
import {
  Context, IListing,
  Listing,
  ListingForClient,
  ListingInput,
  Organisation,
  User
} from "../../../common/models";

export const resolvers = {
  Query: {
    async listings(
      _,
      { organisationId }: { organisationId: string },
      { sub }: Context
    ) {
      const query = {
        ...(organisationId ? { organisationId } : { createdById: sub }),
      };
      const listings = await Listing.find(query).exec();
      return listings.map((l) => l.toObject());
    },
    async clientListing(
      _,
      { id },
      { sub }: Context
    ): Promise<ListingForClient> {
      const listing = (await Listing.findById(id)).toObject();
      const alreadyApplied = Boolean(listing.applications.find(a => {
        return a._id === sub
      }));
      return {
        ...listing,
        alreadyApplied,
      }
    },
  },
  Mutation: {
    async createListing(
      _,
      { input }: { input: ListingInput },
      { sub }: Context
    ) {
      const { organisationId, ...listingBase } = input;
      const user = (await User.findById(sub)).toObject();
      const organisation = (
        await Organisation.findById(organisationId)
      ).toObject();

      const newListing: IListing = {
        _id: uuidv4(),
        organisationId: organisation._id,
        organisationName: organisation.name,
        organisationLogo: organisation.companyLogo,
        organisationDescription: organisation.companyDescription,
        organisationWebsite: organisation.website,
        createdDate: Date.now().toString(),
        createdByName: user.name,
        createdById: sub,
        applications: [],
        ...listingBase,
      };

      const listing = new Listing(newListing);
      await listing.save();

      return { ...listing.toObject() };
    },
  },
};
