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
    user: User! @auth
    listings(organisationId: String): [Listing] @auth
    jobApplicants(jobId: String!): [Applicant] @auth
    jobApplications: [Applicant] @auth
    clientListing(id: String!): Listing
    clientListings(input: ClientListingsInput!): SearchListing
    clientAppliedListings: [Listing] @auth
  }
`;

const Mutation = `
  type Mutation {
    createProfile(input: ProfileInput!): Profile! @auth
    createListing(input: ListingInput!): Listing! @auth
    createJobApplication(input: JobApplicationInput!): Applicant! @auth
    createUser: User!
    updateUser: User!
    updateApplicantStatus(input: UpdateApplicationStatusInput!): Applicant! @auth
    createCVS3PreSignedUrl(content: String!): SignedUrl!
    createOrganisationS3PreSignedUrl(content: String!): SignedUrl!
    createOrganisation(input: CreateOrganisationInput!): Organisation! @auth
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
