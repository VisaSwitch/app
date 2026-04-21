export type CountryCode = "au" | "uk" | "ca" | "jp";

// Visa selector values per country — used by the PathwaysChecker filter panel
export type AuCurrentVisa = "whv" | "student" | "graduate" | "skilled" | "visitor" | "other";
export type UkCurrentVisa = "student" | "graduate" | "skilled" | "visitor" | "other";
export type CaCurrentVisa = "study" | "pgwp" | "skilled" | "visitor" | "other";
export type JpCurrentVisa = "student" | "work" | "whv" | "visitor" | "other";
export type AnyCurrentVisa = AuCurrentVisa | UkCurrentVisa | CaCurrentVisa | JpCurrentVisa;

export type VisaGoal = "stay" | "pr" | "sponsored" | "study" | "family" | "business" | "all";

export interface VisaPathway {
  id: string;
  name: string;
  subclass?: string;
  category: string;
  categoryLabel: string;
  // Card visual identity
  iconBg: string;
  iconColor: string;
  accentColor: string;
  // Summary info
  tagline: string;
  processingTime: string;
  validity: string;
  cost: string;
  costNumeric?: number; // VAC in AUD, numeric for aggregation
  difficulty: "straightforward" | "moderate" | "complex";
  popularity: "high" | "medium" | "low";
  // Content
  summary: string;
  eligibility: EligibilityRequirement[];
  pros: string[];
  cons: string[];
  nextSteps: string[];
  applicationSteps?: Array<{
    action: string;       // short imperative, e.g. "Create ImmiAccount"
    detail: string;       // 1-2 sentences of how/what
    link?: string;        // URL if applicable
    duration?: string;    // e.g. "5 min", "3–6 weeks"
  }>;
  urgentNote?: string;
  // Connections
  pathwayTo: string[];
  relatedOccupations?: string[];
  // Filter metadata
  fromVisas: string[];
  forGoals: VisaGoal[];
}

export interface EligibilityRequirement {
  id: string;
  label: string;
  description: string;
  type: "age" | "financial" | "occupation" | "english" | "health" | "character" | "sponsor" | "other";
  required: boolean;
}

export interface PathwayRelevanceMatrix {
  [currentVisa: string]: {
    [goal: string]: string[]; // pathway IDs in priority order
  };
}

export interface VisaCurrentOption {
  value: string;
  label: string;
  sublabel: string;
  iconName: string; // Lucide icon name as string
}

export interface VisaGoalOption {
  value: VisaGoal;
  label: string;
  sublabel: string;
  iconName: string;
}

export interface MigrationService {
  id: string;
  name: string;
  type: "migration-agent" | "education" | "skills-assessment" | "english" | "recruitment";
  typeLabel: string;
  tagline: string;
  description: string;
  specialties: string[];
  languages?: string[];
  priceFrom?: string;
  contact?: string;
  website?: string;
  badge?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: "document" | "financial" | "health" | "form" | "other";
  dueWeeks: number;  // negative = before lodgement date; 0 = at lodgement
  priority: "critical" | "high" | "medium" | "low";
  completed?: boolean;
  pathwayIds?: string[];  // if omitted/empty, item applies to ALL pathways
  estimatedCost?: string;  // human-readable, e.g. "AUD 370"
  estimatedCostNumeric?: number; // for aggregation
  link?: string;  // official URL to complete or learn more about this task
  linkLabel?: string; // optional short label, defaults to "Open →"
}

export interface RiskFactor {
  id: string;
  label: string;
  weight: number;
  description: string;
  mitigation: string;
  pathwayIds?: string[];  // if omitted/empty, factor applies to ALL pathways
}

export interface CountryData {
  code: CountryCode;
  name: string;
  currency: string;
  visaBodyName: string;
  visaBodyUrl: string;
  pathways: VisaPathway[];
  pathwayRelevance: PathwayRelevanceMatrix;
  currentVisaOptions: VisaCurrentOption[];
  goalOptions: VisaGoalOption[];
  refusalReasons: RefusalReason[];
  checklist: ChecklistItem[];
  riskFactors: RiskFactor[];
  services: MigrationService[];
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
