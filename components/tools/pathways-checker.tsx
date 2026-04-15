"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Calendar,
  ArrowRight,
  BarChart3,
  ListChecks,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Briefcase,
  Languages,
  Shield,
  Award,
  BookOpen,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, VisaPathway, MigrationService, VisaCurrentOption, VisaGoalOption } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

function getDifficultyConfig(difficulty: VisaPathway["difficulty"]) {
  return {
    straightforward: { label: "Straightforward", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    moderate: { label: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
    complex: { label: "Complex", color: "text-red-700 bg-red-50 border-red-200" },
  }[difficulty];
}

function getDifficultyStars(difficulty: VisaPathway["difficulty"]) {
  return { straightforward: 1, moderate: 2, complex: 3 }[difficulty];
}

const serviceTypeIcons: Record<string, typeof Globe> = {
  "migration-agent": Shield,
  education: BookOpen,
  "skills-assessment": Award,
  english: Languages,
  recruitment: Briefcase,
};

const serviceTypeColors: Record<string, string> = {
  "migration-agent": "bg-violet-100 text-violet-700",
  education: "bg-blue-100 text-blue-700",
  "skills-assessment": "bg-amber-100 text-amber-700",
  english: "bg-cyan-100 text-cyan-700",
  recruitment: "bg-emerald-100 text-emerald-700",
};

function ServiceCard({ service }: { service: MigrationService }) {
  const Icon = serviceTypeIcons[service.type] ?? Shield;
  const colorClass = serviceTypeColors[service.type] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{service.name}</h4>
            <span className={cn("inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5", colorClass)}>
              {service.typeLabel}
            </span>
          </div>
        </div>
        {service.badge && (
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
            {service.badge}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{service.tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        {service.specialties.slice(0, 4).map((s) => (
          <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {s}
          </span>
        ))}
        {service.specialties.length > 4 && (
          <span className="text-xs text-slate-400 px-1 py-0.5">+{service.specialties.length - 4} more</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          {service.priceFrom ? (
            <span>
              From <span className="font-semibold text-slate-700">{service.priceFrom}</span>
            </span>
          ) : (
            <span className="text-slate-400">Contact for pricing</span>
          )}
        </div>
        {service.website && (
          <a
            href={service.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Visit site <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function PathwayCard({
  pathway,
  isBestMatch,
  expanded,
  onToggle,
  countryCode,
}: {
  pathway: VisaPathway;
  isBestMatch: boolean;
  expanded: boolean;
  onToggle: () => void;
  countryCode: string;
}) {
  const difficulty = getDifficultyConfig(pathway.difficulty);
  const stars = getDifficultyStars(pathway.difficulty);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md",
        isBestMatch ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200"
      )}
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              pathway.iconBg
            )}
          >
            <Globe className={cn("w-5 h-5", pathway.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {isBestMatch && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-blue-600" /> Best match
                </span>
              )}
              {pathway.subclass && (
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Subclass {pathway.subclass}
                </span>
              )}
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full border",
                  difficulty.color
                )}
              >
                {difficulty.label}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{pathway.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{pathway.tagline}</p>
          </div>
          {/* Complexity stars: 1=straightforward, 2=moderate, 3=complex */}
          <div className="flex gap-0.5 flex-shrink-0 mt-1" title={`Complexity: ${pathway.difficulty}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={cn("w-3 h-3", i < stars ? "fill-rose-400 text-rose-400" : "text-slate-200")}
              />
            ))}
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Clock, label: pathway.processingTime },
            { icon: Calendar, label: pathway.validity },
            { icon: DollarSign, label: pathway.cost },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-slate-50 rounded-lg px-2.5 py-2 flex items-center gap-1.5 min-w-0">
                <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-600 truncate">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Urgent note */}
        {pathway.urgentNote && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">{pathway.urgentNote}</p>
          </div>
        )}

        {/* Expandable section */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors mt-1"
        >
          <span>{expanded ? "Hide details" : "View details, pros & cons"}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
          {/* Summary */}
          <p className="text-xs text-slate-600 leading-relaxed">{pathway.summary}</p>

          {/* Pros / Cons grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3.5">
              <h4 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Pros
              </h4>
              <ul className="space-y-1.5">
                {pathway.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-emerald-800 leading-relaxed">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-3.5">
              <h4 className="text-xs font-bold text-red-800 mb-2 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" /> Cons
              </h4>
              <ul className="space-y-1.5">
                {pathway.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-red-800 leading-relaxed">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next steps */}
          {pathway.nextSteps && pathway.nextSteps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">Next steps</h4>
              <ol className="space-y-1.5">
                {pathway.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs text-slate-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Leads to */}
          {pathway.pathwayTo.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">Leads to:</span>
              {pathway.pathwayTo.map((p) => (
                <span
                  key={p}
                  className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* Related occupations */}
          {pathway.relatedOccupations && pathway.relatedOccupations.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">Common for:</span>
              {pathway.relatedOccupations.map((occ) => (
                <span
                  key={occ}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                >
                  {occ}
                </span>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-2.5 pt-1">
            <Link
              href={`/${countryCode}/planner`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              <ListChecks className="w-3.5 h-3.5" /> Plan this visa
            </Link>
            <Link
              href={`/${countryCode}/audit`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-4 py-2.5 rounded-lg hover:bg-slate-200 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Risk audit
            </Link>
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
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [servicePage, setServicePage] = useState(0);
  const SERVICES_PER_PAGE = 3;

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Determine ranked pathway IDs from the relevance matrix
  const rankedPathwayIds = useMemo<string[]>(() => {
    if (!currentVisa) return [];
    const matrix = countryData.pathwayRelevance;
    const byVisa = matrix[currentVisa];
    if (!byVisa) return [];
    return byVisa[goal] ?? byVisa["all"] ?? [];
  }, [currentVisa, goal, countryData]);

  const difficultyOrder = { straightforward: 0, moderate: 1, complex: 2 } as const;

  // Build sorted pathway list
  const displayedPathways = useMemo<VisaPathway[]>(() => {
    if (!currentVisa) {
      // No filter — show all, sorted straightforward → moderate → complex
      return [...countryData.pathways].sort(
        (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      );
    }

    // Map by ID for O(1) lookup
    const byId = new Map(countryData.pathways.map((p) => [p.id, p]));
    const ranked: VisaPathway[] = [];

    // First: pathways in the recommended order (preserve relevance ranking)
    for (const id of rankedPathwayIds) {
      const p = byId.get(id);
      if (p) ranked.push(p);
    }

    // Then: remaining pathways filtered by fromVisas + forGoals, sorted by difficulty
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

  // Services filter
  const serviceTypes = useMemo(() => {
    const types = new Set(countryData.services.map((s) => s.type));
    return Array.from(types);
  }, [countryData]);

  const filteredServices = useMemo(() => {
    const list = serviceFilter === "all"
      ? countryData.services
      : countryData.services.filter((s) => s.type === serviceFilter);
    return list;
  }, [serviceFilter, countryData.services]);

  const totalServicePages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);
  const pagedServices = filteredServices.slice(
    servicePage * SERVICES_PER_PAGE,
    (servicePage + 1) * SERVICES_PER_PAGE
  );

  const serviceTypeLabels: Record<string, string> = {
    "migration-agent": "Migration Agents",
    education: "Education",
    "skills-assessment": "Skills Assessment",
    english: "English Test Prep",
    recruitment: "Recruitment",
  };

  const bestMatchId = displayedPathways[0]?.id ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Boxed gradient hero */}
      <div className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${countryCode}`} className="hover:text-white transition-colors capitalize">{countryData.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Pathway Checker</span>
          </div>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-300" />
              </div>
              <h1 className="text-2xl font-bold text-white">Visa Pathway Checker</h1>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Select your current visa status and your goal — we'll surface the most relevant {countryData.name} pathways instantly.
            </p>
          </div>

          {/* Filter panel */}
          <div className="mt-8 bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Current visa */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
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
                          ? "bg-white text-slate-900 border-white shadow-sm"
                          : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0 transition-all",
                        currentVisa === opt.value ? "bg-blue-500" : "bg-white/20"
                      )} />
                      <div className="min-w-0">
                        <div className={cn("text-sm font-semibold truncate", currentVisa === opt.value ? "text-slate-900" : "text-white")}>
                          {opt.label}
                        </div>
                        <div className={cn("text-xs truncate", currentVisa === opt.value ? "text-slate-500" : "text-slate-400")}>
                          {opt.sublabel}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
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
                          ? "bg-white text-slate-900 border-white shadow-sm"
                          : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0 transition-all",
                        goal === opt.value ? "bg-indigo-500" : "bg-white/20"
                      )} />
                      <div className="min-w-0">
                        <div className={cn("text-sm font-semibold truncate", goal === opt.value ? "text-slate-900" : "text-white")}>
                          {opt.label}
                        </div>
                        <div className={cn("text-xs truncate", goal === opt.value ? "text-slate-500" : "text-slate-400")}>
                          {opt.sublabel}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setGoal("all")}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all",
                      goal === "all"
                        ? "bg-white text-slate-900 border-white shadow-sm"
                        : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0 transition-all",
                      goal === "all" ? "bg-indigo-500" : "bg-white/20"
                    )} />
                    <div className="min-w-0">
                      <div className={cn("text-sm font-semibold", goal === "all" ? "text-slate-900" : "text-white")}>
                        Show all options
                      </div>
                      <div className={cn("text-xs", goal === "all" ? "text-slate-500" : "text-slate-400")}>
                        All pathways for my visa status
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {currentVisa && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-sm text-slate-300">
                  Showing <span className="font-bold text-white">{displayedPathways.length}</span> pathways — ranked by relevance
                </p>
                <button
                  onClick={() => { setCurrentVisa(""); setGoal("all"); }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Pathway results — 2/3 width */}
          <div className="lg:col-span-2">
            {!currentVisa && (
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  All {countryData.name} pathways
                </h2>
                <span className="text-sm text-slate-500">{displayedPathways.length} pathways</span>
              </div>
            )}

            {currentVisa && displayedPathways.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No direct pathways found</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Try selecting &quot;Show all options&quot; or a different goal to see more pathways.
                </p>
                <button
                  onClick={() => setGoal("all")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  Show all pathways
                </button>
              </div>
            )}

            <div className="space-y-4">
              {displayedPathways.map((pathway, index) => (
                <PathwayCard
                  key={pathway.id}
                  pathway={pathway}
                  isBestMatch={index === 0 && !!currentVisa && rankedPathwayIds.includes(pathway.id)}
                  expanded={expandedIds.has(pathway.id)}
                  onToggle={() => toggleExpanded(pathway.id)}
                  countryCode={countryCode}
                />
              ))}
            </div>
          </div>

          {/* Sidebar — 1/3 width */}
          <div className="space-y-6">
            {/* Other tools */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Related tools</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: ListChecks,
                    title: "Checklist & Timeline",
                    desc: "Build your step-by-step application plan",
                    href: `/${countryCode}/planner`,
                    color: "bg-indigo-50 text-indigo-600",
                  },
                  {
                    icon: BarChart3,
                    title: "Risk Audit",
                    desc: "Identify weak spots before you apply",
                    href: `/${countryCode}/audit`,
                    color: "bg-violet-50 text-violet-600",
                  },
                  {
                    icon: ArrowRight,
                    title: "Refusal Recovery",
                    desc: "Recover from a prior visa refusal",
                    href: `/${countryCode}/recovery`,
                    color: "bg-rose-50 text-rose-600",
                  },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.title}
                      href={tool.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", tool.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {tool.title}
                        </div>
                        <div className="text-xs text-slate-500">{tool.desc}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto group-hover:text-blue-500 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Official resources */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Official resources</h3>
              <a
                href={countryData.visaBodyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                {countryData.visaBodyName}
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Always verify requirements directly with the official immigration authority before applying.
              </p>
            </div>

            {/* Services directory */}
            {countryData.services && countryData.services.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Services directory</h3>
                <p className="text-xs text-slate-500 mb-3">Agents, education, assessors & recruiters</p>

                {/* Type filter */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <button
                    onClick={() => { setServiceFilter("all"); setServicePage(0); }}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-full border transition-all",
                      serviceFilter === "all"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    All
                  </button>
                  {serviceTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => { setServiceFilter(type); setServicePage(0); }}
                      className={cn(
                        "px-2.5 py-1 text-xs font-semibold rounded-full border transition-all",
                        serviceFilter === type
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {serviceTypeLabels[type] ?? type}
                    </button>
                  ))}
                </div>

                {/* Fixed-height card area — always fits exactly SERVICES_PER_PAGE cards */}
                <div className="space-y-3 min-h-[calc(3*theme(spacing.1)+(3*168px))]">
                  {pagedServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>

                {/* Pagination */}
                {totalServicePages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setServicePage((p) => p - 1)}
                      disabled={servicePage === 0}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-slate-900 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                    <span className="text-xs text-slate-400">
                      {servicePage + 1} / {totalServicePages}
                    </span>
                    <button
                      onClick={() => setServicePage((p) => p + 1)}
                      disabled={servicePage >= totalServicePages - 1}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-slate-900 transition-colors"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                  <Users className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Listings are informational only. VisaSwitch does not endorse any provider — verify credentials independently.
                  </p>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-xs text-slate-400 leading-relaxed px-1">
              VisaSwitch provides structured information only. It does not constitute legal or immigration advice. For complex cases, consult a registered migration agent or immigration lawyer.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
