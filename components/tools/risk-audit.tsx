"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, RiskFactor } from "@/types";

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
  const [factorResults, setFactorResults] = useState<Map<string, "yes" | "no" | "partial">>(new Map());
  const [submitted, setSubmitted] = useState(false);

  const totalFactors = countryData.riskFactors.length;
  const answeredCount = factorResults.size;
  const progress = totalFactors > 0 ? (answeredCount / totalFactors) * 100 : 0;

  function setAnswer(factorId: string, answer: "yes" | "no" | "partial") {
    setFactorResults((prev) => {
      const next = new Map(prev);
      next.set(factorId, answer);
      return next;
    });
  }

  const results: FactorResult[] = countryData.riskFactors.map((factor) => {
    const answer = factorResults.get(factor.id) ?? null;
    let impact: FactorResult["impact"] = "neutral";
    let score = 100;

    if (answer === "yes") {
      // Has this risk factor — negative impact
      if (factor.weight >= 30) {
        impact = "critical";
        score = 0;
      } else if (factor.weight >= 20) {
        impact = "negative";
        score = 100 - factor.weight * 2;
      } else {
        impact = "negative";
        score = 100 - factor.weight;
      }
    } else if (answer === "partial") {
      impact = "neutral";
      score = 100 - factor.weight / 2;
    } else if (answer === "no") {
      impact = "positive";
      score = 100;
    }

    return { factor, answer, impact, score };
  });

  const answeredResults = results.filter((r) => r.answer !== null);
  const overallScore =
    answeredResults.length > 0
      ? Math.round(answeredResults.reduce((sum, r) => sum + r.score, 0) / answeredResults.length)
      : 100;

  const riskLevel = computeRiskLevel(overallScore);
  const config = riskLevelConfig[riskLevel];

  const criticalIssues = results.filter((r) => r.impact === "critical");
  const negativeIssues = results.filter((r) => r.impact === "negative");

  function reset() {
    setFactorResults(new Map());
    setSubmitted(false);
  }

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
            <span className="text-white">Risk Audit</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pre-Lodgement Risk Audit</h1>
                <p className="text-slate-400 text-sm">{countryData.name} — Identify risks before you submit</p>
              </div>
            </div>
          </div>

          {!submitted && (
            <div className="mt-6 max-w-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{answeredCount} of {totalFactors} factors assessed</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {!submitted ? (
          <>
            {/* Intro */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                For each risk factor below, indicate whether it applies to your situation. Be honest — this is for your benefit. All responses stay in your browser only.
              </p>
            </div>

            {/* Risk factors */}
            <div className="space-y-4">
              {countryData.riskFactors.map((factor, index) => {
                const answer = factorResults.get(factor.id);
                const weightLabel = factor.weight >= 30 ? "Critical weight" : factor.weight >= 20 ? "High weight" : "Moderate weight";
                const weightColor = factor.weight >= 30 ? "text-red-600 bg-red-50" : factor.weight >= 20 ? "text-orange-600 bg-orange-50" : "text-amber-600 bg-amber-50";

                return (
                  <div
                    key={factor.id}
                    className={cn(
                      "bg-white rounded-xl border p-5 transition-all",
                      answer ? "border-slate-200" : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-slate-500">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-sm font-bold text-slate-900">{factor.label}</h3>
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", weightColor)}>
                            {weightLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
                      </div>
                    </div>

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

                    {answer === "yes" && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Recommended mitigation:</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{factor.mitigation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <button
              onClick={() => setSubmitted(true)}
              disabled={answeredCount === 0}
              className="w-full py-4 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Generate risk analysis
              {answeredCount < totalFactors && (
                <span className="text-xs opacity-70">({totalFactors - answeredCount} unanswered)</span>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Risk score */}
            <div className={cn("rounded-2xl border p-7", config.bg, config.border)}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke={overallScore >= 75 ? "#16a34a" : overallScore >= 50 ? "#d97706" : overallScore >= 30 ? "#ea580c" : "#dc2626"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${(overallScore / 100) * 100.5} 100.5`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-900">{overallScore}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <span className={cn("inline-flex items-center gap-1.5 text-sm font-bold mb-2", config.color)}>
                    <Shield className="w-4 h-4" />
                    {config.label}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{config.description}</p>
                </div>
              </div>
            </div>

            {/* Critical issues */}
            {criticalIssues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Critical Issues — Address before lodging
                </h3>
                <div className="space-y-4">
                  {criticalIssues.map((r) => (
                    <div key={r.factor.id}>
                      <p className="text-sm font-semibold text-red-800 mb-1">{r.factor.label}</p>
                      <p className="text-xs text-red-700 mb-2">{r.factor.description}</p>
                      <div className="p-3 bg-white/70 rounded-lg border border-red-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Recommended action:</p>
                        <p className="text-xs text-slate-600">{r.factor.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moderate issues */}
            {negativeIssues.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Factors Identified — Review and mitigate
                </h3>
                <div className="space-y-4">
                  {negativeIssues.map((r) => (
                    <div key={r.factor.id} className="pb-4 border-b border-amber-200 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-amber-800">{r.factor.label}</p>
                        <TrendingDown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-amber-700 mb-2">{r.factor.description}</p>
                      <div className="p-3 bg-white/70 rounded-lg border border-amber-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">How to address this:</p>
                        <p className="text-xs text-slate-600">{r.factor.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positive factors */}
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

            {/* Factor table */}
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

            {/* Next steps */}
            <div className="bg-gradient-to-r from-slate-900 to-violet-950 rounded-2xl p-6 text-white">
              <h3 className="text-base font-bold mb-2">What to do next</h3>
              <div className="space-y-2 mb-5">
                {criticalIssues.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <span className="text-xs text-slate-300">Resolve the critical issue{criticalIssues.length > 1 ? "s" : ""} above before lodging — these are refusal triggers</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">{criticalIssues.length > 0 ? "2" : "1"}</span>
                  </div>
                  <span className="text-xs text-slate-300">Use the checklist planner to ensure all documents are ready before your lodgement date</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">{criticalIssues.length > 0 ? "3" : "2"}</span>
                  </div>
                  <span className="text-xs text-slate-300">Consider consulting a registered migration agent for complex issues before lodging</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/${countryCode}/planner`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all"
                >
                  <ListChecks className="w-3.5 h-3.5" /> Application checklist
                </Link>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-300 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-assess
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
