import { makeExecutableSchema } from "@graphql-tools/schema";

import * as resolvers from "./resolvers";
import { typedef as applicantTd } from "./typedefs/applicant";
import { typedef as listingTd } from "./typedefs/listing";
import { typedef as organisationTd } from "./typedefs/organisation";
import { typedef as signedUrlTd } from "./typedefs/signedUrl";
import { typedef as userTd } from "./typedefs/user";
import authDirective from './directives/authDirective';

const { authDirectiveTransformer, authDirectiveTypeDefs } = authDirective;

const Query = `
  type Query {
    user: User! @auth(requires: USER)
    listings(organisationId: String): [Listing]
    jobApplicants(jobId: String!): [Applicant]
    clientListing(id: String!): Listing
    clientListings(input: ClientListingsInput!): SearchListing
  }
`;

const Mutation = `
  type Mutation {
    createProfile(input: ProfileInput!): Profile!
    createListing(input: ListingInput!): Listing!
    createJobApplication(input: JobApplicationInput!): Applicant!
    createUser: User!
    updateUser: User!
    updateApplicantStatus(input: UpdateApplicationStatusInput!): Applicant!
    createCVS3PreSignedUrl(content: String!): SignedUrl!
    createOrganisationS3PreSignedUrl(content: String!): SignedUrl!
    createOrganisation(input: CreateOrganisationInput!): Organisation!
    deleteOrganisation(_id: String!): String!
  }
`;

let schema = makeExecutableSchema({
  typeDefs: [
    authDirectiveTypeDefs,
    applicantTd,
    listingTd,
    organisationTd,
    signedUrlTd,
    userTd,
    Query,
    Mutation,
  ],
  resolvers: [
    resolvers.userResolvers.resolvers,
    resolvers.oganisationResolvers.resolvers,
    resolvers.listingResolvers.resolvers,
    resolvers.jobApplicationResolvers.resolvers,
  ],
});

schema = authDirectiveTransformer(schema);

export default schema;
