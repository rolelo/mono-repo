export const typedef = `
enum AdvertisingMedium {
  LinkedIn
  Indeed
  Google
}
enum FoodAndDrink {
  DRINKS
  BREAKFAST
  FRUIT
  SNACKS
  LUNCH
  DINNER
}
enum JobOperationType {
  CREATE
  UPDATE
  REVIEW
  CLOSE
}
enum JobOperationType {
  CREATE
  UPDATE
  REVIEW
  CLOSE
}
enum EmploymentStatus {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
  TEMPORARY
  VOLUNTEER
  OTHER
}
enum ExperienceLevel {
  ENTRY_LEVEL
  MID_SENIOR_LEVEL
  DIRECTOR
  EXECUTIVE
  INTERNSHIP
  ASSOCIATE
  NOT_APPLICABLE
}
enum ListingType {
  BASIC
  PREMIUM
}
enum ListingCurrency {
  USD
  GBP
  EUR
}
enum ApplicantStatus {
  LISTED
  REJECTED
  PENDING
}
input ClientListingsInput {
  description: String!
  workplaceTypes: [String]
  employmentStatus: [EmploymentStatus]
  experienceLevels: [ExperienceLevel]
  salary: Int
}
interface IListing {
  jobPostingOperationType: JobOperationType!
  title: String!
  advertisingMediums: [AdvertisingMedium]
  description: String!
  location: String!
  skillsDescription: String!
  workRemoteAllowed: Boolean
  workplaceType: String!
  employmentStatus: EmploymentStatus!
  experienceLevel: ExperienceLevel!
  expireAt: String!
  listingType: ListingType!
  currency: ListingCurrency!
  techSkills: [String]
  salary: Int!
}
input ListingInput {
  organisationId: String
  jobPostingOperationType: JobOperationType!
  title: String!
  advertisingMediums: [AdvertisingMedium]
  description: String!
  location: String!
  skillsDescription: String!
  workRemoteAllowed: Boolean
  workplaceType: String!
  employmentStatus: EmploymentStatus!
  experienceLevel: ExperienceLevel!
  listingType: ListingType!
  expireAt: String!
  currency: ListingCurrency!
  salary: Int!
  rsus: Int!
  bonus: Int!
  techSkills: [String]
  numberOfHolidays: Int!
  privateHealthInsurance: Boolean
  dentalHealthInsurance: Boolean
  visionHealthInsurance: Boolean
  lifeInsurance: Boolean!
  workingHoursPerWeek: Int!
  freeFoodAndDrink: [FoodAndDrink]
  trainingAndDevelopment: Boolean!
  wellnessPackages: Boolean!
  workFromHomePackage: Boolean!
}
  type Listing @auth(requires: ADMIN) {
    _id: String
    organisationName: String
    organisationDescription: String
    organisationWebsite: String
    organisationLogo: String
    createdDate: String
    createdById: String
    createdByName: String
    jobPostingOperationType: JobOperationType!
    title: String!
    advertisingMediums: [AdvertisingMedium]
    description: String!
    location: String!
    skillsDescription: String!
    workRemoteAllowed: Boolean
    workplaceType: String!
    employmentStatus: EmploymentStatus!
    experienceLevel: ExperienceLevel!
    expireAt: String!
    listingType: ListingType!
    currency: ListingCurrency!
    salary: Int!
    rsus: Int!
    bonus: Int!
    techSkills: [String]
    numberOfHolidays: Int!
    privateHealthInsurance: Boolean
    dentalHealthInsurance: Boolean
    visionHealthInsurance: Boolean
    lifeInsurance: Boolean!
    workingHoursPerWeek: Int!
    freeFoodAndDrink: [FoodAndDrink]
    trainingAndDevelopment: Boolean!
    wellnessPackages: Boolean!
    workFromHomePackage: Boolean!
    applicants: [Applicant]
    alreadyApplied: Boolean
  }
  type ClientListing implements IListing {
    _id: String
    organisationName: String
    organisationDescription: String
    organisationWebsite: String
    organisationLogo: String
    createdDate: String
    createdById: String
    createdByName: String
    jobPostingOperationType: JobOperationType!
    title: String!
    advertisingMediums: [AdvertisingMedium]
    description: String!
    location: String!
    skillsDescription: String!
    workRemoteAllowed: Boolean
    workplaceType: String!
    employmentStatus: EmploymentStatus!
    experienceLevel: ExperienceLevel!
    expireAt: String!
    listingType: ListingType!
    currency: ListingCurrency!
    techSkills: [String]
    salary: Int!
  }
  type SearchListing {
    listings: [ClientListing]
    hits: Int!
  }
`;
