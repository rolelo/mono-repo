export interface Listing {
  jobPostingOperationType: "CREATE" | "UPDATE" | "REVIEW" | "CLOSE"
  title: string;
  description: string;
  listedAt: string;
  location: string;
  categories: [LinkedInJobFunctionCodes],
  skillsDescription: string;
  workRemoteAllowed: boolean;
  workplaceTypes: WorkPlaceType[];
  // industries:
  employmentStatus: EmploymentStatus;
  experienceLeve: ExperienceLevel;
  companyDescription: string;
  companyName: string;
  expireAt: string;
  listingType: ListingType;
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
export type EmploymentStatus =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "TEMPORARY"
  | "VOLUNTEER"
  | "OTHER";
export type ExperienceLevel = "ENTRY_LEVEL" | "MID_SENIOR_LEVEL" | "DIRECTOR" | "EXECUTIVE" | "INTERNSHIP" | "ASSOCIATE" | "NOT_APPLICABLE"
export type ListingType = "BASIC" | "PREMIUM";