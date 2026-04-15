export type CountryCode = "au" | "uk" | "ca" | "jp";

export interface VisaPathway {
  id: string;
  name: string;
  subclass?: string;
  category: string;
  processingTime: string;
  validity: string;
  cost: string;
  eligibility: EligibilityRequirement[];
  keyBenefits: string[];
  restrictions: string[];
  pathwayTo?: string[];
  difficulty: "straightforward" | "moderate" | "complex";
  popularity: "high" | "medium" | "low";
}

export interface EligibilityRequirement {
  id: string;
  label: string;
  description: string;
  type: "age" | "financial" | "occupation" | "english" | "health" | "character" | "sponsor" | "other";
  required: boolean;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: "document" | "financial" | "health" | "form" | "other";
  dueWeeks: number;
  priority: "critical" | "high" | "medium" | "low";
  completed?: boolean;
}

export interface RiskFactor {
  id: string;
  label: string;
  weight: number;
  description: string;
  mitigation: string;
}

export interface CountryData {
  code: CountryCode;
  name: string;
  currency: string;
  visaBodyName: string;
  visaBodyUrl: string;
  pathways: VisaPathway[];
  refusalReasons: RefusalReason[];
  checklist: ChecklistItem[];
  riskFactors: RiskFactor[];
  processingCenters: string[];
}

export interface RefusalReason {
  id: string;
  code?: string;
  title: string;
  description: string;
  frequency: "very-common" | "common" | "occasional";
  solutions: string[];
  pathwaysAffected: string[];
}

export interface UserProfile {
  nationality: string;
  currentLocation: "inside" | "outside";
  currentVisa?: string;
  visaExpiry?: string;
  age?: number;
  occupation?: string;
  englishLevel?: "native" | "ielts-7plus" | "ielts-6" | "ielts-below6" | "none";
  hasSpouse?: boolean;
  hasDependents?: boolean;
  previousRefusal?: boolean;
  financialProof?: "strong" | "moderate" | "weak";
  healthIssues?: boolean;
}

export interface PathwayResult {
  pathway: VisaPathway;
  eligibilityScore: number;
  eligible: boolean;
  blockers: string[];
  conditionals: string[];
  recommendation: "recommended" | "possible" | "unlikely" | "ineligible";
}

export interface RiskAuditResult {
  overallScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  factors: {
    factor: RiskFactor;
    userScore: number;
    impact: "positive" | "neutral" | "negative" | "critical";
  }[];
  recommendations: string[];
  nextSteps: string[];
}
