"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ListChecks,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  CalendarDays,
  Filter,
  ArrowRight,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, ChecklistItem } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

type FilterType = "all" | "critical" | "high" | "document" | "financial" | "health" | "form";

const priorityConfig = {
  critical: { label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
  high: { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  medium: { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  low: { label: "Low", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

const categoryConfig = {
  document: { label: "Document", color: "bg-blue-100 text-blue-700" },
  financial: { label: "Financial", color: "bg-emerald-100 text-emerald-700" },
  health: { label: "Health", color: "bg-rose-100 text-rose-700" },
  form: { label: "Form / Application", color: "bg-violet-100 text-violet-700" },
  other: { label: "Other", color: "bg-slate-100 text-slate-700" },
};

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function getWeeksUntil(targetDate: Date, today: Date): number {
  return Math.ceil((targetDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

export function TimelinePlanner({ countryData, countryCode }: Props) {
  const [lodgementDate, setLodgementDate] = useState<string>("");
  const [selectedPathway, setSelectedPathway] = useState<string>("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("all");
  const [started, setStarted] = useState(false);

  const today = new Date();
  const targetDate = lodgementDate ? new Date(lodgementDate) : null;

  const checklistItems: (ChecklistItem & { dueDate: Date | null; weeksRemaining: number | null })[] =
    useMemo(() => {
      return countryData.checklist.map((item) => {
        const dueDate = targetDate ? addWeeks(targetDate, item.dueWeeks) : null;
        const weeksRemaining = dueDate ? getWeeksUntil(dueDate, today) : null;
        return { ...item, dueDate, weeksRemaining };
      });
    }, [countryData.checklist, targetDate]);

  const filteredItems = checklistItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "critical") return item.priority === "critical";
    if (filter === "high") return item.priority === "high" || item.priority === "critical";
    return item.category === filter;
  });

  const completedCount = [...completed].filter((id) => countryData.checklist.some((i) => i.id === id)).length;
  const progress = countryData.checklist.length > 0 ? (completedCount / countryData.checklist.length) * 100 : 0;

  const overdueItems = checklistItems.filter(
    (item) => item.weeksRemaining !== null && item.weeksRemaining < 0 && !completed.has(item.id)
  );
  const urgentItems = checklistItems.filter(
    (item) =>
      item.weeksRemaining !== null &&
      item.weeksRemaining >= 0 &&
      item.weeksRemaining <= 2 &&
      !completed.has(item.id)
  );

  function toggleCompleted(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="hero-gradient text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/${countryCode}`} className="hover:text-white transition-colors">{countryData.name}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Checklist & Timeline</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <ListChecks className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Checklist & Timeline Planner</h1>
                <p className="text-slate-400 text-sm">{countryData.name} — Personalised application plan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">Build your application plan</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Enter your target lodgement date and select your visa type. We will generate a personalised checklist with due dates for every step of the process.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Target visa lodgement date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={lodgementDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setLodgementDate(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  All checklist deadlines will be calculated backwards from this date
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Visa pathway (optional)
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  value={selectedPathway}
                  onChange={(e) => setSelectedPathway(e.target.value)}
                >
                  <option value="">All pathways — show full checklist</option>
                  {countryData.pathways.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.subclass ? `Subclass ${p.subclass} — ` : ""}{p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Processing times and lodgement deadlines vary. Use this checklist as a guide — always confirm current requirements with {countryData.visaBodyName}.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              disabled={!lodgementDate}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate my checklist
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
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
            <span className="text-white">Checklist & Timeline</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <ListChecks className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your Application Timeline</h1>
                <p className="text-slate-400 text-sm">
                  Target lodgement: {targetDate ? formatDate(targetDate) : "—"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setStarted(false)}
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Change date
            </button>
          </div>

          {/* Progress */}
          <div className="mt-6 max-w-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{completedCount} of {countryData.checklist.length} tasks completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Alerts */}
        {overdueItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">
                  {overdueItems.length} task{overdueItems.length > 1 ? "s" : ""} overdue
                </p>
                <p className="text-xs text-red-700">
                  {overdueItems.map((i) => i.title).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {urgentItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  {urgentItems.length} task{urgentItems.length > 1 ? "s" : ""} due within 2 weeks
                </p>
                <p className="text-xs text-amber-700">
                  {urgentItems.map((i) => i.title).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {(["all", "critical", "document", "financial", "health", "form"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                  filter === f
                    ? "bg-indigo-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isCompleted = completed.has(item.id);
            const isOverdue = item.weeksRemaining !== null && item.weeksRemaining < 0 && !isCompleted;
            const isUrgent = item.weeksRemaining !== null && item.weeksRemaining >= 0 && item.weeksRemaining <= 2 && !isCompleted;
            const pConfig = priorityConfig[item.priority];
            const cConfig = categoryConfig[item.category];

            return (
              <div
                key={item.id}
                className={cn(
                  "bg-white rounded-xl border p-5 transition-all",
                  isCompleted ? "border-emerald-200 opacity-60" : "border-slate-200",
                  isOverdue ? "border-red-200 bg-red-50/30" : "",
                  isUrgent ? "border-amber-200 bg-amber-50/20" : ""
                )}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleCompleted(item.id)}
                    className="mt-0.5 flex-shrink-0"
                    aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-400 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", pConfig.color)}>
                        {pConfig.label}
                      </span>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cConfig.color)}>
                        {cConfig.label}
                      </span>
                    </div>

                    <h3 className={cn("text-sm font-bold mb-1", isCompleted ? "line-through text-slate-400" : "text-slate-900")}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {item.dueDate && (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className={cn("w-3.5 h-3.5", isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-slate-400")} />
                          <span className={cn("text-xs font-medium", isOverdue ? "text-red-600" : isUrgent ? "text-amber-600" : "text-slate-600")}>
                            {formatDate(item.dueDate)}
                          </span>
                        </div>
                        {!isCompleted && item.weeksRemaining !== null && (
                          <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            isOverdue ? "bg-red-100 text-red-600" : isUrgent ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                          )}>
                            {isOverdue
                              ? `${Math.abs(item.weeksRemaining)}w overdue`
                              : item.weeksRemaining === 0
                              ? "Due this week"
                              : `${item.weeksRemaining}w to go`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next tools CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white">
          <h3 className="text-base font-bold mb-2">Ready to check your risk?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Before you lodge, run a full risk audit to identify any weak points in your application.
          </p>
          <Link
            href={`/${countryCode}/audit`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Run pre-lodgement risk audit
          </Link>
        </div>
      </div>
    </div>
  );
}
