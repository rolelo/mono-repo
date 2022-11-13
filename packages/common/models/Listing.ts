import { model, Model, Schema } from "mongoose"
import { ApplicantStatus, IApplicant, IUser, TechSkills, User } from "."
export interface ListingBase {
  organisationId: string;
  jobPostingOperationType: JobOperationType;
  title: string;
  advertisingMediums: AdvertisingMedium[];
  description: string;
  location: string;
  skillsDescription: string;
  workRemoteAllowed: boolean;
  workplaceType: WorkPlaceType;
  employmentStatus: EmploymentStatus;
  experienceLevel: ExperienceLevel;
  expireAt: string;
  listingType: ListingType;
  currency: ListingCurrency;
  salary: number;
  rsus: number;
  bonus: number;
  techSkills: TechSkills[];
  numberOfHolidays: number;
  privateHealthInsurance: boolean;
  dentalHealthInsurance: boolean;
  visionHealthInsurance: boolean;
  lifeInsurance: boolean;
  workingHoursPerWeek: number;
  freeFoodAndDrink: FoodAndDrink[];
  trainingAndDevelopment: boolean;
  wellnessPackages: boolean;
  workFromHomePackage: boolean;
}
export interface ListingInput extends ListingBase {}
export enum FoodAndDrink {
  "DRINKS" = "Drinks",
  "BREAKFAST" = "Breakfast",
  "FRUIT" = "Fruit",
  "SNACKS" = "Snacks",
  "LUNCH" = "Lunch",
  'DINNER' = 'Dinner',
}
export enum AdvertisingMedium {
  "LinkedIn" = "LinkedIn",
  "Indeed" = "Indeed",
  "Google" = "Google",
}
export enum JobOperationType {
  "CREATE" = "CREATE",
  "UPDATE" = "UPDATE",
  "REVIEW" = "REVIEW",
  "CLOSE" = "CLOSE",
}
export enum WorkPlaceType {
  "On-site" = "On-site",
  "Hybrid" = "Hybrid",
  "Remote" = "Remote",
} 
export enum EmploymentStatus {
  "FULL_TIME" = "FULL TIME",
  "PART_TIME" = "PART TIME",
  "CONTRACT" = "CONTRACT",
  "INTERNSHIP" = "INTERNSHIP",
  "TEMPORARY" = "TEMPORARY",
  "VOLUNTEER" = "VOLUNTEER",
  "OTHER" = "OTHER",
}
export enum ExperienceLevel {
  "ENTRY_LEVEL" = "ENTRY LEVEL",
  "MID_SENIOR_LEVEL" = "MID SENIOR LEVEL",
  "DIRECTOR" = "DIRECTOR",
  "EXECUTIVE" = "EXECUTIVE",
  "INTERNSHIP" = "INTERNSHIP",
  "ASSOCIATE" = "ASSOCIATE",
  "NOT_APPLICABLE" = "NOT APPLICABLE",
}
export enum ListingType  {
  "BASIC" = "BASIC",
  "PREMIUM" = "PREMIUM"
}
export enum ListingCurrency {
  "USD" = "USD",
  "GBP" = "GBP",
  "EUR" = "EUR",
}
export interface ListingSchema extends ListingBase {
  _id: string
  organisationName: string
  organisationDescription: string
  organisationLogo: string
  organisationWebsite: string
  createdDate: string
  createdById: string
  createdByName: string
  applicants: IApplicant[]
}

export type ListingApplicant = {
  user: User
  createdDate: string
  status: ApplicantStatus
  id: string
}
export interface Listing extends ListingBase {
  _id: string
  organisationName: string
  organisationDescription: string
  organisationLogo: string
  organisationWebsite: string
  createdDate: string
  createdById: string
  createdByName: string
  applicants: ListingApplicant[]
}
export interface ListingForClient extends Listing {
  alreadyApplied: boolean
}
const listingSchema = new Schema<ListingSchema>({
  _id: { type: String, required: true },
  organisationId: { type: String, required: true },
  organisationName: { type: String, required: true },
  organisationLogo: { type: String, required: true },
  organisationDescription: { type: String, required: true },
  organisationWebsite: { type: String, required: true },
  createdDate: { type: String, required: true },
  jobPostingOperationType: {
    type: String,
    enum: Object.keys(JobOperationType),
    required: true,
  },
  title: { type: String, required: true },
  advertisingMediums: {
    type: [String],
    enum: Object.keys(AdvertisingMedium),
    required: true,
  },
  description: { type: String, required: true },
  currency: {
    type: String,
    enum: Object.keys(ListingCurrency),
    required: true,
  },
  salary: { type: Number, required: true },
  location: { type: String, required: true },
  skillsDescription: { type: String, required: true },
  workRemoteAllowed: { type: Boolean, required: true },
  workplaceType: {
    type: String,
    enum: Object.keys(WorkPlaceType),
    required: true,
  },
  employmentStatus: {
    type: String,
    enum: Object.keys(EmploymentStatus),
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: Object.keys(ExperienceLevel),
    required: true,
  },
  expireAt: { type: String, required: true },
  listingType: { type: String, enum: Object.keys(ListingType), required: true },
  applicants: { type: [Object], required: true, default: [] },
  createdById: { type: String, required: true, index: true },
  createdByName: { type: String, required: true },
})
export const Listing: Model<ListingSchema> = model(
  "Listing",
  listingSchema
)
