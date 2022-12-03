export const typedef = `
input ProfileInput {
  rightToWorkInUK: String!
  rightToWorkInEU: String!
  rightToWorkInUS: String!
  cv: String!
  countryOfResidence: String!
  salaryLookingFor: Int
  techSkills: [String]
  yearsOfExperience: Int
}
  type Profile {
    rightToWorkInUK: String!
    rightToWorkInEU: String!
    rightToWorkInUS: String!
    cv: String
    countryOfResidence: String!
    salaryLookingFor: Int
    techSkills: [String]
    yearsOfExperience: Int
  }
  type User {
    id: String!
    name: String!
    email: String!
    phoneNumber: String
    organisations: [Organisation]
    profile: Profile
  }
`;