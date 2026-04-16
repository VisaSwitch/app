"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart3, ChevronRight, AlertTriangle, CheckCircle, XCircle,
  Shield, RefreshCw, TrendingUp, TrendingDown, Minus, Info,
  ListChecks, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, RiskFactor, VisaPathway } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

type RiskLevel = "low" | "moderate" | "high" | "critical";

interface FactorResult {
  factor: RiskFactor;
  answer: "yes" | "no" | "partial" | null;
  impact: "positive" | "neutral" | "negative" | "critical";
  score: number;
}

const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bg: string; border: string; description: string }> = {
  low: {
    label: "Low Risk",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    description: "Your application profile looks strong. Proceed with final preparation and lodge when ready.",
  },
  moderate: {
    label: "Moderate Risk",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description: "Some risk factors identified. Address the recommendations below before lodging.",
  },
  high: {
    label: "High Risk",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    description: "Significant risk factors detected. We strongly recommend addressing these before submitting.",
  },
  critical: {
    label: "Critical Risk",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    description: "One or more critical issues detected. Lodging now carries a high probability of refusal. Seek expert advice.",
  },
};

function computeRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "low";
  if (score >= 50) return "moderate";
  if (score >= 30) return "high";
  return "critical";
}

export function RiskAudit({ countryData, countryCode }: Props) {
  const searchParams = useSearchParams();
  const pathwayParam = searchParams.get("pathway") ?? "";

  const [selectedPathway, setSelectedPathway] = useState<string>(pathwayParam);
  const [factorResults, setFactorResults] = useState<Map<string, "yes" | "no" | "partial">>(new Map());
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  const selectedPathwayData: VisaPathway | null = useMemo(
    () => countryData.pathways.find((p) => p.id === selectedPathway) ?? null,
    [selectedPathway, countryData]
  );

  // Filtered risk factors by pathway
  const filteredRiskFactors = useMemo(() => {
    if (!selectedPathway) return countryData.riskFactors;
    return countryData.riskFactors.filter(
      (f) => !f.pathwayIds || f.pathwayIds.length === 0 || f.pathwayIds.includes(selectedPathway)
    );
  }, [countryData.riskFactors, selectedPathway]);

  const totalFactors = filteredRiskFactors.length;
  const answeredCount = factorResults.size;

  function setAnswer(factorId: string, answer: "yes" | "no" | "partial") {
    setFactorResults((prev) => {
      const next = new Map(prev);
      next.set(factorId, answer);
      return next;
    });
  }

  const results: FactorResult[] = filteredRiskFactors.map((factor) => {
    const answer = factorResults.get(factor.id) ?? null;
    let impact: "positive" | "neutral" | "negative" | "critical" = "neutral";
    let score = 100;
    if (answer === "yes") {
      if (factor.weight >= 30) { impact = "critical"; score = 0; }
      else if (factor.weight >= 20) { impact = "negative"; score = 100 - factor.weight * 2; }
      else { impact = "negative"; score = 100 - factor.weight; }
    } else if (answer === "partial") {
      impact = "neutral"; score = 100 - factor.weight / 2;
    } else if (answer === "no") {
      impact = "positive"; score = 100;
    }
    return { factor, answer, impact, score };
  });

  const answeredResults = results.filter((r) => r.answer !== null);
  const overallScore = answeredResults.length > 0
    ? Math.round(answeredResults.reduce((sum, r) => sum + r.score, 0) / answeredResults.length)
    : 100;
  const riskLevel = computeRiskLevel(overallScore);
  const config = riskLevelConfig[riskLevel];
  const criticalIssues = results.filter((r) => r.impact === "critical");
  const negativeIssues = results.filter((r) => r.impact === "negative");

  function reset() {
    setFactorResults(new Map());
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero header */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${countryCode}`} className="hover:text-white transition-colors">{countryData.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Risk Audit</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-violet-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pre-Lodgement Risk Audit</h1>
              <p className="text-slate-400 text-sm">{countryData.name} — Identify risks before you submit</p>
            </div>
          </div>

          {/* Pathway selector */}
          <div className="mt-6 bg-white/10 border border-white/15 rounded-xl p-4 backdrop-blur-sm">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Auditing for visa pathway</label>
            <select
              className="w-full px-3 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={selectedPathway}
              onChange={(e) => setSelectedPathway(e.target.value)}
            >
              <option value="" className="text-slate-900">General — all pathways</option>
              {countryData.pathways.map((p) => (
                <option key={p.id} value={p.id} className="text-slate-900">
                  {p.subclass ? `Subclass ${p.subclass} — ` : ""}{p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main content — two-column grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left column — questions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Intro */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                For each risk factor below, indicate whether it applies to your situation. Be honest — this is for your benefit. All responses stay in your browser only.
              </p>
            </div>

            {/* Risk factors */}
            {filteredRiskFactors.map((factor, index) => {
              const answer = factorResults.get(factor.id);
              const weightLabel = factor.weight >= 30 ? "Critical weight" : factor.weight >= 20 ? "High weight" : "Moderate weight";
              const weightColor = factor.weight >= 30 ? "text-red-600 bg-red-50" : factor.weight >= 20 ? "text-orange-600 bg-orange-50" : "text-amber-600 bg-amber-50";
              const isExpanded = expandedFactor === factor.id;

              return (
                <div
                  key={factor.id}
                  className={cn(
                    "bg-white rounded-xl border transition-all overflow-hidden",
                    answer ? "border-slate-200" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <button
                    onClick={() => setExpandedFactor(isExpanded ? null : factor.id)}
                    className="w-full p-5 flex items-start gap-3 text-left"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-slate-500">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-slate-900">{factor.label}</h3>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", weightColor)}>
                          {weightLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <div className="px-5 pb-5 -mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: "yes", label: "Yes, applies to me", color: "border-red-300 bg-red-50 text-red-700" },
                        { value: "partial", label: "Partially / unsure", color: "border-amber-300 bg-amber-50 text-amber-700" },
                        { value: "no", label: "No, does not apply", color: "border-emerald-300 bg-emerald-50 text-emerald-700" },
                      ] as const).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setAnswer(factor.id, opt.value)}
                          className={cn(
                            "px-3 py-2.5 rounded-lg border text-xs font-medium transition-all",
                            answer === opt.value ? opt.color : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {(answer === "yes" || isExpanded) && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Recommended mitigation:</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{factor.mitigation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Positive factors section */}
            {results.filter((r) => r.impact === "positive").length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Positive Profile Factors
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {results
                    .filter((r) => r.impact === "positive")
                    .map((r) => (
                      <div key={r.factor.id} className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs text-emerald-700">{r.factor.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Full breakdown table */}
            {answeredCount > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Full Risk Factor Breakdown</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {results.map((r) => {
                    const impactIcons = {
                      positive: <TrendingUp className="w-4 h-4 text-emerald-500" />,
                      neutral: <Minus className="w-4 h-4 text-slate-400" />,
                      negative: <TrendingDown className="w-4 h-4 text-orange-500" />,
                      critical: <XCircle className="w-4 h-4 text-red-500" />,
                    };
                    return (
                      <div key={r.factor.id} className="px-5 py-3.5 flex items-center gap-3">
                        {impactIcons[r.impact]}
                        <span className="text-sm text-slate-700 flex-1">{r.factor.label}</span>
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          r.answer === "yes" ? "bg-red-100 text-red-600" :
                          r.answer === "partial" ? "bg-amber-100 text-amber-600" :
                          r.answer === "no" ? "bg-emerald-100 text-emerald-600" :
                          "bg-slate-100 text-slate-400"
                        )}>
                          {r.answer === "yes" ? "Applies" : r.answer === "partial" ? "Partial" : r.answer === "no" ? "Clear" : "Not assessed"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column — live score panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Score gauge */}
              <div className={cn("rounded-2xl border p-5", config.bg, config.border)}>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Live risk score</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="16" fill="none"
                        stroke={overallScore >= 75 ? "#16a34a" : overallScore >= 50 ? "#d97706" : overallScore >= 30 ? "#ea580c" : "#dc2626"}
                        strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${(overallScore / 100) * 100.5} 100.5`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-900">{answeredCount > 0 ? overallScore : "—"}</span>
                    </div>
                  </div>
                  <div>
                    <span className={cn("text-sm font-bold", config.color)}>{config.label}</span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {answeredCount === 0 ? "Answer questions to see your score" : config.description}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{answeredCount} of {totalFactors} assessed</span>
                    <span>{Math.round((answeredCount / totalFactors) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${(answeredCount / totalFactors) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Issues summary */}
              {(criticalIssues.length > 0 || negativeIssues.length > 0) && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Issues found</h4>
                  {criticalIssues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-xs text-red-700 font-semibold">
                        {criticalIssues.length} critical issue{criticalIssues.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {negativeIssues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-amber-700 font-semibold">
                        {negativeIssues.length} risk factor{negativeIssues.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {results.filter((r) => r.impact === "positive").length > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-emerald-700 font-semibold">
                        {results.filter((r) => r.impact === "positive").length} positive factor{results.filter((r) => r.impact === "positive").length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Pathway-specific risk areas */}
              {selectedPathwayData && selectedPathwayData.cons.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <h4 className="text-xs font-bold text-amber-800">Known {selectedPathwayData.name} challenges</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedPathwayData.cons.slice(0, 4).map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-amber-800 leading-relaxed">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTAs */}
              {answeredCount > 0 && (
                <div className="space-y-2">
                  <Link
                    href={selectedPathway ? `/${countryCode}/planner?pathway=${selectedPathway}` : `/${countryCode}/planner`}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all"
                  >
                    <ListChecks className="w-4 h-4" /> Application checklist
                  </Link>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> Reset audit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
