"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useActivePathway } from "@/hooks/use-active-pathway";
import { ActivePathwayBanner } from "@/components/tools/active-pathway-banner";
import {
  Globe,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Calendar,
  ArrowRight,
  BarChart3,
  ListChecks,
  RefreshCw,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, VisaPathway, VisaCurrentOption, VisaGoalOption } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

function getDifficultyConfig(difficulty: VisaPathway["difficulty"]) {
  return {
    straightforward: { label: "Straightforward", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    moderate: { label: "Moderate", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    complex: { label: "Complex", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  }[difficulty];
}

// ── Best Match Verdict Card ──────────────────────────────────────────────────
function BestMatchVerdictCard({
  pathway,
  countryCode,
}: {
  pathway: VisaPathway;
  countryCode: string;
}) {
  const difficulty = getDifficultyConfig(pathway.difficulty);
  const steps = pathway.applicationSteps ?? pathway.nextSteps.map(s => ({ action: s, detail: "", link: undefined, duration: undefined }));

  return (
    <div className="rounded-2xl border border-white/[0.22] bg-white/[0.05] overflow-hidden relative">
      {/* Top shimmer line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      {/* Verdict header strip */}
      <div className="px-6 py-3 border-b border-white/[0.08] flex items-center gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Your best match</span>
        <span className={cn("ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border", difficulty.color)}>
          {difficulty.label}
        </span>
      </div>

      <div className="px-6 pt-6 pb-5">
        {/* Name + icon */}
        <div className="flex items-start gap-4 mb-5">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", pathway.iconBg)}>
            <Globe className={cn("w-6 h-6", pathway.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            {pathway.subclass && (
              <div className="text-xs font-semibold text-zinc-500 mb-0.5">Subclass {pathway.subclass}</div>
            )}
            <h2 className="text-xl font-bold text-white leading-tight">{pathway.name}</h2>
            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{pathway.tagline}</p>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: Clock, label: "Processing", value: pathway.processingTime },
            { icon: Calendar, label: "Validity", value: pathway.validity },
            { icon: DollarSign, label: "Govt fee", value: pathway.cost },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{stat.value}</span>
              </div>
            );
          })}
        </div>

        {/* Urgent note */}
        {pathway.urgentNote && (
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5 mb-5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/90 leading-relaxed">{pathway.urgentNote}</p>
          </div>
        )}

        {/* How to Apply */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">→</span>
            How to apply
          </h4>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/[0.12] text-zinc-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {s.link ? (
                      <a href={s.link} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-semibold text-white hover:text-zinc-300 underline decoration-white/20 transition-colors">
                        {s.action} <ExternalLink className="inline w-3 h-3 ml-0.5 opacity-60" />
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-white">{s.action}</span>
                    )}
                    {s.duration && (
                      <span className="text-xs text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded-full border border-white/[0.06]">
                        {s.duration}
                      </span>
                    )}
                  </div>
                  {s.detail && <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{s.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Eligibility */}
        {pathway.eligibility.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">You must meet</h4>
            <div className="flex flex-wrap gap-2">
              {pathway.eligibility.map((req) => (
                <span key={req.id} className={cn(
                  "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border",
                  req.required ? "text-zinc-300 bg-white/[0.05] border-white/[0.10]" : "text-zinc-400 bg-transparent border-white/[0.05]"
                )}>
                  {req.required ? <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <div className="w-3 h-3" />}
                  {req.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pros / Cons */}
        <details open className="mb-5 group">
          <summary className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 cursor-pointer select-none list-none flex items-center gap-1.5 mb-3">
            <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
            Pros &amp; cons
          </summary>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-emerald-500/[0.07] rounded-xl border border-emerald-500/15 p-3.5">
              <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Pros
              </h4>
              <ul className="space-y-1.5">
                {pathway.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-emerald-300/80 leading-relaxed">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/[0.07] rounded-xl border border-red-500/15 p-3.5">
              <h4 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Cons
              </h4>
              <ul className="space-y-1.5">
                {pathway.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-red-300/80 leading-relaxed">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>

        {/* Leads to */}
        {pathway.pathwayTo.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-xs font-semibold text-zinc-500">Leads to:</span>
            {pathway.pathwayTo.map((p) => (
              <span key={p} className="text-xs bg-white/[0.07] text-zinc-300 border border-white/[0.10] px-2.5 py-1 rounded-full font-medium">
                {p}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-3 pt-1">
          <Link
            href={`/${countryCode}/planner?pathway=${pathway.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-bold px-5 py-3 rounded-xl hover:bg-zinc-100 transition-all"
          >
            <ListChecks className="w-4 h-4" /> Plan this visa
          </Link>
          <Link
            href={`/${countryCode}/audit?pathway=${pathway.id}`}
            className="inline-flex items-center gap-2 border border-white/[0.15] text-zinc-300 text-sm font-semibold px-5 py-3 rounded-xl hover:border-white/30 hover:text-white transition-all"
          >
            <BarChart3 className="w-4 h-4" /> Risk audit
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Compact secondary card ───────────────────────────────────────────────────
function SecondaryPathwayCard({
  pathway,
  expanded,
  onToggle,
  countryCode,
}: {
  pathway: VisaPathway;
  expanded: boolean;
  onToggle: () => void;
  countryCode: string;
}) {
  const difficulty = getDifficultyConfig(pathway.difficulty);
  const steps = pathway.applicationSteps ?? pathway.nextSteps.map(s => ({ action: s, detail: "", link: undefined, duration: undefined }));

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] overflow-hidden hover:bg-white/[0.05] hover:border-white/[0.12] transition-all">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-3 text-left">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", pathway.iconBg)}>
          <Globe className={cn("w-4 h-4", pathway.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
            {pathway.subclass && (
              <span className="text-xs text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded-full">
                Subclass {pathway.subclass}
              </span>
            )}
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", difficulty.color)}>
              {difficulty.label}
            </span>
          </div>
          <div className="text-sm font-bold text-white">{pathway.name}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{pathway.tagline}</div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pathway.processingTime}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{pathway.cost}</span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.07]">
          {/* How to Apply */}
          <div className="px-5 pt-4 pb-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">→</span>
              How to apply
            </h4>
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/[0.12] text-zinc-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {s.link ? (
                        <a href={s.link} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-semibold text-white hover:text-zinc-300 underline decoration-white/20 transition-colors">
                          {s.action} <ExternalLink className="inline w-3 h-3 ml-0.5 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-white">{s.action}</span>
                      )}
                      {s.duration && (
                        <span className="text-xs text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded-full border border-white/[0.06]">{s.duration}</span>
                      )}
                    </div>
                    {s.detail && <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{s.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Pros/Cons */}
          <details className="px-5 py-3 border-t border-white/[0.06] group">
            <summary className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 cursor-pointer select-none list-none flex items-center gap-1.5">
              <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
              See pros &amp; cons
            </summary>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-emerald-500/[0.07] rounded-xl border border-emerald-500/15 p-3.5">
                <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Pros</h4>
                <ul className="space-y-1.5">
                  {pathway.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-emerald-300/80 leading-relaxed">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/[0.07] rounded-xl border border-red-500/15 p-3.5">
                <h4 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Cons</h4>
                <ul className="space-y-1.5">
                  {pathway.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-red-300/80 leading-relaxed">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          {/* CTAs */}
          <div className="px-5 pb-4 pt-3 border-t border-white/[0.06]">
            <div className="flex gap-2.5">
              <Link
                href={`/${countryCode}/planner?pathway=${pathway.id}`}
                className="inline-flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-zinc-100 transition-all"
              >
                <ListChecks className="w-3.5 h-3.5" /> Plan this visa
              </Link>
              <Link
                href={`/${countryCode}/audit?pathway=${pathway.id}`}
                className="inline-flex items-center gap-1.5 border border-white/[0.12] text-zinc-400 text-xs font-semibold px-4 py-2.5 rounded-lg hover:border-white/25 hover:text-white transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5" /> Risk audit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PathwaysChecker({ countryData, countryCode }: Props) {
  const [currentVisa, setCurrentVisa] = useState<string>("");
  const [goal, setGoal] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { active, clear, loaded } = useActivePathway(countryCode);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const rankedPathwayIds = useMemo<string[]>(() => {
    if (!currentVisa) return [];
    const matrix = countryData.pathwayRelevance;
    const byVisa = matrix[currentVisa];
    if (!byVisa) return [];
    return byVisa[goal] ?? byVisa["all"] ?? [];
  }, [currentVisa, goal, countryData]);

  const difficultyOrder = { straightforward: 0, moderate: 1, complex: 2 } as const;

  const displayedPathways = useMemo<VisaPathway[]>(() => {
    if (!currentVisa) return [];

    const byId = new Map(countryData.pathways.map((p) => [p.id, p]));
    const ranked: VisaPathway[] = [];
    for (const id of rankedPathwayIds) {
      const p = byId.get(id);
      if (p) ranked.push(p);
    }

    const extras: VisaPathway[] = [];
    for (const p of countryData.pathways) {
      if (rankedPathwayIds.includes(p.id)) continue;
      const visaMatch = p.fromVisas.includes(currentVisa) || p.fromVisas.length === 0;
      const goalMatch = goal === "all" || p.forGoals.includes(goal as VisaPathway["forGoals"][number]);
      if (visaMatch && goalMatch) extras.push(p);
    }
    extras.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    return [...ranked, ...extras];
  }, [currentVisa, goal, rankedPathwayIds, countryData]);

  const bestMatchPathway = currentVisa && displayedPathways.length > 0 && rankedPathwayIds.includes(displayedPathways[0].id)
    ? displayedPathways[0]
    : null;

  const secondaryPathways = bestMatchPathway
    ? displayedPathways.slice(1)
    : displayedPathways;

  // "You might have missed this"
  const discoveryPathways = useMemo<Array<{ pathway: VisaPathway; reason: string }>>(() => {
    if (!currentVisa) return [];
    const displayedIds = new Set(displayedPathways.map(p => p.id));
    const candidates: Array<{ pathway: VisaPathway; reason: string }> = [];
    for (const p of countryData.pathways) {
      if (displayedIds.has(p.id)) continue;
      if (p.difficulty === "complex") continue;
      if ((goal === "pr" || goal === "stay") && p.forGoals.includes("pr") && p.difficulty === "straightforward") {
        candidates.push({ pathway: p, reason: `A straightforward route to ${p.pathwayTo.length > 0 ? p.pathwayTo[0] : "permanent residency"} you may not have considered.` });
        continue;
      }
      const bridgeSource = displayedPathways.find(dp => dp.pathwayTo.some(pt => pt.toLowerCase().includes(p.subclass ?? p.name.toLowerCase().slice(0, 6))));
      if (bridgeSource) {
        candidates.push({ pathway: p, reason: `${bridgeSource.name} can lead here — a natural next step for your profile.` });
        continue;
      }
      const goalMatch = goal === "all" || p.forGoals.includes(goal as VisaPathway["forGoals"][number]);
      if (goalMatch && p.difficulty === "straightforward") {
        candidates.push({ pathway: p, reason: `This pathway also achieves your goal and is rated straightforward.` });
      }
    }
    return candidates.slice(0, 3);
  }, [currentVisa, goal, displayedPathways, countryData.pathways]);

  const relatedTools = [
    {
      icon: ListChecks,
      title: "Checklist & Timeline",
      shortDesc: "Step-by-step plan with documents and deadlines",
      href: bestMatchPathway ? `/${countryCode}/planner?pathway=${bestMatchPathway.id}` : `/${countryCode}/planner`,
      iconColor: "bg-indigo-500/15 text-indigo-400",
    },
    {
      icon: BarChart3,
      title: "Risk Audit",
      shortDesc: "Score your profile and fix weak spots before you apply",
      href: bestMatchPathway ? `/${countryCode}/audit?pathway=${bestMatchPathway.id}` : `/${countryCode}/audit`,
      iconColor: "bg-violet-500/15 text-violet-400",
    },
    {
      icon: RefreshCw,
      title: "Refusal Recovery",
      shortDesc: "Diagnose your refusal and build a stronger reapplication",
      href: bestMatchPathway ? `/${countryCode}/recovery?pathway=${bestMatchPathway.id}` : `/${countryCode}/recovery`,
      iconColor: "bg-rose-500/15 text-rose-400",
    },
  ];

  const hasResults = currentVisa && displayedPathways.length > 0;

  return (
    <div className="min-h-screen bg-black">
      {loaded && active && (
        <ActivePathwayBanner active={active} currentTool="pathways" onClear={clear} />
      )}

      {/* Hero + Filter */}
      <div className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${countryCode}`} className="hover:text-white transition-colors capitalize">{countryData.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Pathway Checker</span>
          </div>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-zinc-300" />
              </div>
              <h1 className="text-2xl font-bold text-white">Visa Pathway Checker</h1>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tell us your current visa and goal — we&apos;ll instantly show your best {countryData.name} pathway.
            </p>
          </div>

          {/* Filter panel */}
          <div className="mt-8 bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Step 1 — Current visa */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold mr-1.5">1</span>
                  I currently have
                </label>
                <div className="flex flex-col gap-2">
                  {countryData.currentVisaOptions.map((opt: VisaCurrentOption) => (
                    <button
                      key={opt.value}
                      onClick={() => setCurrentVisa(opt.value)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all",
                        currentVisa === opt.value
                          ? "bg-white text-black border-white shadow-sm"
                          : "bg-white/5 text-zinc-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0 transition-all", currentVisa === opt.value ? "bg-zinc-800" : "bg-white/20")} />
                      <div className="min-w-0">
                        <div className={cn("text-sm font-semibold truncate", currentVisa === opt.value ? "text-black" : "text-white")}>{opt.label}</div>
                        <div className={cn("text-xs truncate", currentVisa === opt.value ? "text-zinc-600" : "text-zinc-400")}>{opt.sublabel}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 — Goal */}
              <div className={cn("transition-opacity", !currentVisa && "opacity-40 pointer-events-none")}>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold mr-1.5">2</span>
                  My goal
                </label>
                <div className="flex flex-col gap-2">
                  {countryData.goalOptions.map((opt: VisaGoalOption) => (
                    <button
                      key={opt.value}
                      onClick={() => setGoal(opt.value)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all",
                        goal === opt.value
                          ? "bg-white text-black border-white shadow-sm"
                          : "bg-white/5 text-zinc-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full flex-shrink-0 transition-all", goal === opt.value ? "bg-zinc-800" : "bg-white/20")} />
                      <div className="min-w-0">
                        <div className={cn("text-sm font-semibold truncate", goal === opt.value ? "text-black" : "text-white")}>{opt.label}</div>
                        <div className={cn("text-xs truncate", goal === opt.value ? "text-zinc-600" : "text-zinc-400")}>{opt.sublabel}</div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setGoal("all")}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all",
                      goal === "all"
                        ? "bg-white text-black border-white shadow-sm"
                        : "bg-white/5 text-zinc-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0 transition-all", goal === "all" ? "bg-zinc-800" : "bg-white/20")} />
                    <div className="min-w-0">
                      <div className={cn("text-sm font-semibold", goal === "all" ? "text-black" : "text-white")}>No preference — show all</div>
                      <div className={cn("text-xs", goal === "all" ? "text-zinc-600" : "text-zinc-400")}>All pathways for my visa status</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {currentVisa && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-sm text-zinc-300">
                  <span className="font-bold text-white">{displayedPathways.length}</span> pathway{displayedPathways.length !== 1 ? "s" : ""} ranked for your profile
                </p>
                <button
                  onClick={() => { setCurrentVisa(""); setGoal("all"); }}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ── No visa selected — clean placeholder ── */}
          {!currentVisa && (
            <div className="max-w-lg mx-auto py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.09] flex items-center justify-center mx-auto mb-5">
                <Globe className="w-8 h-8 text-zinc-500" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Start with Step 1 above</h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                Select your current visa status — we&apos;ll immediately rank all {countryData.pathways.length} {countryData.name} pathways for your situation and highlight the strongest match.
              </p>
              <div className="grid grid-cols-3 gap-4 text-left">
                {[
                  { icon: Star, label: "Ranked results", sub: "Best match shown first" },
                  { icon: ListChecks, label: "How to apply", sub: "Step-by-step guide" },
                  { icon: BarChart3, label: "Risk profile", sub: "Know your chances" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5 text-center">
                    <Icon className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-zinc-300">{label}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {hasResults && (
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main column */}
              <div className="lg:col-span-2 space-y-6">

                {/* No-results state */}
                {displayedPathways.length === 0 && (
                  <div className="glass rounded-2xl border border-white/[0.08] p-8 text-center">
                    <Globe className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white mb-1">No direct pathways found</h3>
                    <p className="text-xs text-zinc-500 mb-4">Try &quot;No preference — show all&quot; to see more options.</p>
                    <button onClick={() => setGoal("all")} className="text-xs font-semibold text-zinc-400 hover:text-white underline">
                      Show all pathways
                    </button>
                  </div>
                )}

                {/* Best match verdict card */}
                {bestMatchPathway && (
                  <BestMatchVerdictCard pathway={bestMatchPathway} countryCode={countryCode} />
                )}

                {/* Secondary pathways */}
                {secondaryPathways.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Also consider</span>
                      <span className="text-xs text-zinc-600">— {secondaryPathways.length} other option{secondaryPathways.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="space-y-3">
                      {secondaryPathways.map((pathway) => (
                        <SecondaryPathwayCard
                          key={pathway.id}
                          pathway={pathway}
                          expanded={expandedIds.has(pathway.id)}
                          onToggle={() => toggleExpanded(pathway.id)}
                          countryCode={countryCode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Discovery section */}
                {discoveryPathways.length > 0 && (
                  <div className="pt-6 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">You might have missed this</h3>
                        <p className="text-xs text-zinc-400">Alternative pathways worth exploring from your profile</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {discoveryPathways.map(({ pathway, reason }) => {
                        const diffConf = getDifficultyConfig(pathway.difficulty);
                        return (
                          <div key={pathway.id} className="glass rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all p-4 flex items-start gap-4">
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", pathway.iconBg)}>
                              <Globe className={cn("w-4 h-4", pathway.iconColor)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className="text-sm font-bold text-white">{pathway.name}</span>
                                {pathway.subclass && (
                                  <span className="text-xs text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded-full">Subclass {pathway.subclass}</span>
                                )}
                                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", diffConf.color)}>{diffConf.label}</span>
                              </div>
                              <p className="text-xs text-zinc-500 mb-2 leading-relaxed">{reason}</p>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-xs text-zinc-400"><Clock className="w-3 h-3" />{pathway.processingTime}</span>
                                <span className="flex items-center gap-1 text-xs text-zinc-400"><DollarSign className="w-3 h-3" />{pathway.cost}</span>
                              </div>
                            </div>
                            <Link
                              href={`/${countryCode}/planner?pathway=${pathway.id}`}
                              className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-white border border-white/[0.08] hover:border-white/[0.20] px-3 py-1.5 rounded-lg transition-all"
                            >
                              Explore <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar — only shown when there are results */}
              <div className="flex flex-col gap-5">

                {/* Continue with */}
                <div className="glass rounded-2xl border border-white/[0.08] p-5">
                  <h3 className="text-sm font-bold text-white mb-1">Continue with</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    {bestMatchPathway
                      ? <>Pre-loaded for <span className="font-semibold text-zinc-300">{bestMatchPathway.name}</span></>
                      : "Select a pathway to pre-load these tools."}
                  </p>
                  <div className="space-y-2">
                    {relatedTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.title}
                          href={tool.href}
                          className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all group"
                        >
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", tool.iconColor)}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{tool.title}</div>
                            <div className="text-xs text-zinc-500">{tool.shortDesc}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 flex-shrink-0 transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Official source */}
                <div className="glass rounded-2xl border border-white/[0.08] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-bold text-white">Official source</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
                    Immigration rules change frequently. Always verify current requirements before lodging.
                  </p>
                  <a
                    href={countryData.visaBodyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 group"
                  >
                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                      {countryData.visaBodyName}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0 transition-colors" />
                  </a>
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-zinc-500 leading-relaxed px-1">
                  VisaSwitch provides structured information only — not legal or immigration advice. For complex cases, consult a registered migration agent.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
