import { v4 as uuidv4 } from "uuid";
import {
  ClientListingsInput,
  Context,
  IApplicant,
  JobApplicationInput,
  Listing,
  ListingDocument,
  ListingForClient,
  ListingInput,
  ListingSchema,
  Organisation,
  SearchListing,
  UpdateApplicationStatusInput,
  User,
} from "../../../common/models";
import { client } from "../elastic";

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

      const result = await client.search({
        index: "listings",
        query: {
          match: query,
        },
      });

      return result.hits.hits.map((h) => ({
        ...(h._source as ListingDocument),
        _id: (h._source as ListingDocument)?.listingId,
      }));
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
    async clientListings(
      _,
      {
        input: {
          description,
          employmentStatus,
          experienceLevels,
          workplaceTypes,
          salary
        },
      }: { input: ClientListingsInput }
    ): Promise<SearchListing> {
      const result = await client.search({
        index: "listings",
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: description,
                },
              },
            ],
            filter: {
              bool: {
                must: [
                  ...(employmentStatus.length
                    ? [
                        {
                          terms: {
                            "employmentStatus.keyword": employmentStatus,
                          },
                        },
                      ]
                    : []),
                  ...(workplaceTypes.length
                    ? [
                        {
                          terms: {
                            "workplaceType.keyword": workplaceTypes,
                          },
                        },
                      ]
                    : []),
                  ...(experienceLevels.length
                    ? [
                        {
                          terms: {
                            "experienceLevel.keyword": experienceLevels,
                          },
                        },
                      ]
                    : []),
                  {
                    range: {
                      salary: {
                        gte: salary || 0,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      });

      return {
        listings: result.hits.hits.map((h) => ({
          ...(h._source as ListingDocument),
          _id: (h._source as ListingDocument)?.listingId,
        })),
        hits: +(result.hits.total["value"] || 0),
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

      const { _id, ...listingWithoutId } = newListing;
      await client.index<ListingDocument>({
        index: "listings",
        document: {
          ...listingWithoutId,
          listingId: _id,
        },
      });

      return { ...listing.toObject() };
    },
    async updateApplicantStatus(
      _,
      {
        input: { jobId, status, userId },
      }: { input: UpdateApplicationStatusInput }
    ) {
      await Listing.updateOne(
        { _id: jobId, "applicants.userId": userId },
        {
          $set: {
            "applicants.$.status": status,
          },
        }
      );

      return {
        status,
      };
    },
  },
  Applicant: {
    user: async ({ userId }: IApplicant, _, { sub }: Context) => {
      return User.findById(userId);
    },
  },
};
