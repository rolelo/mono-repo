export const typedef = `
input CreateOrganisationInput {
  name: String!
  website: String!
  companyLogo: String!
  companyDescription: String!
  email: String!
}
  type Organisation {
    _id: String!
    admin: User!
    name: String!
    website: String!
    companyLogo: String!
    companyDescription: String!
    email: String!
    totalPositions: Int!
    createdDate: String!
    profile: Profile
  }
`;