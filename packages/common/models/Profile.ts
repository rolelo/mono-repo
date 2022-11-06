export type Profile = {
  rightToWorkInUK: string;
  rightToWorkInEU: string;
  rightToWorkInUS: string;
  cv: string;
  countryOfResidence: string;
  salaryLookingFor: number;
  techSkills: string[];
  yearsOfExperience: number;
}

export enum TechSkills {
  "JavaScript" = "JavaScript",
  "Python" = "Python",
  "HTML/CSS" = "HTML/CSS",
  "SQL" = "SQL",
  "Java" = "Java",
  "Node.Js" = "Node.Js",
  "TypeScript" = "TypeScript",
  "C#" = "C#",
  "Bash/Shell" = "Bash/Shell",
  "C++" = "C++",
  "PHP" = "PHP",
  "C" = "C",
  "F#" = "F#",
  "PowerShell" = "PowerShell",
  "WebAssembly" = "WebAssembly",
  "BootStrap" = "BootStrap",
  "JSFoundation" = "JSFoundation",
  "Susy" = "Susy",
  "PURE.CSS" = "PURE.CSS",
  "LESS" = "LESS",
  "Materialize" = "Materialize",
  "UIKit" = "UIKit",
  "Bulma" = "Bulma",
  "Angular" = "Angular",
  "Vue" = "Vue",
  "React" = "React",
  "NEXT" = "NEXT",
  "EMBER" = "EMBER",
  "Kotlin" = "Kotlin",
  "Rust" = "Rust",
  "Swift" = "Swift",
  "Dart" = "Dart",
  "Ruby" = "Ruby",
  "Closure" = "Closure",
  "Elixir" = "Elixir",
  "Go-Lang" = "Go Lang",
  "R" = "R",
  "Objective-C" = "Objective-C",
  "AWS" = "AWS",
  "Azure" = "Azure",
  "GCP" = "GCP",
  "Cassandra" = "Cassandra",
  "DynamoDB" = "DynamoDB",
  "MongoDB" = "MongoDB"
}

export type ProfileInput = Omit<Profile, 'cv'> & { cv: string };