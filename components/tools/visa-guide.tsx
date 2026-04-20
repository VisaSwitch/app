"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
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
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Lock,
  Target,
  FileCheck,
  Circle,
  Info,
  Zap,
  TrendingUp,
  CheckSquare,
  Square,
  FileText,
  Search,
  Star,
  Lightbulb,
  ClipboardList,
  SendHorizonal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CountryData,
  VisaPathway,
  RiskFactor,
  ChecklistItem,
  RefusalReason,
} from "@/types";
import type { ApplicationOutcome } from "@/hooks/use-outcome";

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  countryData: CountryData;
  countryCode: string;
}

type Step = 1 | 2 | 3 | 4;

interface GuideState {
  step: Step;
  maxUnlocked: Step;
  // Step 1
  currentVisa: string;
  goal: string;
  confirmedPathwayId: string | null;
  // Step 2
  eligibilityChecks: Record<string, boolean>;
  riskAnswers: Record<string, "yes" | "no" | "partial">;
  // Step 3
  checklistCompleted: Record<string, boolean>;
  lodgementDate: string;
  // Step 4
  outcome: ApplicationOutcome | null;
  refusalReasons: string[];
}

const STORAGE_KEY_PREFIX = "vs_guide_";

const defaultState: Omit<GuideState, "step" | "maxUnlocked"> = {
  currentVisa: "",
  goal: "all",
  confirmedPathwayId: null,
  eligibilityChecks: {},
  riskAnswers: {},
  checklistCompleted: {},
  lodgementDate: "",
  outcome: null,
  refusalReasons: [],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDifficultyConfig(difficulty: VisaPathway["difficulty"]) {
  return {
    straightforward: {
      label: "Straightforward",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    moderate: {
      label: "Moderate",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    complex: {
      label: "Complex",
      color: "text-red-400 bg-red-500/10 border-red-500/20",
    },
  }[difficulty];
}

type RiskLevel = "low" | "moderate" | "high" | "critical";

const riskLevelConfig: Record<
  RiskLevel,
  { label: string; color: string; bg: string; border: string; description: string }
> = {
  low: {
    label: "Low Risk",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    description:
      "Your application profile looks strong. Proceed with final preparation.",
  },
  moderate: {
    label: "Moderate Risk",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    description:
      "Some risk factors identified. Address the recommendations below before lodging.",
  },
  high: {
    label: "High Risk",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    description:
      "Significant risk factors detected. Strongly recommended to address these first.",
  },
  critical: {
    label: "Critical Risk",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    description:
      "One or more critical issues detected. High probability of refusal. Seek expert advice.",
  },
};

function computeRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "low";
  if (score >= 50) return "moderate";
  if (score >= 30) return "high";
  return "critical";
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Step nav ─────────────────────────────────────────────────────────────────

const STEPS: { number: Step; label: string; sublabel: string; icon: React.ElementType }[] = [
  { number: 1, label: "Find Pathway", sublabel: "Pick the right visa", icon: Globe },
  { number: 2, label: "Check Readiness", sublabel: "Eligibility & risk", icon: Shield },
  { number: 3, label: "Build Your Plan", sublabel: "Timeline & checklist", icon: ListChecks },
  { number: 4, label: "Track & Submit", sublabel: "Application status", icon: SendHorizonal },
];

function StepNav({
  current,
  maxUnlocked,
  onStepClick,
}: {
  current: Step;
  maxUnlocked: Step;
  onStepClick: (s: Step) => void;
}) {
  return (
    <div className="relative flex items-stretch">
      {/* Connector line — starts/ends at edge of first/last circle, not beneath them */}
      <div className="absolute top-8 left-[calc(12.5%+1.25rem)] right-[calc(12.5%+1.25rem)] h-px bg-white/[0.07] hidden sm:block" />

      {STEPS.map((s) => {
        const done = s.number < current;
        const active = s.number === current;
        const locked = s.number > maxUnlocked;
        const Icon = s.icon;

        return (
          <button
            key={s.number}
            onClick={() => !locked && onStepClick(s.number)}
            disabled={locked}
            className={cn(
              "relative flex-1 flex flex-col items-center gap-2 px-2 py-3 transition-all",
              locked ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
              !locked && !active && "hover:opacity-80"
            )}
          >
            {/* Circle */}
            <div
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all shadow-[0_0_0_4px_black]",
                done
                  ? "bg-emerald-500/20 border-emerald-500/60"
                  : active
                  ? "bg-white border-white"
                  : locked
                  ? "bg-white/[0.04] border-white/[0.10]"
                  : "bg-white/[0.08] border-white/[0.20]"
              )}
            >
              {done ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : locked ? (
                <Lock className="w-4 h-4 text-zinc-600" />
              ) : (
                <Icon
                  className={cn("w-4 h-4", active ? "text-black" : "text-zinc-400")}
                />
              )}
            </div>

            {/* Label */}
            <div className="text-center hidden sm:block">
              <div
                className={cn(
                  "text-xs font-bold leading-tight",
                  active ? "text-white" : done ? "text-emerald-400" : "text-zinc-500"
                )}
              >
                {s.label}
              </div>
              <div className="text-[10px] text-zinc-600 mt-0.5">{s.sublabel}</div>
            </div>

            {/* Mobile label */}
            <div
              className={cn(
                "text-[10px] font-bold sm:hidden",
                active ? "text-white" : done ? "text-emerald-400" : "text-zinc-600"
              )}
            >
              {s.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Step 1: Find Your Pathway ────────────────────────────────────────────────

function Step1FindPathway({
  countryData,
  countryCode,
  currentVisa,
  goal,
  confirmedPathwayId,
  onCurrentVisaChange,
  onGoalChange,
  onConfirm,
}: {
  countryData: CountryData;
  countryCode: string;
  currentVisa: string;
  goal: string;
  confirmedPathwayId: string | null;
  onCurrentVisaChange: (v: string) => void;
  onGoalChange: (v: string) => void;
  onConfirm: (pathwayId: string) => void;
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      const goalMatch =
        goal === "all" || p.forGoals.includes(goal as VisaPathway["forGoals"][number]);
      if (visaMatch && goalMatch) extras.push(p);
    }
    extras.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    return [...ranked, ...extras];
  }, [currentVisa, goal, rankedPathwayIds, countryData]);

  const bestMatchPathway =
    currentVisa &&
    displayedPathways.length > 0 &&
    rankedPathwayIds.includes(displayedPathways[0].id)
      ? displayedPathways[0]
      : null;

  const secondaryPathways = bestMatchPathway
    ? displayedPathways.slice(1)
    : displayedPathways;

  const hasResults = currentVisa && displayedPathways.length > 0;

  return (
    <div className="space-y-10">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Find Your Pathway</h2>
        <p className="text-sm text-zinc-500">
          Tell us where you are now and where you want to go — we&apos;ll rank every
          available pathway instantly.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Current visa */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-black text-[10px] font-black">
              1
            </span>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Your current visa
            </label>
          </div>
          <select
            value={currentVisa}
            onChange={(e) => onCurrentVisaChange(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
          >
            <option value="" className="bg-zinc-900">
              — Select your current status —
            </option>
            {countryData.currentVisaOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900">
                {opt.label} — {opt.sublabel}
              </option>
            ))}
          </select>
        </div>

        {/* Goal */}
        <div className={cn("transition-opacity", !currentVisa && "opacity-40 pointer-events-none")}>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-black">
              2
            </span>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Your goal
            </label>
          </div>
          <select
            value={goal}
            onChange={(e) => onGoalChange(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
          >
            {countryData.goalOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900">
                {opt.label} — {opt.sublabel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count summary */}
      {hasResults && (
        <p className="text-xs text-zinc-500">
          Showing <span className="text-white font-semibold">{displayedPathways.length}</span> of {countryData.pathways.length} pathways relevant to your selection
          {goal !== "all" && (
            <> — filtered by goal</>
          )}
        </p>
      )}

      {/* No visa selected placeholder */}
      {!currentVisa && (
        <div className="py-14 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto mb-5">
            <Globe className="w-7 h-7 text-zinc-600" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Select your current visa to begin
          </h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            We&apos;ll filter {countryData.pathways.length} pathways down to the ones
            relevant to your situation and rank them by best fit.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {[
              { icon: Target, label: "Ranked results" },
              { icon: FileCheck, label: "How to apply" },
              { icon: Shield, label: "Risk profile" },
            ].map((tile) => {
              const TIcon = tile.icon;
              return (
                <div
                  key={tile.label}
                  className="glass rounded-xl border border-white/[0.07] p-3 flex flex-col items-center gap-2"
                >
                  <TIcon className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-600 text-center leading-tight">
                    {tile.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="space-y-8">
          {/* Best match card */}
          {bestMatchPathway && (
            <BestMatchCard
              pathway={bestMatchPathway}
              confirmedPathwayId={confirmedPathwayId}
              onConfirm={() => onConfirm(bestMatchPathway.id)}
            />
          )}

          {/* Secondary pathways */}
          {secondaryPathways.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Also consider
                </span>
                <span className="text-xs text-zinc-700">
                  — {secondaryPathways.length} other option
                  {secondaryPathways.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {secondaryPathways.map((pw) => (
                  <SecondaryCard
                    key={pw.id}
                    pathway={pw}
                    expanded={expandedIds.has(pw.id)}
                    confirmed={confirmedPathwayId === pw.id}
                    onToggle={() => toggleExpanded(pw.id)}
                    onConfirm={() => onConfirm(pw.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Best match card ───────────────────────────────────────────────────────────

function BestMatchCard({
  pathway,
  confirmedPathwayId,
  onConfirm,
}: {
  pathway: VisaPathway;
  confirmedPathwayId: string | null;
  onConfirm: () => void;
}) {
  const difficulty = getDifficultyConfig(pathway.difficulty);
  const steps =
    pathway.applicationSteps ??
    pathway.nextSteps.map((s) => ({
      action: s,
      detail: "",
      link: undefined,
      duration: undefined,
    }));
  const isConfirmed = confirmedPathwayId === pathway.id;

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden relative transition-all",
        isConfirmed
          ? "border-emerald-500/50 bg-emerald-500/[0.05]"
          : "border-white/[0.22] bg-white/[0.05]"
      )}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      {/* Header strip */}
      <div className="px-6 py-3 border-b border-white/[0.08] flex items-center gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
          {isConfirmed ? "✓ Confirmed — your pathway" : "Your best match"}
        </span>
        <span
          className={cn(
            "ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border",
            difficulty.color
          )}
        >
          {difficulty.label}
        </span>
      </div>

      <div className="px-7 pt-7 pb-6">
        {/* Name */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              pathway.iconBg
            )}
          >
            <Globe className={cn("w-6 h-6", pathway.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            {pathway.subclass && (
              <div className="text-xs font-semibold text-zinc-500 mb-0.5">
                Subclass {pathway.subclass}
              </div>
            )}
            <h2 className="text-xl font-bold text-white leading-tight">{pathway.name}</h2>
            <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{pathway.tagline}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: Clock, label: "Processing", value: pathway.processingTime },
            { icon: Calendar, label: "Validity", value: pathway.validity },
            { icon: DollarSign, label: "Govt fee", value: pathway.cost },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-3"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                </div>
                <span className="text-xs font-bold text-white leading-snug block">{stat.value}</span>
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

        {/* How to apply */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">
              →
            </span>
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
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-white hover:text-zinc-300 underline decoration-white/20 transition-colors"
                      >
                        {s.action}{" "}
                        <ExternalLink className="inline w-3 h-3 ml-0.5 opacity-60" />
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
                  {s.detail && (
                    <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{s.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Eligibility pills */}
        {pathway.eligibility.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              You must meet
            </h4>
            <div className="flex flex-wrap gap-2">
              {pathway.eligibility.map((req) => (
                <span
                  key={req.id}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border",
                    req.required
                      ? "text-zinc-300 bg-white/[0.05] border-white/[0.10]"
                      : "text-zinc-400 bg-transparent border-white/[0.05]"
                  )}
                >
                  {req.required ? (
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-3 h-3" />
                  )}
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
              <span
                key={p}
                className="text-xs bg-white/[0.07] text-zinc-300 border border-white/[0.10] px-2.5 py-1 rounded-full font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onConfirm}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 text-sm font-bold px-5 py-3.5 rounded-xl transition-all",
            isConfirmed
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default"
              : "bg-white text-black hover:bg-zinc-100"
          )}
        >
          {isConfirmed ? (
            <>
              <CheckCircle className="w-4 h-4" /> Pathway confirmed — check your readiness →
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Confirm this pathway &amp; continue →
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Secondary card ───────────────────────────────────────────────────────────

function SecondaryCard({
  pathway,
  expanded,
  confirmed,
  onToggle,
  onConfirm,
}: {
  pathway: VisaPathway;
  expanded: boolean;
  confirmed: boolean;
  onToggle: () => void;
  onConfirm: () => void;
}) {
  const difficulty = getDifficultyConfig(pathway.difficulty);
  const steps =
    pathway.applicationSteps ??
    pathway.nextSteps.map((s) => ({
      action: s,
      detail: "",
      link: undefined,
      duration: undefined,
    }));

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden transition-all",
        confirmed
          ? "border-emerald-500/40 bg-emerald-500/[0.05]"
          : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12]"
      )}
    >
      <button onClick={onToggle} className="w-full p-5 text-left">
        {/* Top row: icon + name + chevron */}
        <div className="flex items-start gap-3 mb-2.5">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
              pathway.iconBg
            )}
          >
            <Globe className={cn("w-4 h-4", pathway.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {pathway.subclass && (
                    <span className="text-xs text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded-full">
                      Subclass {pathway.subclass}
                    </span>
                  )}
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", difficulty.color)}>
                    {difficulty.label}
                  </span>
                  {confirmed && (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      ✓ Selected
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white leading-snug">{pathway.name}</div>
              </div>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-1" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-1" />
              )}
            </div>
          </div>
        </div>
        {/* Tagline — full width, wraps freely */}
        <p className="text-xs text-zinc-500 leading-relaxed pl-[52px] mb-2.5">{pathway.tagline}</p>
        {/* Stats row */}
        <div className="flex items-center gap-4 pl-[52px] text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {pathway.processingTime}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 flex-shrink-0" />
            {pathway.cost}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            {pathway.validity}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.07] px-6 py-5 space-y-5">
          {/* How to apply */}
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] border border-white/[0.12] text-zinc-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white">{s.action}</span>
                  {s.detail && (
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{s.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* Pros/cons */}
          <details className="group">
            <summary className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 cursor-pointer select-none list-none flex items-center gap-1.5">
              <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
              See pros &amp; cons
            </summary>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-emerald-500/[0.07] rounded-xl border border-emerald-500/15 p-3">
                <ul className="space-y-1">
                  {pathway.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-emerald-300/80">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/[0.07] rounded-xl border border-red-500/15 p-3">
                <ul className="space-y-1">
                  {pathway.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-red-300/80">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          {/* Confirm CTA */}
          <button
            onClick={onConfirm}
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all",
              confirmed
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default"
                : "bg-white text-black hover:bg-zinc-100"
            )}
          >
            {confirmed ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> Confirmed →
              </>
            ) : (
              <>Choose this pathway &amp; continue →</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Step 2: Check Readiness ───────────────────────────────────────────────────

function Step2CheckReadiness({
  countryData,
  pathway,
  eligibilityChecks,
  riskAnswers,
  onEligibilityCheck,
  onRiskAnswer,
  onContinue,
}: {
  countryData: CountryData;
  pathway: VisaPathway;
  eligibilityChecks: Record<string, boolean>;
  riskAnswers: Record<string, "yes" | "no" | "partial">;
  onEligibilityCheck: (id: string, met: boolean) => void;
  onRiskAnswer: (id: string, ans: "yes" | "no" | "partial") => void;
  onContinue: () => void;
}) {
  const relevantFactors = useMemo(
    () =>
      countryData.riskFactors.filter(
        (f) => !f.pathwayIds?.length || f.pathwayIds.includes(pathway.id)
      ),
    [countryData.riskFactors, pathway.id]
  );

  const answeredCount = relevantFactors.filter((f) => riskAnswers[f.id] !== undefined).length;
  const totalFactors = relevantFactors.length;

  const riskScore = useMemo(() => {
    if (answeredCount === 0) return null;
    let total = 0;
    let weight = 0;
    for (const f of relevantFactors) {
      const ans = riskAnswers[f.id];
      if (!ans) continue;
      // Risk factors are problems — "yes" means you HAVE the risk (bad), "no" means you're clear (good)
      const scoreMap = { yes: 0, partial: 50, no: 100 };
      total += scoreMap[ans] * f.weight;
      weight += f.weight;
    }
    return weight > 0 ? Math.round(total / weight) : null;
  }, [relevantFactors, riskAnswers, answeredCount]);

  const riskLevel = riskScore !== null ? computeRiskLevel(riskScore) : null;
  const rlConfig = riskLevel ? riskLevelConfig[riskLevel] : null;

  const metCount = pathway.eligibility.filter((r) => eligibilityChecks[r.id]).length;
  const requiredCount = pathway.eligibility.filter((r) => r.required).length;
  const blockers = pathway.eligibility.filter((r) => r.required && !eligibilityChecks[r.id]);

  const canContinue = answeredCount >= Math.ceil(totalFactors * 0.5);

  return (
    <div className="space-y-10">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Check Your Readiness</h2>
        <p className="text-sm text-zinc-500">
          Review eligibility requirements and answer a few questions to get your risk
          score before you start gathering documents.
        </p>
      </div>

      {/* Confirmed pathway pill */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.05] border border-white/[0.10] rounded-xl">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", pathway.iconBg)}>
          <Globe className={cn("w-3.5 h-3.5", pathway.iconColor)} />
        </div>
        <div>
          <div className="text-xs text-zinc-500">Checking readiness for</div>
          <div className="text-sm font-bold text-white">{pathway.name}</div>
        </div>
      </div>

      {/* Eligibility self-check */}
      {pathway.eligibility.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-zinc-400" />
              Eligibility self-check
            </h3>
            <span className="text-xs text-zinc-500">
              {metCount} / {pathway.eligibility.length} confirmed
            </span>
          </div>
          <div className="space-y-2">
            {pathway.eligibility.map((req) => {
              const met = !!eligibilityChecks[req.id];
              return (
                <button
                  key={req.id}
                  onClick={() => onEligibilityCheck(req.id, !met)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left",
                    met
                      ? "bg-emerald-500/[0.08] border-emerald-500/25"
                      : req.required
                      ? "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {met ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{req.label}</span>
                      {req.required && !met && (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Blocker warning */}
          {blockers.length > 0 && (
            <div className="mt-3 flex items-start gap-2.5 bg-amber-500/[0.07] border border-amber-500/25 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/90 leading-relaxed">
                <span className="font-semibold">
                  {blockers.length} required {blockers.length === 1 ? "criterion" : "criteria"} not yet confirmed.
                </span>{" "}
                Tick each requirement above once you&apos;ve verified you meet it.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Risk factor Q&A */}
      {relevantFactors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              Risk profile questions
            </h3>
            <span className="text-xs text-zinc-500">
              {answeredCount} / {totalFactors} answered
            </span>
          </div>

          <div className="space-y-3">
            {relevantFactors.map((factor) => {
              const ans = riskAnswers[factor.id] ?? null;
              return (
                <div
                  key={factor.id}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4"
                >
                  <p className="text-sm font-semibold text-white mb-3 leading-snug">
                    {factor.label}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {(["yes", "partial", "no"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => onRiskAnswer(factor.id, opt)}
                        className={cn(
                          "px-4 py-1.5 rounded-lg text-xs font-bold border transition-all",
                          ans === opt
                            ? opt === "yes"
                              ? "bg-red-500/20 border-red-500/50 text-red-300"        // yes = risk present = bad
                              : opt === "partial"
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"  // partial = moderate
                              : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" // no = clear = good
                            : "bg-white/[0.04] border-white/[0.10] text-zinc-400 hover:border-white/25 hover:text-white"
                        )}
                      >
                        {opt === "yes" ? "Yes" : opt === "partial" ? "Partially" : "No"}
                      </button>
                    ))}
                  </div>
                  {ans && (
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                      {ans === "yes" || ans === "partial"
                        ? factor.mitigation   // you have this risk — show how to fix it
                        : factor.description  // you're clear — confirm why this is fine
                      }
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk score result */}
      {riskScore !== null && rlConfig && (
        <div
          className={cn(
            "rounded-2xl border p-5 flex items-start gap-4",
            rlConfig.bg,
            rlConfig.border
          )}
        >
          {/* Score circle */}
          <div className="flex-shrink-0 w-16 h-16 rounded-full border-4 border-current flex items-center justify-center">
            <span className={cn("text-xl font-black", rlConfig.color)}>{riskScore}</span>
          </div>
          <div>
            <div className={cn("text-base font-bold mb-1", rlConfig.color)}>
              {rlConfig.label}
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{rlConfig.description}</p>
            {answeredCount < totalFactors && (
              <p className="text-xs text-zinc-600 mt-2">
                Answer all {totalFactors} questions for an accurate score (
                {totalFactors - answeredCount} remaining)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Continue CTA */}
      <div className="pt-2">
        {!canContinue && (
          <p className="text-xs text-zinc-500 mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Answer at least half the risk questions to continue.
          </p>
        )}
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 text-sm font-bold px-5 py-3.5 rounded-xl transition-all",
            canContinue
              ? "bg-white text-black hover:bg-zinc-100"
              : "bg-white/10 text-zinc-600 cursor-not-allowed"
          )}
        >
          Continue to Plan →
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Build Your Plan ───────────────────────────────────────────────────

const priorityConfig = {
  critical: { label: "Critical", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  high: { label: "High", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  medium: { label: "Medium", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  low: { label: "Low", color: "text-zinc-400 bg-white/[0.05] border-white/[0.10]" },
};

function Step3BuildPlan({
  countryData,
  pathway,
  checklistCompleted,
  lodgementDate,
  onToggleItem,
  onLodgementDateChange,
  onContinue,
}: {
  countryData: CountryData;
  pathway: VisaPathway;
  checklistCompleted: Record<string, boolean>;
  lodgementDate: string;
  onToggleItem: (id: string) => void;
  onLodgementDateChange: (date: string) => void;
  onContinue: () => void;
}) {
  const relevantItems = useMemo(
    () =>
      countryData.checklist
        .filter((item) => !item.pathwayIds?.length || item.pathwayIds.includes(pathway.id))
        .sort((a, b) => {
          const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          if (pOrder[a.priority] !== pOrder[b.priority])
            return pOrder[a.priority] - pOrder[b.priority];
          return a.dueWeeks - b.dueWeeks;
        }),
    [countryData.checklist, pathway.id]
  );

  // Group into phases: before lodgement (critical+high), docs/forms, final
  const phases = useMemo(() => {
    const critical = relevantItems.filter((i) => i.priority === "critical");
    const high = relevantItems.filter((i) => i.priority === "high");
    const rest = relevantItems.filter((i) => i.priority !== "critical" && i.priority !== "high");
    return [
      { label: "Phase 1 — Critical requirements", items: critical },
      { label: "Phase 2 — Important tasks", items: high },
      { label: "Phase 3 — Supporting documents & forms", items: rest },
    ].filter((p) => p.items.length > 0);
  }, [relevantItems]);

  const completedCount = relevantItems.filter((i) => checklistCompleted[i.id]).length;
  const totalCount = relevantItems.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalCost = useMemo(() => {
    const pathwayCost = pathway.costNumeric ?? 0;
    const checklistCost = relevantItems.reduce(
      (sum, item) => sum + (item.estimatedCostNumeric ?? 0),
      0
    );
    return pathwayCost + checklistCost;
  }, [pathway, relevantItems]);

  const targetDate = lodgementDate ? new Date(lodgementDate) : null;
  const today = new Date();

  const canContinue = completedCount >= Math.ceil(totalCount * 0.3) || completedCount >= 3;

  return (
    <div className="space-y-10">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Build Your Plan</h2>
        <p className="text-sm text-zinc-500">
          Work through your personalised checklist and set your target lodgement date.
        </p>
      </div>

      {/* Confirmed pathway + progress */}
      <div className="glass rounded-2xl border border-white/[0.10] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", pathway.iconBg)}>
              <Globe className={cn("w-4 h-4", pathway.iconColor)} />
            </div>
            <div>
              <div className="text-xs text-zinc-500">Planning for</div>
              <div className="text-sm font-bold text-white">{pathway.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-white">{progressPct}%</div>
            <div className="text-xs text-zinc-500">
              {completedCount}/{totalCount} done
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Lodgement date */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <label className="text-sm font-bold text-white">Target lodgement date</label>
          <span className="text-xs text-zinc-600">(optional)</span>
        </div>
        <input
          type="date"
          value={lodgementDate}
          onChange={(e) => onLodgementDateChange(e.target.value)}
          className="bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 w-full sm:w-auto min-w-[200px]"
        />
        {targetDate && !isNaN(targetDate.getTime()) && (
          <p className="text-xs text-zinc-500 mt-2">
            That&apos;s{" "}
            <span className="text-white font-semibold">
              {Math.ceil((targetDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000))}{" "}
              weeks
            </span>{" "}
            from today — {formatDate(targetDate)}
          </p>
        )}
      </div>

      {/* Checklist phases */}
      <div className="space-y-6">
        {phases.map((phase, pi) => (
          <div key={pi}>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="inline-flex w-5 h-5 rounded-full bg-white/10 items-center justify-center text-[10px] font-black text-white">
                {pi + 1}
              </span>
              {phase.label}
              <span className="font-normal text-zinc-600 normal-case tracking-normal">
                — {phase.items.filter((i) => checklistCompleted[i.id]).length}/{phase.items.length}{" "}
                done
              </span>
            </h3>
            <div className="space-y-2">
              {phase.items.map((item) => {
                const done = !!checklistCompleted[item.id];
                const pConf = priorityConfig[item.priority];
                return (
                  <button
                    key={item.id}
                    onClick={() => onToggleItem(item.id)}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left",
                      done
                        ? "bg-emerald-500/[0.07] border-emerald-500/20"
                        : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]"
                    )}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {done ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            done ? "text-zinc-500 line-through" : "text-white"
                          )}
                        >
                          {item.title}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide",
                            pConf.color
                          )}
                        >
                          {pConf.label}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-0.5 leading-relaxed",
                          done ? "text-zinc-600" : "text-zinc-500"
                        )}
                      >
                        {item.description}
                      </p>
                      {(item.estimatedCost || item.dueWeeks !== 0) && (
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          {item.estimatedCost && (
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {item.estimatedCost}
                            </span>
                          )}
                          {item.dueWeeks !== 0 && targetDate && !isNaN(targetDate.getTime()) && (
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due:{" "}
                              {formatDate(addWeeks(targetDate, item.dueWeeks))}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cost summary */}
      {totalCost > 0 && (
        <div className="glass rounded-2xl border border-white/[0.10] p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-zinc-400" />
            Estimated total cost
          </h3>
          <div className="space-y-2.5">
            {pathway.costNumeric && pathway.costNumeric > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Government application fee</span>
                <span className="font-semibold text-white">
                  {countryData.currency} {pathway.costNumeric.toLocaleString()}
                </span>
              </div>
            )}
            {relevantItems
              .filter((i) => i.estimatedCostNumeric && i.estimatedCostNumeric > 0)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{item.title}</span>
                  <span className="font-semibold text-zinc-300">
                    {countryData.currency} {item.estimatedCostNumeric!.toLocaleString()}
                  </span>
                </div>
              ))}
            <div className="border-t border-white/[0.08] pt-2.5 flex items-center justify-between">
              <span className="text-sm font-bold text-white">Total estimate</span>
              <span className="text-base font-black text-white">
                {countryData.currency} {totalCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Continue CTA */}
      <div className="pt-2">
        {!canContinue && (
          <p className="text-xs text-zinc-500 mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Complete a few checklist items to continue.
          </p>
        )}
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 text-sm font-bold px-5 py-3.5 rounded-xl transition-all",
            canContinue
              ? "bg-white text-black hover:bg-zinc-100"
              : "bg-white/10 text-zinc-600 cursor-not-allowed"
          )}
        >
          I&apos;m ready — move to tracking →
        </button>
      </div>
    </div>
  );
}

// ── Step 4: Track & Submit ─────────────────────────────────────────────────────

const outcomeConfig: Record<
  ApplicationOutcome,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType; desc: string }
> = {
  preparing: {
    label: "Preparing",
    color: "text-zinc-300",
    bg: "bg-white/[0.06]",
    border: "border-white/[0.12]",
    icon: ClipboardList,
    desc: "Gathering documents and completing forms.",
  },
  applied: {
    label: "Application lodged",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    icon: SendHorizonal,
    desc: "Your application is submitted and under assessment.",
  },
  rfi: {
    label: "Further info requested",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    icon: AlertTriangle,
    desc: "The case officer has requested additional information.",
  },
  approved: {
    label: "Approved",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    icon: CheckCircle,
    desc: "Congratulations — your visa has been granted!",
  },
  refused: {
    label: "Refused",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    icon: XCircle,
    desc: "Your application was refused. Use the recovery plan below.",
  },
};

function Step4TrackSubmit({
  countryData,
  pathway,
  outcome,
  refusalReasons,
  onOutcomeChange,
  onRefusalReasonToggle,
}: {
  countryData: CountryData;
  pathway: VisaPathway;
  outcome: ApplicationOutcome | null;
  refusalReasons: string[];
  onOutcomeChange: (o: ApplicationOutcome) => void;
  onRefusalReasonToggle: (id: string) => void;
}) {
  const [expandedReason, setExpandedReason] = useState<string | null>(null);

  const relevantRefusalReasons = useMemo(
    () =>
      countryData.refusalReasons.filter(
        (r) => r.pathwaysAffected.includes(pathway.id) || r.pathwaysAffected.length === 0
      ),
    [countryData.refusalReasons, pathway.id]
  );

  const selectedReasonData = refusalReasons
    .map((id) => relevantRefusalReasons.find((r) => r.id === id))
    .filter(Boolean) as RefusalReason[];

  const frequencyConfig = {
    "very-common": { label: "Very common", color: "text-red-400 bg-red-500/10 border-red-500/20" },
    common: { label: "Common", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    occasional: { label: "Occasional", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  };

  const oc = outcome ? outcomeConfig[outcome] : null;

  return (
    <div className="space-y-10">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Track Your Application</h2>
        <p className="text-sm text-zinc-500">
          Update your application status as things progress. If refused, the recovery
          plan below will guide your reapplication.
        </p>
      </div>

      {/* Confirmed pathway */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.05] border border-white/[0.10] rounded-xl">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", pathway.iconBg)}>
          <Globe className={cn("w-3.5 h-3.5", pathway.iconColor)} />
        </div>
        <div>
          <div className="text-xs text-zinc-500">Tracking</div>
          <div className="text-sm font-bold text-white">{pathway.name}</div>
        </div>
      </div>

      {/* Outcome tracker */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-zinc-400" />
          Application status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(outcomeConfig) as ApplicationOutcome[]).map((o) => {
            const conf = outcomeConfig[o];
            const OIcon = conf.icon;
            const selected = outcome === o;
            return (
              <button
                key={o}
                onClick={() => onOutcomeChange(o)}
                className={cn(
                  "flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-all",
                  selected
                    ? cn(conf.bg, conf.border, "ring-1 ring-white/20")
                    : "bg-white/[0.03] border-white/[0.08] hover:border-white/20"
                )}
              >
                <OIcon
                  className={cn("w-4 h-4", selected ? conf.color : "text-zinc-600")}
                />
                <div>
                  <div
                    className={cn(
                      "text-xs font-bold",
                      selected ? conf.color : "text-zinc-400"
                    )}
                  >
                    {conf.label}
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">
                    {conf.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status-specific content */}
      {outcome === "approved" && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-emerald-400">Congratulations! 🎉</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Your {pathway.name} has been granted. Keep your grant letter safe, note your
            visa conditions, and check your pathway options towards permanent residency.
          </p>
          {pathway.pathwayTo.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-zinc-500 mb-2">Your next pathways:</p>
              <div className="flex flex-wrap gap-2">
                {pathway.pathwayTo.map((p) => (
                  <span
                    key={p}
                    className="text-xs bg-white/[0.07] text-zinc-300 border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {outcome === "rfi" && (
        <div className="bg-orange-500/10 border border-orange-500/25 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-orange-400">
              Further information requested
            </h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-3">
            Respond promptly and completely. Late or incomplete responses are one of the
            most common causes of preventable refusals.
          </p>
          <ul className="space-y-1.5">
            {[
              "Read the RFI letter carefully — respond to every point",
              "Gather all requested documents in one submission",
              "Submit before the deadline (no extensions granted)",
              "Consider engaging a migration agent if you are unsure",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                <span className="text-xs text-zinc-400 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Refusal recovery */}
      {outcome === "refused" && (
        <div className="space-y-5">
          <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-red-400">Refusal Recovery Plan</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Select the reason(s) your application was refused — we&apos;ll build you a
              targeted recovery plan.
            </p>
          </div>

          {/* Reason selector */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">
              What was the reason for refusal?
            </h3>
            <div className="space-y-2">
              {relevantRefusalReasons.map((reason) => {
                const selected = refusalReasons.includes(reason.id);
                const expanded = expandedReason === reason.id;
                const fConf = frequencyConfig[reason.frequency];

                return (
                  <div
                    key={reason.id}
                    className={cn(
                      "rounded-xl border transition-all overflow-hidden",
                      selected
                        ? "bg-red-500/[0.08] border-red-500/30"
                        : "bg-white/[0.03] border-white/[0.08]"
                    )}
                  >
                    <button
                      onClick={() => onRefusalReasonToggle(reason.id)}
                      className="w-full flex items-center gap-3 p-4 text-left"
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                          selected
                            ? "bg-red-500/30 border-red-500/60"
                            : "bg-white/[0.05] border-white/[0.15]"
                        )}
                      >
                        {selected && <CheckCircle className="w-3 h-3 text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{reason.title}</span>
                          {reason.code && (
                            <span className="text-xs text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded">
                              {reason.code}
                            </span>
                          )}
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full border", fConf.color)}>
                            {fConf.label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedReason(expanded ? null : reason.id);
                        }}
                        className="ml-2 flex-shrink-0"
                      >
                        {expanded ? (
                          <ChevronUp className="w-4 h-4 text-zinc-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-500" />
                        )}
                      </button>
                    </button>

                    {expanded && (
                      <div className="border-t border-white/[0.07] px-5 py-4 space-y-3">
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {reason.description}
                        </p>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-300 mb-2">
                            How to fix this:
                          </h4>
                          <ul className="space-y-1.5">
                            {reason.solutions.map((sol, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                <span className="text-xs text-zinc-400 leading-relaxed">{sol}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recovery summary */}
          {selectedReasonData.length > 0 && (
            <div className="glass rounded-2xl border border-white/[0.10] p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-zinc-400" />
                Your recovery action plan
              </h3>
              <div className="space-y-4">
                {selectedReasonData.map((reason, ri) => (
                  <div key={reason.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                        {ri + 1}
                      </span>
                      <span className="text-xs font-bold text-zinc-300">{reason.title}</span>
                    </div>
                    <ul className="space-y-1.5 pl-7">
                      {reason.solutions.map((sol, si) => (
                        <li key={si} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          <span className="text-xs text-zinc-400 leading-relaxed">{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.08]">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  <span className="font-semibold text-zinc-300">Next step:</span> Address
                  every point above, then reapply with a comprehensive response addressing
                  the original reasons for refusal.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Guide component ──────────────────────────────────────────────────────

export function VisaGuide({ countryData, countryCode }: Props) {
  const [state, setState] = useState<GuideState>({
    step: 1,
    maxUnlocked: 1,
    ...defaultState,
  });
  const [hydrated, setHydrated] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${countryCode}`;

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GuideState>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage
  const persist = useCallback(
    (partial: Partial<GuideState>) => {
      setState((prev) => {
        const next = { ...prev, ...partial };
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [storageKey]
  );

  function goToStep(s: Step) {
    if (s <= state.maxUnlocked) persist({ step: s });
  }

  function advanceStep(from: Step) {
    const next = (from + 1) as Step;
    persist({
      step: next,
      maxUnlocked: Math.max(state.maxUnlocked, next) as Step,
    });
    // Scroll to top of guide
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Derive confirmed pathway object
  const confirmedPathway = state.confirmedPathwayId
    ? countryData.pathways.find((p) => p.id === state.confirmedPathwayId) ?? null
    : null;

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="hero-gradient">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/${countryCode}`}
              className="hover:text-white transition-colors capitalize"
            >
              {countryData.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Visa Guide</span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-zinc-500 mb-4 uppercase tracking-widest">
              {countryData.name} · Complete Visa Guide
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Your step-by-step{" "}
              <span className="gradient-text">visa journey</span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
              From finding your best pathway through to lodgement and approval — everything
              in one guided flow. Your progress is saved automatically.
            </p>
          </div>

          {/* Step navigation */}
          <div className="glass rounded-2xl border border-white/[0.10] overflow-hidden">
            <StepNav
              current={state.step}
              maxUnlocked={state.maxUnlocked}
              onStepClick={goToStep}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">
          {/* Main content */}
          <div>
            {state.step === 1 && (
              <Step1FindPathway
                countryData={countryData}
                countryCode={countryCode}
                currentVisa={state.currentVisa}
                goal={state.goal}
                confirmedPathwayId={state.confirmedPathwayId}
                onCurrentVisaChange={(v) => persist({ currentVisa: v })}
                onGoalChange={(v) => persist({ goal: v })}
                onConfirm={(pathwayId) => {
                  persist({
                    confirmedPathwayId: pathwayId,
                    step: 2,
                    maxUnlocked: Math.max(state.maxUnlocked, 2) as Step,
                  });
                  setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    50
                  );
                }}
              />
            )}

            {state.step === 2 && confirmedPathway && (
              <Step2CheckReadiness
                countryData={countryData}
                pathway={confirmedPathway}
                eligibilityChecks={state.eligibilityChecks}
                riskAnswers={state.riskAnswers}
                onEligibilityCheck={(id, met) =>
                  persist({
                    eligibilityChecks: { ...state.eligibilityChecks, [id]: met },
                  })
                }
                onRiskAnswer={(id, ans) =>
                  persist({ riskAnswers: { ...state.riskAnswers, [id]: ans } })
                }
                onContinue={() => advanceStep(2)}
              />
            )}

            {state.step === 3 && confirmedPathway && (
              <Step3BuildPlan
                countryData={countryData}
                pathway={confirmedPathway}
                checklistCompleted={state.checklistCompleted}
                lodgementDate={state.lodgementDate}
                onToggleItem={(id) =>
                  persist({
                    checklistCompleted: {
                      ...state.checklistCompleted,
                      [id]: !state.checklistCompleted[id],
                    },
                  })
                }
                onLodgementDateChange={(date) => persist({ lodgementDate: date })}
                onContinue={() => advanceStep(3)}
              />
            )}

            {state.step === 4 && confirmedPathway && (
              <Step4TrackSubmit
                countryData={countryData}
                pathway={confirmedPathway}
                outcome={state.outcome}
                refusalReasons={state.refusalReasons}
                onOutcomeChange={(o) => persist({ outcome: o })}
                onRefusalReasonToggle={(id) => {
                  const cur = new Set(state.refusalReasons);
                  if (cur.has(id)) cur.delete(id);
                  else cur.add(id);
                  persist({ refusalReasons: Array.from(cur) });
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Progress overview */}
            <div className="glass rounded-2xl border border-white/[0.10] p-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
                Your progress
              </h3>
              <div className="space-y-2.5">
                {STEPS.map((s) => {
                  const done = s.number < state.step;
                  const active = s.number === state.step;
                  const locked = s.number > state.maxUnlocked;
                  const SIcon = s.icon;
                  return (
                    <button
                      key={s.number}
                      onClick={() => goToStep(s.number)}
                      disabled={locked}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                        active
                          ? "bg-white/[0.08] border border-white/[0.15]"
                          : done
                          ? "hover:bg-white/[0.05] cursor-pointer"
                          : locked
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-white/[0.05] cursor-pointer"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0",
                          done
                            ? "bg-emerald-500/20 border-emerald-500/50"
                            : active
                            ? "bg-white border-white"
                            : "bg-white/[0.05] border-white/[0.15]"
                        )}
                      >
                        {done ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <SIcon
                            className={cn(
                              "w-3 h-3",
                              active ? "text-black" : locked ? "text-zinc-700" : "text-zinc-500"
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-xs font-semibold",
                            active
                              ? "text-white"
                              : done
                              ? "text-emerald-400"
                              : "text-zinc-500"
                          )}
                        >
                          {s.label}
                        </div>
                        <div className="text-[10px] text-zinc-600">{s.sublabel}</div>
                      </div>
                      {active && (
                        <ArrowRight className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirmed pathway summary */}
            {confirmedPathway && (
              <div className="glass rounded-2xl border border-white/[0.10] p-5">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Confirmed pathway
                </h3>
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      confirmedPathway.iconBg
                    )}
                  >
                    <Globe className={cn("w-4 h-4", confirmedPathway.iconColor)} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{confirmedPathway.name}</div>
                    {confirmedPathway.subclass && (
                      <div className="text-xs text-zinc-500">
                        Subclass {confirmedPathway.subclass}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {confirmedPathway.processingTime}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <DollarSign className="w-3 h-3" />
                    {confirmedPathway.cost}
                  </div>
                </div>
                <button
                  onClick={() => goToStep(1)}
                  className="mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors underline"
                >
                  Change pathway
                </button>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-500/[0.05] border border-amber-500/15 rounded-xl">
              <Info className="w-3.5 h-3.5 text-amber-500/70 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                For guidance only. Always verify with{" "}
                <a
                  href={countryData.visaBodyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 underline hover:text-white transition-colors"
                >
                  {countryData.visaBodyName}
                </a>{" "}
                before lodging.
              </p>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Reset your guide? This will clear all progress for this country."
                  )
                ) {
                  try {
                    localStorage.removeItem(storageKey);
                  } catch {}
                  setState({ step: 1, maxUnlocked: 1, ...defaultState });
                }
              }}
              className="w-full text-xs text-zinc-700 hover:text-zinc-500 transition-colors py-2"
            >
              Reset guide ↺
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
