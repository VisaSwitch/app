"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useActivePathway } from "@/hooks/use-active-pathway";
import { ActivePathwayBanner } from "@/components/tools/active-pathway-banner";
import {
  RefreshCw, ChevronRight, ArrowRight, CheckCircle, AlertCircle,
  XCircle, Globe, BarChart3, ListChecks, Search, ChevronDown,
  ChevronUp, Info, FileText, Clock, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, RefusalReason } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

const frequencyConfig = {
  "very-common": { label: "Very common", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  common: { label: "Common", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  occasional: { label: "Occasional", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
};

export function RefusalRecovery({ countryData, countryCode }: Props) {
  const searchParams = useSearchParams();
  const pathwayParam = searchParams.get("pathway") ?? "";

  const [selectedPathway, setSelectedPathway] = useState<string>(pathwayParam);
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());

  const { active, save, clear, loaded } = useActivePathway(countryCode);

  // Save to localStorage whenever a pathway is selected
  useEffect(() => {
    if (selectedPathway) {
      const pw = countryData.pathways.find(p => p.id === selectedPathway);
      if (pw) {
        save({
          pathwayId: pw.id,
          pathwayName: pw.name,
          subclass: pw.subclass ?? null,
          countryCode,
          countryName: countryData.name,
        });
      }
    }
  }, [selectedPathway, countryData, countryCode, save]);
  const [refusalText, setRefusalText] = useState<string>("");
  const [expandedReason, setExpandedReason] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);

  // Filter reasons by pathway
  const relevantReasons = useMemo(() => {
    return selectedPathway
      ? countryData.refusalReasons.filter(
          (r) => r.pathwaysAffected.includes(selectedPathway) || r.pathwaysAffected.length === 0
        )
      : countryData.refusalReasons;
  }, [selectedPathway, countryData.refusalReasons]);

  // Auto-detect from pasted text
  const detectedReasons = useMemo(() => {
    if (!refusalText) return [];
    return countryData.refusalReasons.filter((r) =>
      [r.title.toLowerCase(), r.description.toLowerCase()].some(
        (text) =>
          (text.includes("financial") && refusalText.toLowerCase().includes("financial")) ||
          (text.includes("genuine") && refusalText.toLowerCase().includes("genuine")) ||
          (text.includes("english") && refusalText.toLowerCase().includes("english")) ||
          (text.includes("health") && refusalText.toLowerCase().includes("health")) ||
          (text.includes("character") && refusalText.toLowerCase().includes("character")) ||
          (text.includes("skills") && refusalText.toLowerCase().includes("skills")) ||
          (text.includes("document") && refusalText.toLowerCase().includes("document"))
      )
    );
  }, [refusalText, countryData.refusalReasons]);

  function toggleReason(id: string) {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const selectedReasonData = countryData.refusalReasons.filter((r) => selectedReasons.has(r.id));

  return (
    <div className="min-h-screen bg-black">
      {loaded && active && (
        <ActivePathwayBanner active={active} currentTool="recovery" onClear={clear} />
      )}
      {/* Hero header */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 mb-4">
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
              <p className="text-zinc-400 text-sm">{countryData.name} — Understand your refusal and recover</p>
            </div>
          </div>

          {/* Config bar */}
          <div className="mt-6 bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Refused visa type</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-white/[0.15] bg-white/[0.07] text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  value={selectedPathway}
                  onChange={(e) => setSelectedPathway(e.target.value)}
                >
                  <option value="" className="bg-zinc-900">All visa types</option>
                  {countryData.pathways.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-900">
                      {p.subclass ? `Subclass ${p.subclass} — ` : ""}{p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">Refusal letter text</label>
                  <button
                    onClick={() => setShowTextInput(!showTextInput)}
                    className="text-xs text-zinc-500 hover:text-white transition-colors underline"
                  >
                    {showTextInput ? "Hide" : "Paste to auto-detect →"}
                  </button>
                </div>
                {showTextInput ? (
                  <textarea
                    rows={3}
                    placeholder="Paste key text from your refusal letter..."
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.12] bg-white/[0.05] text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                    value={refusalText}
                    onChange={(e) => setRefusalText(e.target.value)}
                  />
                ) : (
                  <p className="text-xs text-zinc-500 mt-1">Paste refusal letter text to auto-identify matching reasons below.</p>
                )}
              </div>
            </div>

            {/* Auto-detected reasons */}
            {detectedReasons.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-zinc-300 mb-2">
                  {detectedReasons.length} possible reason{detectedReasons.length > 1 ? "s" : ""} detected — click to select:
                </p>
                <div className="flex flex-wrap gap-2">
                  {detectedReasons.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => toggleReason(r.id)}
                      className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-lg border transition-all",
                        selectedReasons.has(r.id)
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-white/[0.07] text-zinc-300 border-white/[0.12] hover:bg-white/[0.12] hover:text-white"
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
      </div>

      {/* Main content — two columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Left column — reason selector (3/5 width) */}
          <div className="lg:col-span-3 space-y-4">
            {/* How to use */}
            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <Info className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                <span className="font-semibold text-white">Select every reason cited in your refusal letter.</span>{" "}
                Recovery steps appear inline — or paste letter text above to auto-detect them.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Refusal reasons</h2>
              {selectedReasons.size > 0 && (
                <span className="text-xs font-semibold text-white bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">{selectedReasons.size} selected</span>
              )}
            </div>

            <div className="space-y-3">
              {relevantReasons.map((reason) => {
                const isSelected = selectedReasons.has(reason.id);
                const fc = frequencyConfig[reason.frequency];
                return (
                  <div
                    key={reason.id}
                    className={cn(
                      "glass rounded-xl border overflow-hidden transition-all",
                      isSelected
                        ? "border-white/[0.25] bg-white/[0.07]"
                        : "border-white/[0.08] hover:border-white/[0.15]"
                    )}
                  >
                    <button
                      onClick={() => toggleReason(reason.id)}
                      className="w-full p-4 flex items-start gap-3 text-left"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                        isSelected ? "border-white bg-white" : "border-white/[0.20]"
                      )}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-black" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-white">{reason.title}</p>
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", fc.color)}>{fc.label}</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{reason.description}</p>
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isSelected
                          ? <ChevronUp className="w-4 h-4 text-zinc-400" />
                          : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                      </div>
                    </button>

                    {/* Inline solutions when selected */}
                    {isSelected && reason.solutions.length > 0 && (
                      <div className="px-4 pb-4 border-t border-white/[0.07] pt-3 ml-8">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Recovery steps</h4>
                        <ol className="space-y-2">
                          {reason.solutions.map((solution, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-white/[0.06] border border-white/10 text-zinc-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                              <span className="text-xs text-zinc-400 leading-relaxed">{solution}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column — live recovery plan (2/5 width, sticky) */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              {/* Summary card */}
              <div className="glass rounded-2xl border border-white/[0.08] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Recovery Plan</h3>
                  {selectedReasons.size > 0 && (
                    <span className="text-xs text-amber-400 font-semibold">
                      {selectedReasonData.reduce((sum, r) => sum + r.solutions.length, 0)} action steps
                    </span>
                  )}
                </div>
                {selectedReasons.size === 0 ? (
                  <p className="text-xs text-zinc-500 leading-relaxed">Select reasons on the left to build your personalised recovery plan.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedReasonData.map((r) => (
                      <div key={r.id} className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-300 leading-snug">{r.title}</p>
                          <p className="text-xs text-zinc-500">{r.solutions.length} step{r.solutions.length !== 1 ? "s" : ""} to fix</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* General advice — always shown */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <h4 className="text-xs font-bold text-amber-400">Key advice</h4>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Check merits review deadlines — strict time limits apply from the refusal date",
                    "Do not re-lodge immediately without addressing the refusal reasons",
                    "For complex refusals, engage a registered migration agent or lawyer",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-amber-300/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation to other tools */}
              <div className="glass rounded-2xl border border-white/[0.08] p-4 space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">After recovery planning</h4>
                <Link
                  href={`/${countryCode}/pathways`}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">Alternative pathways</div>
                    <div className="text-xs text-zinc-400">Find other options</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </Link>
                <div className="border-t border-white/[0.06]" />
                <Link
                  href={selectedPathway ? `/${countryCode}/audit?pathway=${selectedPathway}` : `/${countryCode}/audit`}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <BarChart3 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">Risk audit</div>
                    <div className="text-xs text-zinc-400">Before re-applying</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </Link>
                <div className="border-t border-white/[0.06]" />
                <Link
                  href={selectedPathway ? `/${countryCode}/planner?pathway=${selectedPathway}` : `/${countryCode}/planner`}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <ListChecks className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">New application plan</div>
                    <div className="text-xs text-zinc-400">Fresh checklist & timeline</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
