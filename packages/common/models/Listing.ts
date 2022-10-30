import { Organisation } from "./Organisation";

export interface Listing {
  organisationId?: string;
  jobPostingOperationType: "CREATE" | "UPDATE" | "REVIEW" | "CLOSE";
  title: string;
  advertisingMediums: [AdvertisingMedium]
  description: string;
  listedAt: string;
  location: string;
  categories: [LinkedInJobFunctionCodes];
  skillsDescription: string;
  workRemoteAllowed: boolean;
  workplaceType: WorkPlaceType;
  // industries:
  employmentStatus: EmploymentStatus;
  experienceLevel: ExperienceLevel;
  companyDescription: string;
  companyName: string;
  expireAt: string;
  listingType: ListingType;
}

export enum AdvertisingMedium {
  "LinkedIn" = "LinkedIn",
  "Indeed" = "Indeed",
  "Google" = "Google"
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

export type WorkPlaceType = "On-site" | "Hybrid" | "Remote";
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
export type ListingType = "BASIC" | "PREMIUM";