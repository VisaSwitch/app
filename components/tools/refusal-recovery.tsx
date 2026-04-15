"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Globe,
  BarChart3,
  ListChecks,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, RefusalReason } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

const frequencyConfig = {
  "very-common": { label: "Very common", color: "text-red-600 bg-red-50 border-red-200" },
  common: { label: "Common", color: "text-orange-600 bg-orange-50 border-orange-200" },
  occasional: { label: "Occasional", color: "text-amber-600 bg-amber-50 border-amber-200" },
};

export function RefusalRecovery({ countryData, countryCode }: Props) {
  const [step, setStep] = useState<"intro" | "identify" | "results">("intro");
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());
  const [visaType, setVisaType] = useState<string>("");
  const [refusalText, setRefusalText] = useState<string>("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Filter reasons by visa type if selected
  const relevantReasons = visaType
    ? countryData.refusalReasons.filter(
        (r) => r.pathwaysAffected.includes(visaType) || r.pathwaysAffected.length === 0
      )
    : countryData.refusalReasons;

  // Auto-detect potential reasons from refusal letter text
  const detectedReasons = refusalText
    ? countryData.refusalReasons.filter((r) =>
        [r.title.toLowerCase(), r.description.toLowerCase()].some(
          (text) =>
            text.includes("financial") && refusalText.toLowerCase().includes("financial") ||
            text.includes("genuine") && refusalText.toLowerCase().includes("genuine") ||
            text.includes("english") && refusalText.toLowerCase().includes("english") ||
            text.includes("health") && refusalText.toLowerCase().includes("health") ||
            text.includes("character") && refusalText.toLowerCase().includes("character") ||
            text.includes("skills") && refusalText.toLowerCase().includes("skills") ||
            text.includes("document") && refusalText.toLowerCase().includes("document")
        )
      )
    : [];

  function toggleReason(id: string) {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedReasonData = countryData.refusalReasons.filter((r) => selectedReasons.has(r.id));

  function reset() {
    setStep("intro");
    setSelectedReasons(new Set());
    setVisaType("");
    setRefusalText("");
    setExpanded(null);
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
            <span className="text-white">Refusal Recovery</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Refusal Recovery Advisor</h1>
              <p className="text-slate-400 text-sm">{countryData.name} — Understand your refusal and recover</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {step === "intro" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
              <h2 className="text-xl font-bold text-slate-900 mb-3">After a refusal — where to start</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                A refusal is not the end. Most refusals are addressable with the right evidence and understanding. This tool helps you identify why the visa was refused and maps out your strongest path forward.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Identify the exact reasons for refusal", icon: Search },
                  { label: "Understand which reasons are most serious", icon: AlertCircle },
                  { label: "Get specific, actionable solutions for each reason", icon: CheckCircle },
                  { label: "Know whether to re-apply, appeal, or change pathway", icon: ArrowRight },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setStep("identify")}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all"
              >
                Start recovery analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Common refusal reasons preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Most common {countryData.name} refusal reasons</h3>
              <div className="space-y-3">
                {countryData.refusalReasons
                  .filter((r) => r.frequency === "very-common")
                  .map((reason) => {
                    const fc = frequencyConfig[reason.frequency];
                    return (
                      <div key={reason.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{reason.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{reason.description}</p>
                          <span className={cn("inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border mt-2", fc.color)}>
                            {fc.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {step === "identify" && (
          <div className="space-y-5">
            {/* Visa type selector */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Step 1: Tell us about your refusal</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Which visa type was refused?
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                  >
                    <option value="">All visa types</option>
                    {countryData.pathways.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.subclass ? `Subclass ${p.subclass} — ` : ""}{p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Paste key text from your refusal letter (optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste the refusal reasons from your letter here — we will help identify which category they fall into..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    value={refusalText}
                    onChange={(e) => setRefusalText(e.target.value)}
                  />
                </div>

                {detectedReasons.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 text-purple-500 mt-0.5" />
                      <p className="text-xs font-semibold text-purple-800">
                        Detected {detectedReasons.length} possible refusal reason{detectedReasons.length > 1 ? "s" : ""} from your letter
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detectedReasons.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => toggleReason(r.id)}
                          className={cn(
                            "text-xs font-medium px-3 py-1.5 rounded-lg border transition-all",
                            selectedReasons.has(r.id)
                              ? "bg-purple-500 text-white border-purple-500"
                              : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
                          )}
                        >
                          {r.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reason selector */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Step 2: Select the reasons cited in your refusal</h3>
              <p className="text-slate-500 text-xs mb-4">Select all that apply — you can select multiple reasons.</p>

              <div className="space-y-3">
                {relevantReasons.map((reason) => {
                  const isSelected = selectedReasons.has(reason.id);
                  const fc = frequencyConfig[reason.frequency];
                  return (
                    <button
                      key={reason.id}
                      onClick={() => toggleReason(reason.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all",
                        isSelected
                          ? "border-purple-400 bg-purple-50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all", isSelected ? "border-purple-500 bg-purple-500" : "border-slate-300")}>
                          {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-900">{reason.title}</p>
                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", fc.color)}>
                              {fc.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{reason.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("intro")}
                  className="px-5 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("results")}
                  disabled={selectedReasons.size === 0}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl hover:from-purple-600 hover:to-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Generate recovery plan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-5">
            {/* Recovery summary */}
            <div className="bg-gradient-to-br from-slate-900 to-purple-950 rounded-2xl p-7 text-white">
              <h2 className="text-xl font-bold mb-1">Your Refusal Recovery Plan</h2>
              <p className="text-slate-400 text-sm mb-5">
                {selectedReasons.size} refusal reason{selectedReasons.size > 1 ? "s" : ""} identified — {countryData.name}
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1">{selectedReasons.size}</div>
                  <div className="text-xs text-slate-400">Reasons identified</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1 text-amber-300">
                    {selectedReasonData.reduce((sum, r) => sum + r.solutions.length, 0)}
                  </div>
                  <div className="text-xs text-slate-400">Action steps</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1 text-emerald-300">
                    {selectedReasonData.filter((r) => r.frequency !== "occasional").length}
                  </div>
                  <div className="text-xs text-slate-400">High-priority fixes</div>
                </div>
              </div>
            </div>

            {/* Recovery plan for each reason */}
            {selectedReasonData.map((reason, index) => {
              const fc = frequencyConfig[reason.frequency];
              const isExpanded = expanded === reason.id;
              return (
                <div key={reason.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : reason.id)}
                    className="w-full p-6 flex items-start gap-4 text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-purple-700">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold text-slate-900">{reason.title}</h3>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", fc.color)}>
                          {fc.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{reason.description}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-100 pt-5">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        Actionable solutions
                      </h4>
                      <ol className="space-y-3">
                        {reason.solutions.map((solution, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-purple-700">{i + 1}</span>
                            </div>
                            <span className="text-sm text-slate-700 leading-relaxed">{solution}</span>
                          </li>
                        ))}
                      </ol>

                      {reason.pathwaysAffected.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-xs text-slate-500 mb-2">Affects these visa types:</p>
                          <div className="flex flex-wrap gap-2">
                            {reason.pathwaysAffected.map((p) => {
                              const pathway = countryData.pathways.find((pw) => pw.id === p);
                              return (
                                <span key={p} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                                  {pathway ? pathway.name : p}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* General advice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-2">General refusal recovery advice</p>
                  <ul className="space-y-1.5">
                    {[
                      "Check your statutory deadlines — merits review (AAT in Australia, IAC in UK) has strict time limits from the refusal date",
                      "Do not re-lodge immediately without addressing the refusal reasons — you risk a second refusal on the same grounds",
                      "For complex refusals, engage a registered migration agent or immigration lawyer to review the decision letter in full",
                      "Consider alternative visa pathways if the primary pathway is no longer viable — use the Pathway Checker for options",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-amber-800 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href={`/${countryCode}/pathways`}
                className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <Globe className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">Alternative Pathways</span>
                <span className="text-xs text-slate-500">Find other visa options you qualify for</span>
              </Link>
              <Link
                href={`/${countryCode}/audit`}
                className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all group"
              >
                <BarChart3 className="w-5 h-5 text-violet-500" />
                <span className="text-sm font-semibold text-slate-800 group-hover:text-violet-700">Risk Audit</span>
                <span className="text-xs text-slate-500">Audit risks before re-applying</span>
              </Link>
              <Link
                href={`/${countryCode}/planner`}
                className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
              >
                <ListChecks className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700">Application Plan</span>
                <span className="text-xs text-slate-500">Build a new application checklist</span>
              </Link>
            </div>

            <div className="text-center">
              <button onClick={reset} className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline">
                Start a new refusal analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
