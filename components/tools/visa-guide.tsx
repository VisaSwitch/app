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
import { ReportModal } from "@/components/tools/report-modal";
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
  refusalLetter: string;
  appReferenceNumber: string;
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
  refusalLetter: "",
  appReferenceNumber: "",
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

/** Format a raw pathway ID into a human-readable pill label */
function formatPathwayId(id: string): string {
  // "subclass-189" → "Subclass 189"
  if (id.startsWith("subclass-")) return "Subclass " + id.slice(9);
  // "citizenship" → "Citizenship", etc.
  return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");
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
  step4Complete,
  onStepClick,
}: {
  current: Step;
  maxUnlocked: Step;
  step4Complete: boolean;
  onStepClick: (s: Step) => void;
}) {
  return (
    <div className="relative flex items-stretch">
      {/* Connector segments — one between each adjacent pair of circles, never overlapping */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute top-8 h-px hidden sm:block"
          style={{
            background: "var(--connector-line)",
            left: `calc(${(i + 0.5) * 25}% + 1.25rem)`,
            width: `calc(25% - 2.5rem)`,
          }}
        />
      ))}

      {STEPS.map((s) => {
        const done = s.number < current || (s.number === 4 && step4Complete);
        const active = s.number === current && !(s.number === 4 && step4Complete);
        const locked = s.number > maxUnlocked;
        const Icon = s.icon;

        return (
          <button
            key={s.number}
            onClick={() => !locked && onStepClick(s.number)}
            disabled={locked}
            className={cn(
              "relative flex-1 flex flex-col items-center gap-2 px-1 py-3 sm:px-2 transition-all",
              locked ? "cursor-not-allowed" : "cursor-pointer",
              !locked && !active && "hover:opacity-80"
            )}
          >
            {/* Circle */}
            <div
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all",
                done
                  ? "bg-emerald-500/20 border-emerald-500/60"
                  : active
                  ? "dark:bg-white dark:border-white bg-gray-900 border-gray-900"
                  : locked
                  ? "bg-white/[0.05] border-white/[0.18]"
                  : "bg-white/[0.08] border-white/[0.20]"
              )}
            >
              {done ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : locked ? (
                <Lock className="w-4 h-4 text-zinc-500" />
              ) : (
                <Icon
                  className={cn("w-4 h-4", active ? "dark:text-black text-white" : "text-zinc-500")}
                />
              )}
            </div>

            {/* Label */}
            <div className="text-center hidden sm:block">
              <div
                className={cn(
                  "text-xs font-bold leading-tight",
                  active ? "text-white" : done ? "text-emerald-400" : locked ? "text-zinc-500" : "text-zinc-400"
                )}
              >
                {s.label}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{s.sublabel}</div>
            </div>

            {/* Mobile label */}
            <div className="text-center sm:hidden">
              <div
                className={cn(
                  "text-[10px] font-bold leading-tight",
                  active ? "text-white" : done ? "text-emerald-400" : locked ? "text-zinc-500" : "text-zinc-400"
                )}
              >
                {s.label}
              </div>
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

  const secondaryPathways = (bestMatchPathway
    ? displayedPathways.slice(1)
    : displayedPathways
  ).slice().sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

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
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full dark:bg-white dark:text-black bg-gray-900 text-white text-[10px] font-black">
              1
            </span>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Your current visa
            </label>
          </div>
          <select
            value={currentVisa}
            onChange={(e) => onCurrentVisaChange(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
            style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
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
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[10px] font-black" style={{ color: "var(--muted-foreground)" }}>
              2
            </span>
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Your goal
            </label>
          </div>
          <select
            value={goal}
            onChange={(e) => onGoalChange(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
            style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
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
              onPathwayPillClick={(id) => {
                const el = document.getElementById(`pathway-${id}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  toggleExpanded(id);
                }
              }}
            />
          )}

          {/* Secondary pathways */}
          {secondaryPathways.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Also consider
                </span>
                <span className="text-xs text-zinc-500">
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
  onPathwayPillClick,
}: {
  pathway: VisaPathway;
  confirmedPathwayId: string | null;
  onConfirm: () => void;
  onPathwayPillClick: (id: string) => void;
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
            <span className="w-4 h-4 rounded-full dark:bg-white dark:text-black bg-gray-900 text-white text-[10px] font-black flex items-center justify-center">
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
          <summary className="text-xs font-semibold cursor-pointer select-none list-none flex items-center gap-1.5 mb-3">
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-open:rotate-180 transition-transform" />
            <span className="text-emerald-400">Pros</span>
            <span className="text-zinc-600">&amp;</span>
            <span className="text-red-400">Cons</span>
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
              <button
                key={p}
                onClick={() => onPathwayPillClick(p)}
                className="text-xs bg-white/[0.07] text-zinc-300 border border-white/[0.10] px-2.5 py-1 rounded-full font-medium hover:bg-white/[0.14] hover:border-white/[0.25] hover:text-white transition-all"
              >
                {formatPathwayId(p)} ↓
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onConfirm}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 font-bold px-5 py-3.5 rounded-xl transition-all whitespace-nowrap",
            "text-xs sm:text-sm",
            isConfirmed
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default"
              : "dark:bg-white dark:text-black dark:hover:bg-zinc-100 bg-gray-900 text-white hover:bg-gray-700"
          )}
        >
          {isConfirmed ? (
            <>
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="sm:hidden">Confirmed — check readiness →</span>
              <span className="hidden sm:inline">Pathway confirmed — check your readiness →</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="sm:hidden">Confirm pathway &amp; continue →</span>
              <span className="hidden sm:inline">Confirm this pathway &amp; continue →</span>
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
      id={`pathway-${pathway.id}`}
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
            <summary className="text-xs font-semibold cursor-pointer select-none list-none flex items-center gap-1.5">
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-open:rotate-180 transition-transform" />
              <span className="text-emerald-400">Pros</span>
              <span className="text-zinc-600">&amp;</span>
              <span className="text-red-400">Cons</span>
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
                : "dark:bg-white dark:text-black dark:hover:bg-zinc-100 bg-gray-900 text-white hover:bg-gray-700"
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
  onSelectAllEligibility,
  onSelectAllRisk,
  onContinue,
}: {
  countryData: CountryData;
  pathway: VisaPathway;
  eligibilityChecks: Record<string, boolean>;
  riskAnswers: Record<string, "yes" | "no" | "partial">;
  onEligibilityCheck: (id: string, met: boolean) => void;
  onRiskAnswer: (id: string, ans: "yes" | "no" | "partial") => void;
  onSelectAllEligibility: (met: boolean) => void;
  onSelectAllRisk: (ans: "yes" | "no" | "partial") => void;
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">
                {metCount} / {pathway.eligibility.length} confirmed
              </span>
              <button
                onClick={() => onSelectAllEligibility(metCount < pathway.eligibility.length)}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                {metCount === pathway.eligibility.length ? "Clear all" : "Select all"}
              </button>
            </div>
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">
                {answeredCount} / {totalFactors} answered
              </span>
              <button
                onClick={() => onSelectAllRisk("no")}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Mark all as No
              </button>
            </div>
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
              ? "dark:bg-white dark:text-black dark:hover:bg-zinc-100 bg-gray-900 text-white hover:bg-gray-700"
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
  onSelectAllPhase,
  onLodgementDateChange,
  onContinue,
}: {
  countryData: CountryData;
  pathway: VisaPathway;
  checklistCompleted: Record<string, boolean>;
  lodgementDate: string;
  onToggleItem: (id: string) => void;
  onSelectAllPhase: (ids: string[], done: boolean) => void;
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
        {phases.map((phase, pi) => {
          const phaseIds = phase.items.map((i) => i.id);
          const phaseDoneCount = phase.items.filter((i) => checklistCompleted[i.id]).length;
          const allPhaseDone = phaseDoneCount === phase.items.length;
          return (
          <div key={pi}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <span className="inline-flex w-5 h-5 rounded-full bg-white/10 items-center justify-center text-[10px] font-black text-white">
                  {pi + 1}
                </span>
                {phase.label}
                <span className="font-normal text-zinc-600 normal-case tracking-normal">
                  — {phaseDoneCount}/{phase.items.length} done
                </span>
              </h3>
              <button
                onClick={() => onSelectAllPhase(phaseIds, !allPhaseDone)}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex-shrink-0"
              >
                {allPhaseDone ? "Clear all" : "Select all"}
              </button>
            </div>
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
                      {(item.estimatedCost || item.dueWeeks !== 0 || item.link) && (
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
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {item.linkLabel ?? "Open →"}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          );
        })}
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
              ? "dark:bg-white dark:text-black dark:hover:bg-zinc-100 bg-gray-900 text-white hover:bg-gray-700"
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
  refusalLetter,
  appReferenceNumber,
  lodgementDate,
  onOutcomeChange,
  onRefusalReasonToggle,
  onRefusalLetterChange,
  onAppReferenceChange,
  onStartPathway,
  onDownloadReport,
}: {
  countryData: CountryData;
  pathway: VisaPathway;
  outcome: ApplicationOutcome | null;
  refusalReasons: string[];
  refusalLetter: string;
  appReferenceNumber: string;
  lodgementDate: string;
  onOutcomeChange: (o: ApplicationOutcome) => void;
  onRefusalReasonToggle: (id: string) => void;
  onRefusalLetterChange: (text: string) => void;
  onAppReferenceChange: (val: string) => void;
  onStartPathway: (pathwayId: string) => void;
  onDownloadReport: () => void;
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

      {/* Application details card */}
      <div className="glass rounded-2xl border border-white/[0.10] p-5 space-y-4">
        {/* Pathway row */}
        <div className="flex items-center gap-2.5">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", pathway.iconBg)}>
            <Globe className={cn("w-4 h-4", pathway.iconColor)} />
          </div>
          <div>
            <div className="text-xs text-zinc-500">Tracking</div>
            <div className="text-sm font-bold text-white">{pathway.name}</div>
          </div>
        </div>

        <div className="border-t border-white/[0.07]" />

        {/* Reference number + expected decision */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Application reference number</label>
            <input
              type="text"
              value={appReferenceNumber}
              onChange={(e) => onAppReferenceChange(e.target.value)}
              placeholder="e.g. 3AC7F2910"
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-white/[0.25] transition-colors"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-500 mb-1.5">Processing time</div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-sm text-zinc-400">{pathway.processingTime}</span>
            </div>
            {lodgementDate && (
              <div className="text-xs text-zinc-600 mt-1">
                Lodged: {new Date(lodgementDate).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            )}
          </div>
        </div>

        {/* Official portal CTA */}
        <a
          href={countryData.visaBodyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.20] transition-all group"
        >
          <div>
            <div className="text-sm font-semibold text-white">Check status on {countryData.visaBodyName}</div>
            <div className="text-xs text-zinc-600 mt-0.5">{countryData.visaBodyUrl}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </a>
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
                  className={cn("w-4 h-4", selected ? conf.color : cn(conf.color, "opacity-30"))}
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
                  <button
                    key={p}
                    onClick={() => onStartPathway(p)}
                    className="text-xs bg-white/[0.07] text-zinc-300 border border-white/10 px-2.5 py-1 rounded-full hover:bg-white/[0.14] hover:border-white/[0.25] hover:text-white transition-all"
                  >
                    {formatPathwayId(p)} →
                  </button>
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
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-bold text-red-400">Refusal Recovery Plan</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              A refusal isn&apos;t the end. Most are recoverable — but only if you address
              the exact reasons. Follow the steps below.
            </p>
            {/* What to do next - 3 steps */}
            <div className="space-y-2">
              {[
                { n: "1", text: "Select the reason(s) for refusal below", color: "bg-red-500/20 text-red-300" },
                { n: "2", text: "Paste your refusal letter for a more targeted plan", color: "bg-orange-500/20 text-orange-300" },
                { n: "3", text: "Download your recovery report and address every point before reapplying", color: "bg-amber-500/20 text-amber-300" },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0", s.color)}>{s.n}</span>
                  <span className="text-xs text-zinc-400">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Paste refusal letter */}
          <div className="glass rounded-2xl border border-white/[0.10] p-5">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-zinc-400" />
              Paste your refusal letter
              <span className="text-xs font-normal text-zinc-600 ml-1">optional</span>
            </h3>
            <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
              Paste the text from your refusal letter — we&apos;ll highlight the relevant sections when building your recovery plan.
            </p>
            <textarea
              value={refusalLetter}
              onChange={(e) => onRefusalLetterChange(e.target.value)}
              placeholder="Paste the text of your refusal decision here…"
              rows={5}
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none focus:border-white/[0.25] transition-colors leading-relaxed"
            />
            {refusalLetter.trim().length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400">
                  Letter saved — {refusalLetter.trim().split(/\s+/).length} words
                </span>
              </div>
            )}
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

          {/* Migration agent nudge */}
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.05]">
            <Info className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              <span className="font-semibold text-amber-300/80">Complex refusal?</span>{" "}
              Consider engaging a registered migration agent — especially for character,
              health, or second refusals. A professional review often makes the difference.
            </p>
          </div>
        </div>
      )}

      {/* Generate report — shown once any outcome is selected */}
      {outcome !== null && (
        <div className="glass rounded-2xl border border-white/[0.10] p-5">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-bold text-white">Download your guide report</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
            Export a full PDF of your visa journey — pathway, eligibility results, checklist, risk score, and current status.
          </p>
          <button
            onClick={onDownloadReport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all dark:bg-white dark:text-black dark:hover:bg-zinc-100 bg-gray-900 text-white hover:bg-gray-700"
          >
            <FileCheck className="w-4 h-4" />
            Download full report
          </button>
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

  // Report modal state
  const [showReport, setShowReport] = useState(false);

  // Derived values for report
  const filteredChecklist = confirmedPathway
    ? countryData.checklist.filter(
        (item) => !item.pathwayIds?.length || item.pathwayIds.includes(confirmedPathway.id)
      )
    : [];
  const completedSet = new Set(
    Object.keys(state.checklistCompleted).filter((k) => state.checklistCompleted[k])
  );
  const checklistCostTotal = filteredChecklist.reduce(
    (sum, item) => sum + (item.estimatedCostNumeric ?? 0), 0
  );
  const reportTotalEstimate = (confirmedPathway?.costNumeric ?? 0) + checklistCostTotal;
  const reportApplicationFee = confirmedPathway?.cost ?? null;

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "var(--border)", borderTopColor: "var(--foreground)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Hero */}
      <div className="hero-gradient">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/${countryCode}`}
              className="hover:opacity-80 transition-opacity capitalize"
            >
              {countryData.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span style={{ color: "var(--foreground)" }}>Guide</span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold text-zinc-500 mb-4 uppercase tracking-widest" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
              {countryData.name} · Complete Visa Guide
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 tracking-tight" style={{ color: "var(--foreground)" }}>
              Your step-by-step{" "}
              <span className="gradient-text">visa journey</span>
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
              From finding your best pathway through to lodgement and approval — everything
              in one guided flow. Your progress is saved automatically.
            </p>
          </div>

          {/* Step navigation */}
          <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <StepNav
              current={state.step}
              maxUnlocked={state.maxUnlocked}
              step4Complete={state.outcome !== null}
              onStepClick={goToStep}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
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
                onSelectAllEligibility={(met) => {
                  const updated: Record<string, boolean> = {};
                  confirmedPathway.eligibility.forEach((r) => { updated[r.id] = met; });
                  persist({ eligibilityChecks: updated });
                }}
                onSelectAllRisk={(ans) => {
                  const updated: Record<string, "yes" | "no" | "partial"> = {};
                  countryData.riskFactors
                    .filter((f) => !f.pathwayIds?.length || f.pathwayIds.includes(confirmedPathway.id))
                    .forEach((f) => { updated[f.id] = ans; });
                  persist({ riskAnswers: updated });
                }}
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
                onSelectAllPhase={(ids, done) => {
                  const updated = { ...state.checklistCompleted };
                  ids.forEach((id) => { updated[id] = done; });
                  persist({ checklistCompleted: updated });
                }}
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
                refusalLetter={state.refusalLetter}
                appReferenceNumber={state.appReferenceNumber}
                lodgementDate={state.lodgementDate}
                onOutcomeChange={(o) => persist({ outcome: o })}
                onRefusalReasonToggle={(id) => {
                  const cur = new Set(state.refusalReasons);
                  if (cur.has(id)) cur.delete(id);
                  else cur.add(id);
                  persist({ refusalReasons: Array.from(cur) });
                }}
                onRefusalLetterChange={(text) => persist({ refusalLetter: text })}
                onAppReferenceChange={(val) => persist({ appReferenceNumber: val })}
                onDownloadReport={() => setShowReport(true)}
                onStartPathway={(pathwayId) => {
                  // Go to Step 1 with the pathway expanded for review — not yet confirmed
                  persist({
                    step: 1,
                    maxUnlocked: 1,
                    confirmedPathwayId: null,
                    outcome: null,
                    refusalReasons: [],
                    refusalLetter: "",
                    appReferenceNumber: "",
                    eligibilityChecks: {},
                    riskAnswers: {},
                    checklistCompleted: {},
                    lodgementDate: "",
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  // After navigation, scroll to and expand the target pathway card
                  setTimeout(() => {
                    const el = document.getElementById(`pathway-${pathwayId}`);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }, 300);
                }}
              />
            )}
          </div>

          {/* Sidebar — hidden on mobile, sticky on desktop */}
          <div className="hidden lg:block space-y-4 lg:sticky lg:top-6">
            {/* Progress overview */}
            <div className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border)" }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--muted-foreground)" }}>
                Your progress
              </h3>
              <div className="space-y-2.5">
                {STEPS.map((s) => {
                  const done = s.number < state.step || (s.number === 4 && state.outcome !== null);
                  const active = s.number === state.step && !(s.number === 4 && state.outcome !== null);
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
                          ? "bg-white/[0.10] border border-white/[0.22] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          : done
                          ? "hover:bg-white/[0.05] border border-transparent cursor-pointer"
                          : locked
                          ? "opacity-35 cursor-not-allowed border border-transparent"
                          : "hover:bg-white/[0.05] border border-transparent cursor-pointer"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          done
                            ? "bg-emerald-500/20 border-emerald-500/60"
                            : active
                            ? "dark:bg-white dark:border-white bg-gray-900 border-gray-900"
                            : "bg-white/[0.05] border-white/[0.15]"
                        )}
                      >
                        {done ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <SIcon
                            className={cn(
                              "w-3 h-3",
                              active ? "dark:text-black text-white" : locked ? "text-zinc-500" : "text-zinc-500"
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            "text-xs font-bold",
                            active
                              ? "text-white"
                              : done
                              ? "text-emerald-400"
                              : "text-zinc-500"
                          )}
                        >
                          {s.label}
                        </div>
                        <div className="text-[10px] text-zinc-500">{s.sublabel}</div>
                      </div>
                      {active && (
                        <ArrowRight className="w-3.5 h-3.5 text-white flex-shrink-0" />
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
                  className="mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.12] text-xs font-semibold text-zinc-300 hover:border-white/[0.25] hover:text-white transition-all"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  Change pathway
                </button>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-500/[0.05] border border-amber-500/15 rounded-xl">
              <Info className="w-3.5 h-3.5 text-amber-500/70 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                For guidance only. Always verify with{" "}
                <a
                  href={countryData.visaBodyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 underline hover:text-white transition-colors"
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
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.07] text-xs font-medium text-zinc-500 hover:border-red-500/30 hover:text-red-400 transition-all"
            >
              ↺ Reset guide
            </button>
          </div>
        </div>

        {/* Mobile-only bottom panel (sidebar is hidden on mobile) */}
        <div className="lg:hidden mt-8 space-y-3">

          {/* Confirmed pathway card */}
          {confirmedPathway && (
            <div className="glass rounded-2xl border border-white/[0.10] p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Confirmed pathway</p>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", confirmedPathway.iconBg)}>
                  <Globe className={cn("w-4 h-4", confirmedPathway.iconColor)} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{confirmedPathway.name}</div>
                  {confirmedPathway.subclass && (
                    <div className="text-xs text-zinc-500">Subclass {confirmedPathway.subclass}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 text-xs text-zinc-500 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{confirmedPathway.processingTime}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{confirmedPathway.cost}</span>
              </div>
              <button
                onClick={() => goToStep(1)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.12] text-xs font-semibold text-zinc-300 hover:border-white/[0.25] hover:text-white transition-all"
              >
                <ArrowRight className="w-3 h-3 rotate-180" />
                Change pathway
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 px-4 py-3 bg-amber-500/[0.05] border border-amber-500/15 rounded-xl">
            <Info className="w-3.5 h-3.5 text-amber-500/70 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              For guidance only. Always verify with{" "}
              <a
                href={countryData.visaBodyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 underline hover:text-white transition-colors"
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
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.07] text-xs font-medium text-zinc-500 hover:border-red-500/30 hover:text-red-400 transition-all"
          >
            ↺ Reset guide
          </button>
        </div>
      </div>

      {/* Full guide report modal */}
      {showReport && confirmedPathway && (
        <ReportModal
          pathway={confirmedPathway}
          countryName={countryData.name}
          countryCode={countryCode}
          checklist={filteredChecklist}
          completed={completedSet}
          lodgementDate={state.lodgementDate}
          totalEstimate={reportTotalEstimate}
          applicationFee={reportApplicationFee}
          eligibilityChecks={state.eligibilityChecks}
          riskAnswers={state.riskAnswers}
          riskFactors={countryData.riskFactors}
          outcome={state.outcome}
          appReferenceNumber={state.appReferenceNumber}
          refusalReasons={state.refusalReasons}
          refusalReasonData={countryData.refusalReasons}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
