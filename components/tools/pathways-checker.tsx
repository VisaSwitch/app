"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowRight,
  BarChart3,
  ListChecks,
  Info,
  Star,
  ThumbsUp,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, UserProfile, PathwayResult, VisaPathway } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

type Step = "intro" | "location" | "profile" | "occupation" | "results";

const steps: Step[] = ["intro", "location", "profile", "occupation", "results"];

function computeResults(profile: UserProfile, data: CountryData): PathwayResult[] {
  return data.pathways.map((pathway) => {
    const blockers: string[] = [];
    const conditionals: string[] = [];
    let score = 100;

    // Age check
    const ageReq = pathway.eligibility.find((e) => e.type === "age");
    if (ageReq && profile.age) {
      if (pathway.id === "subclass-417" && profile.age > 30) {
        blockers.push("Age limit exceeded — must be under 30 (or 35 for some nationalities)");
        score -= 40;
      }
      if (["subclass-189", "subclass-190", "subclass-491", "subclass-482"].includes(pathway.id) && profile.age > 45) {
        blockers.push("Age limit exceeded — must be under 45 at time of invitation");
        score -= 40;
      }
    }

    // English check
    const engReq = pathway.eligibility.find((e) => e.type === "english" && e.required);
    if (engReq) {
      if (profile.englishLevel === "none" || profile.englishLevel === "ielts-below6") {
        const isLenient = ["subclass-417", "subclass-600", "visitor-jp", "visitor-visa"].includes(pathway.id);
        if (!isLenient) {
          blockers.push("English language requirements not met — retesting may be needed");
          score -= 30;
        }
      } else if (profile.englishLevel === "ielts-6") {
        if (["subclass-189", "subclass-190", "subclass-491"].includes(pathway.id)) {
          conditionals.push("English meets minimum but higher scores improve your points total");
          score -= 5;
        }
      }
    }

    // Financial check
    const finReq = pathway.eligibility.find((e) => e.type === "financial" && e.required);
    if (finReq) {
      if (profile.financialProof === "weak") {
        blockers.push("Financial evidence appears insufficient — strengthen bank statements before applying");
        score -= 25;
      } else if (profile.financialProof === "moderate") {
        conditionals.push("Financial evidence may need strengthening — review requirements carefully");
        score -= 10;
      }
    }

    // Previous refusal
    if (profile.previousRefusal) {
      conditionals.push("Prior refusal detected — must address all previous refusal reasons in new application");
      score -= 15;
    }

    // Location check — some visas require being in Australia
    if (pathway.id === "subclass-485" && profile.currentLocation === "outside") {
      conditionals.push("485 visa can be applied for offshore — ensure all study requirements are met");
    }

    // Health
    if (profile.healthIssues) {
      const hasHealthReq = pathway.eligibility.some((e) => e.type === "health");
      if (hasHealthReq) {
        conditionals.push("Health condition may require additional medical assessment or waiver application");
        score -= 10;
      }
    }

    // Visitor visas — working holiday check
    if (pathway.id === "subclass-417" && profile.currentLocation === "inside") {
      conditionals.push("Working Holiday visa can be applied for offshore — check if you can still apply from within Australia");
    }

    const eligible = blockers.length === 0;
    const recommendation = eligible
      ? score >= 80
        ? "recommended"
        : score >= 60
        ? "possible"
        : "unlikely"
      : "ineligible";

    return { pathway, eligibilityScore: Math.max(0, score), eligible, blockers, conditionals, recommendation };
  });
}

const recommendationConfig = {
  recommended: {
    label: "Recommended",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    icon: ThumbsUp,
    bar: "bg-emerald-500",
  },
  possible: {
    label: "Possible",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    icon: Minus,
    bar: "bg-amber-400",
  },
  unlikely: {
    label: "Unlikely",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    icon: AlertCircle,
    bar: "bg-orange-400",
  },
  ineligible: {
    label: "Ineligible",
    color: "text-red-700 bg-red-50 border-red-200",
    icon: XCircle,
    bar: "bg-red-400",
  },
};

