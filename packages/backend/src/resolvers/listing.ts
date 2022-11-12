import { v4 as uuidv4 } from "uuid";
import {
  Context, IApplicant, JobApplicationInput, Listing,
  ListingForClient,
  ListingInput, ListingSchema, Organisation,
  UpdateApplicationStatusInput,
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
      const alreadyApplied = Boolean(
        listing.applicants.find((a) => {
          return a.userId === sub;
        })
      );
      return {
        ...listing,
        applicants: [],
        alreadyApplied,
      };
    },
    async jobApplicants(_, { jobId }: JobApplicationInput, { sub }: Context) {
      const job = await Listing.findById(jobId);
      return job.applicants;
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

      const newListing: ListingSchema = {
        _id: uuidv4(),
        organisationId: organisation._id,
        organisationName: organisation.name,
        organisationLogo: organisation.companyLogo,
        organisationDescription: organisation.companyDescription,
        organisationWebsite: organisation.website,
        createdDate: Date.now().toString(),
        createdByName: user.name,
        createdById: sub,
        applicants: [],
        ...listingBase,
      };

      const listing = new Listing(newListing);
      await listing.save();

      return { ...listing.toObject() };
    },
    async updateApplicantStatus(_, { input: { jobId, status, userId } }: { input: UpdateApplicationStatusInput }) {
      await Listing.updateOne(
        { _id: jobId, 'applicants.userId': userId },
        {
          '$set': {
            'applicants.$.status': status,
          }
        }
      );

      return {
        status,
      }
    }
  },
  Applicant: {
    user: async ({ userId }: IApplicant, _, { sub }: Context) => {
      return User.findById(userId);
    },
  },
};
