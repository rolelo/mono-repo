import { model, Model, Schema } from "mongoose";
export interface ListingBase {
  organisationId: string;
  jobPostingOperationType: JobOperationType;
  title: string;
  advertisingMediums: [AdvertisingMedium];
  description: string;
  location: string;
  categories: [LinkedInJobFunctionCodes];
  skillsDescription: string;
  workRemoteAllowed: boolean;
  workplaceType: WorkPlaceType;
  employmentStatus: EmploymentStatus;
  experienceLevel: ExperienceLevel;
  expireAt: string;
  listingType: ListingType;
  currency: ListingCurrency,
  salary: number,
  // industries:
}
export interface ListingInput extends ListingBase {}
export enum AdvertisingMedium {
  "LinkedIn" = "LinkedIn",
  "Indeed" = "Indeed",
  "Google" = "Google",
}
export enum LinkedInJobFunctionCodes {
  "acct" = "Accounting / Auditing",
  "adm" = "Administrative",
  "advr" = "Advertising",
  "anls" = "Analyst",
  "art" = "Art / Creative",
  "bd" = "Business Development",
  "cnsl" = "Consulting",
  "cust" = "Customer Service",
  "dist" = "Distribution",
  "dsgn" = "Design",
  "edu" = "Education",
  "eng" = "Engineering",
  "fin" = "Finance",
  "genb" = "General Business",
  "hcpr" = "HealthCare Provider",
  "hr" = "Human Resources",
  "it" = "Information Technology",
  "lgl" = "Legal",
  "mgmt" = "Management",
  "mnfc" = "Manufacturing",
  "mrkt" = "Marketing",
  "othr" = "Other",
  "pr" = "Public Relations",
  "prch" = "Purchasing",
  "prdm" = "Product Management",
  "prjm" = "Project Management",
  "prod" = "Production",
  "qa" = "QualityAssurance",
  "rsch" = "Research",
  "sale" = "Sales",
  "sci" = "Science",
  "stra" = "Strategy / Planning",
  "supl" = "Supply Chain",
  "trng" = "Training",
  "wrt" = "Writing / Editing",
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
};
export enum ListingCurrency {
  "USD" = "USD",
  "GBP" = "GBP",
  "EUR" = "EUR",
}
export interface IListing extends ListingBase {
  _id: string;
  organisationName: string;
  organisationDescription: string;
  organisationWebsite: string;
  createdDate: string;
  createdById: string;
  createdByName: string;
}
const listingSchema = new Schema<IListing>({
  _id: { type: String, required: true },
  organisationId: { type: String, required: true },
  organisationName: { type: String, required: true },
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
  currency: { type: String, enum: Object.keys(ListingCurrency), required: true },
  salary: { type: Number, required: true },
  location: { type: String, required: true },
  categories: {
    type: [String],
    enum: Object.keys(LinkedInJobFunctionCodes),
    required: true,
  },
  skillsDescription: { type: String, required: true },
  workRemoteAllowed: { type: Boolean, required: true },
  workplaceType: { type: String, enum: Object.keys(WorkPlaceType), required: true },
  employmentStatus: { type: String, enum: Object.keys(EmploymentStatus), required: true },
  experienceLevel: { type: String, enum: Object.keys(ExperienceLevel), required: true },
  expireAt: { type: String, required: true },
  listingType: { type: String, enum: Object.keys(ListingType), required: true },
  createdById: { type: String, required: true, index: true },
  createdByName: { type: String, required: true },
});
export const Listing: Model<IListing> = model(
  "Listing",
  listingSchema
);