export function PathwaysChecker({ countryData, countryCode }: Props) {
  const [step, setStep] = useState<Step>("intro");
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [results, setResults] = useState<PathwayResult[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const stepIndex = steps.indexOf(step);
  const totalSteps = 4; // excluding intro and results

  const progress = step === "intro" ? 0 : step === "results" ? 100 : (stepIndex / totalSteps) * 100;

  function handleNext() {
    const nextStep = steps[stepIndex + 1];
    if (nextStep === "results") {
      const r = computeResults(profile as UserProfile, countryData);
      r.sort((a, b) => {
        const order = { recommended: 0, possible: 1, unlikely: 2, ineligible: 3 };
        return order[a.recommendation] - order[b.recommendation];
      });
      setResults(r);
    }
    setStep(nextStep);
  }

  function handleBack() {
    setStep(steps[stepIndex - 1]);
  }

  function reset() {
    setStep("intro");
    setProfile({});
    setResults([]);
    setExpanded(null);
  }

  const eligibleCount = results.filter((r) => r.eligible).length;
  const recommendedCount = results.filter((r) => r.recommendation === "recommended").length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${countryCode}`} className="hover:text-white transition-colors">{countryData.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Pathway Checker</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Visa Pathway Checker</h1>
              <p className="text-slate-400 text-sm">{countryData.name} — Full eligibility breakdown</p>
            </div>
          </div>
          {step !== "intro" && step !== "results" && (
            <div className="max-w-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Step {stepIndex} of {totalSteps}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* INTRO */}
        {step === "intro" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Find your visa pathways</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Answer 3 quick sections and we will show you every {countryData.name} visa you may be eligible for — with a full eligibility breakdown, key requirements, and what to do next.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { label: "Takes about 3 minutes", icon: Clock },
                { label: "No account required", icon: CheckCircle },
                { label: `Covers all ${countryData.pathways.length} ${countryData.name} visa pathways`, icon: Globe },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm"
            >
              Start pathway check
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* LOCATION */}
        {step === "location" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Your current situation</h2>
            <p className="text-slate-500 text-sm mb-6">This helps us filter pathways relevant to your location and current status.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">Are you currently in {countryData.name}?</label>
                <div className="grid grid-cols-2 gap-3">
                  {["inside", "outside"].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setProfile((p) => ({ ...p, currentLocation: loc as "inside" | "outside" }))}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                        profile.currentLocation === loc
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {loc === "inside" ? `Yes, I am in ${countryData.name}` : `No, I am outside ${countryData.name}`}
                    </button>
                  ))}
                </div>
              </div>

              {profile.currentLocation === "inside" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Current visa type (if any)</label>
                  <input
                    type="text"
                    placeholder="e.g. Student visa, Working Holiday..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={profile.currentVisa ?? ""}
                    onChange={(e) => setProfile((p) => ({ ...p, currentVisa: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Nationality / passport country</label>
                <input
                  type="text"
                  placeholder="e.g. Vietnamese, Brazilian, Indian..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={profile.nationality ?? ""}
                  onChange={(e) => setProfile((p) => ({ ...p, nationality: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Previous visa refusal for {countryData.name}?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: false, label: "No previous refusal" },
                    { value: true, label: "Yes, had a refusal" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setProfile((p) => ({ ...p, previousRefusal: opt.value }))}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                        profile.previousRefusal === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleBack} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!profile.currentLocation}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {step === "profile" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Your personal profile</h2>
            <p className="text-slate-500 text-sm mb-6">Used to assess age-based eligibility and English requirements.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Your age</label>
                <input
                  type="number"
                  min={18}
                  max={75}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={profile.age ?? ""}
                  onChange={(e) => setProfile((p) => ({ ...p, age: parseInt(e.target.value) || undefined }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">English language level</label>
                <div className="space-y-2">
                  {[
                    { value: "native", label: "Native / fluent English speaker" },
                    { value: "ielts-7plus", label: "IELTS 7.0+ (or equivalent)" },
                    { value: "ielts-6", label: "IELTS 6.0–6.5 (or equivalent)" },
                    { value: "ielts-below6", label: "IELTS below 6.0 (or equivalent)" },
                    { value: "none", label: "No formal English test" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setProfile((p) => ({ ...p, englishLevel: opt.value as UserProfile["englishLevel"] }))}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all",
                        profile.englishLevel === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">Financial situation</label>
                <div className="space-y-2">
                  {[
                    { value: "strong", label: "Strong — 6+ months of clear bank statements, consistent income" },
                    { value: "moderate", label: "Moderate — some savings, may have gaps or inconsistencies" },
                    { value: "weak", label: "Limited — minimal savings, irregular income" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setProfile((p) => ({ ...p, financialProof: opt.value as UserProfile["financialProof"] }))}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all",
                        profile.financialProof === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">Any known health conditions?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: false, label: "No known conditions" },
                    { value: true, label: "Yes, I have a health condition" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setProfile((p) => ({ ...p, healthIssues: opt.value }))}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                        profile.healthIssues === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleBack} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!profile.age || !profile.englishLevel || !profile.financialProof}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* OCCUPATION */}
        {step === "occupation" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Your work background</h2>
            <p className="text-slate-500 text-sm mb-6">Helps assess skilled migration and employer-sponsored pathways.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Occupation or field of work</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Nurse, Accountant, Chef..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={profile.occupation ?? ""}
                  onChange={(e) => setProfile((p) => ({ ...p, occupation: e.target.value }))}
                />
                <p className="text-xs text-slate-400 mt-1.5">Enter your primary occupation — this guides pathway recommendations</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">Do you have dependants (spouse or children) coming with you?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: false, label: "Just me" },
                    { value: true, label: "With dependants" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => setProfile((p) => ({ ...p, hasDependents: opt.value }))}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                        profile.hasDependents === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleBack} className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                See my results <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <div className="space-y-6">
            {/* Summary card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 text-white">
              <h2 className="text-xl font-bold mb-1">Your Pathway Results</h2>
              <p className="text-slate-400 text-sm mb-5">{countryData.name} — based on your profile</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1">{eligibleCount}</div>
                  <div className="text-xs text-slate-400">Eligible pathways</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1 text-emerald-400">{recommendedCount}</div>
                  <div className="text-xs text-slate-400">Recommended</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1">{results.length}</div>
                  <div className="text-xs text-slate-400">Total assessed</div>
                </div>
              </div>
            </div>

            {/* Next steps bar */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Next step:</span> Build your personalised checklist and timeline for your chosen pathway.
                </p>
              </div>
              <Link
                href={`/${countryCode}/planner`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
              >
                <ListChecks className="w-3.5 h-3.5" /> Build plan
              </Link>
            </div>

            {/* Results list */}
            <div className="space-y-4">
              {results.map((result) => {
                const config = recommendationConfig[result.recommendation];
                const RIcon = config.icon;
                const isExpanded = expanded === result.pathway.id;
                return (
                  <div
                    key={result.pathway.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpanded(isExpanded ? null : result.pathway.id)}
                      className="w-full px-6 py-5 flex items-start gap-4 text-left hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {result.pathway.subclass && (
                            <span className="text-xs font-bold text-slate-400">SC {result.pathway.subclass}</span>
                          )}
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border",
                              config.color
                            )}
                          >
                            <RIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {result.pathway.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">{result.pathway.name}</h3>

                        {/* Score bar */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", config.bar)}
                              style={{ width: `${result.eligibilityScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-500">
                            {result.eligibilityScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 mt-1">
                        <div className="hidden sm:flex flex-col items-end gap-0.5">
                          <span className="text-xs text-slate-500">{result.pathway.processingTime}</span>
                          <span className="text-xs font-medium text-slate-700">{result.pathway.cost}</span>
                        </div>
                        <ChevronRight
                          className={cn("w-4 h-4 text-slate-400 transition-transform", isExpanded && "rotate-90")}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-5">
                        {/* Blockers */}
                        {result.blockers.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5" /> Blockers
                            </h4>
                            <ul className="space-y-1.5">
                              {result.blockers.map((b, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                  <span className="text-xs text-red-700">{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Conditionals */}
                        {result.conditionals.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" /> Conditions to review
                            </h4>
                            <ul className="space-y-1.5">
                              {result.conditionals.map((c, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                  <span className="text-xs text-amber-800">{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Key benefits */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5" /> Key benefits
                          </h4>
                          <ul className="space-y-1.5">
                            {result.pathway.keyBenefits.map((b, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-slate-700">{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Processing info */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { icon: Clock, label: "Processing", value: result.pathway.processingTime },
                            { icon: DollarSign, label: "Cost", value: result.pathway.cost },
                            { icon: Globe, label: "Validity", value: result.pathway.validity },
                          ].map((item) => {
                            const Icon = item.icon;
                            return (
                              <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                                <Icon className="w-3.5 h-3.5 text-slate-400 mb-1" />
                                <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                                <div className="text-xs font-semibold text-slate-800">{item.value}</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Pathway leads to */}
                        {result.pathway.pathwayTo && result.pathway.pathwayTo.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-500">Pathway to:</span>
                            {result.pathway.pathwayTo.map((p) => (
                              <span key={p} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}

                        {result.eligible && (
                          <div className="flex gap-3 pt-2">
                            <Link
                              href={`/${countryCode}/planner`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                            >
                              <ListChecks className="w-3.5 h-3.5" /> Plan application
                            </Link>
                            <Link
                              href={`/${countryCode}/audit`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-4 py-2.5 rounded-lg hover:bg-slate-200 transition-all"
                            >
                              <BarChart3 className="w-3.5 h-3.5" /> Risk audit
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Start again */}
            <div className="text-center pt-4">
              <button
                onClick={reset}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline"
              >
                Start a new check with different profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
