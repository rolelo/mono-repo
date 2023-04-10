import { UnauthorizedError } from "express-jwt";
import { v4 as uuidv4 } from "uuid";
import {
  ApplicantStatus,
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
import { sendEmail } from "../aws/email-queue";
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
      const listing = await Listing.findById(id);
      const newVisitorCount = listing.visitors + 1;
      listing.visitors = newVisitorCount;

      await listing.save();
      await client.updateByQuery({
        index: "listings",
        refresh: true,
        script: {
          source: "ctx._source.visitors = params.visitors",
          params: {
            visitors: newVisitorCount,
          },
        },
        query: {
          match: {
            listingId: id,
          },
        },
      });

      const alreadyApplied = Boolean(
        listing.applicants.find((a) => {
          return a.userId === sub;
        })
      );
      return {
        ...listing.toObject(),
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
          salary,
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
                  query: description || "*",
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
    async clientAppliedListings(_parent, _args, { sub }: Context) {},
    async jobApplicants(_, { jobId }: JobApplicationInput, { sub }: Context) {
      const job = await Listing.findById(jobId);
      if (job.createdById !== sub) {
        throw new UnauthorizedError("invalid_token", {
          message: "You do not have access to this JobId",
        });
      }
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
        visitors: 0,
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
      }: { input: UpdateApplicationStatusInput },
      { sub }: Context
    ) {
      const applicantId = userId || sub;
      const job = await (await Listing.findById(jobId)).toObject();
      const applicantApplication = job.applicants.find(
        (a) => a.userId === applicantId
      );
      if (applicantApplication.status === ApplicantStatus.REJECTED)
        throw Error("You cannot update the status of a rejected application");
      await Listing.updateOne(
        { _id: jobId, "applicants.userId": applicantId },
        {
          $set: {
            "applicants.$.status": status || ApplicantStatus.REJECTED,
          },
        }
      );
      const { name, email } = (await User.findById(applicantId)).toObject();
      await sendEmail({
        messageBody: JSON.stringify({
          name,
          email,
        }),
        messageDeduplicationId: jobId,
        messageGroupId: "RoleloJobApplicationStatusUpdate",
      });

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
