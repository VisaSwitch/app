"use client";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ListChecks, ChevronRight, CheckCircle, Circle, Clock, AlertCircle,
  CalendarDays, ArrowRight, BarChart3, RefreshCw, Info,
  ChevronDown, ChevronUp, Sparkles, Target, FileCheck, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryData, ChecklistItem, VisaPathway } from "@/types";

interface Props {
  countryData: CountryData;
  countryCode: string;
}

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

export function TimelinePlanner({ countryData, countryCode }: Props) {
  const searchParams = useSearchParams();
  const pathwayParam = searchParams.get("pathway") ?? "";

  const [selectedPathway, setSelectedPathway] = useState<string>(pathwayParam);
  const [lodgementDate, setLodgementDate] = useState<string>("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const today = new Date();
  const targetDate = lodgementDate ? new Date(lodgementDate) : null;

  const selectedPathwayData: VisaPathway | null = useMemo(
    () => countryData.pathways.find((p) => p.id === selectedPathway) ?? null,
    [selectedPathway, countryData]
  );

  // Filtered checklist by pathway
  const filteredChecklist = useMemo(() => {
    if (!selectedPathway) return countryData.checklist;
    return countryData.checklist.filter(
      (item) => !item.pathwayIds || item.pathwayIds.length === 0 || item.pathwayIds.includes(selectedPathway)
    );
  }, [countryData.checklist, selectedPathway]);

  const checklistItems = useMemo(() => {
    return filteredChecklist.map((item) => {
      const dueDate = targetDate ? addWeeks(targetDate, item.dueWeeks) : null;
      const weeksRemaining = dueDate ? getWeeksUntil(dueDate, today) : null;
      return { ...item, dueDate, weeksRemaining };
    });
  }, [filteredChecklist, targetDate]);

  const totalTrackableItems = useMemo(() => {
    let count = filteredChecklist.length;
    if (selectedPathwayData) {
      count += selectedPathwayData.nextSteps.length;
      count += selectedPathwayData.eligibility.length;
    }
    return count;
  }, [selectedPathwayData, filteredChecklist]);

  const completedCount = [...completed].filter(
    (id) =>
      filteredChecklist.some((i) => i.id === id) ||
      id.startsWith("elig-") ||
      id.startsWith("step-")
  ).length;
  const progress = totalTrackableItems > 0 ? Math.min(100, Math.round((completedCount / totalTrackableItems) * 100)) : 0;

  const overdueItems = checklistItems.filter(
    (item) => item.weeksRemaining !== null && item.weeksRemaining < 0 && !completed.has(item.id)
  );
  const urgentItems = checklistItems.filter(
    (item) => item.weeksRemaining !== null && item.weeksRemaining >= 0 && item.weeksRemaining <= 2 && !completed.has(item.id)
  );

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
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
            <span className="text-white">Checklist & Timeline</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Checklist & Timeline Planner</h1>
              <p className="text-slate-400 text-sm">{countryData.name} — Your personalised application plan</p>
            </div>
          </div>

          {/* Config bar — always visible */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Visa pathway</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={selectedPathway}
                  onChange={(e) => setSelectedPathway(e.target.value)}
                >
                  <option value="" className="text-slate-900">All pathways — full checklist</option>
                  {countryData.pathways.map((p) => (
                    <option key={p.id} value={p.id} className="text-slate-900">
                      {p.subclass ? `Subclass ${p.subclass} — ` : ""}{p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target lodgement date <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={lodgementDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setLodgementDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 max-w-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>{completedCount} of {totalTrackableItems} tasks completed</span>
              <span className="font-semibold text-white">{progress}%</span>
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

      {/* Main content area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* B1: Context banner */}
        {selectedPathwayData && (
          <div className={cn("rounded-2xl p-5 border flex items-start gap-4", selectedPathwayData.iconBg, "border-current/20")}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", selectedPathwayData.iconBg)}>
              <Sparkles className={cn("w-5 h-5", selectedPathwayData.iconColor)} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-sm font-bold text-slate-900">Planning for: {selectedPathwayData.name}</h2>
                {selectedPathwayData.subclass && (
                  <span className="text-xs font-semibold text-slate-500 bg-white/60 px-2 py-0.5 rounded-full">
                    Subclass {selectedPathwayData.subclass}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedPathwayData.processingTime}</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {selectedPathwayData.validity}</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {selectedPathwayData.difficulty}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedPathway("")}
              className="text-xs text-slate-500 hover:text-slate-700 underline whitespace-nowrap"
            >Clear</button>
          </div>
        )}

        {/* B2: Alerts */}
        {targetDate && overdueItems.length > 0 && (
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

        {targetDate && urgentItems.length > 0 && (
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

        {/* B3: Pathway eligibility checklist */}
        {selectedPathwayData && selectedPathwayData.eligibility.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Eligibility requirements</h3>
              <span className="ml-auto text-xs text-slate-400">
                {selectedPathwayData.eligibility.filter((e) => completed.has(`elig-${e.id}`)).length} / {selectedPathwayData.eligibility.length} confirmed
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {selectedPathwayData.eligibility.map((req) => {
                const isChecked = completed.has(`elig-${req.id}`);
                return (
                  <div key={req.id} className={cn("px-5 py-4 flex items-start gap-3", isChecked && "opacity-60")}>
                    <button onClick={() => toggle(`elig-${req.id}`)} className="mt-0.5 flex-shrink-0">
                      {isChecked
                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                        : <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-400 transition-colors" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-slate-900">{req.label}</span>
                        {!req.required && <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Optional</span>}
                        {req.required && <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Required</span>}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{req.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* B4: Key milestones / Next steps */}
        {selectedPathwayData && selectedPathwayData.nextSteps.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Application milestones</h3>
              <span className="ml-auto text-xs text-slate-400">
                {selectedPathwayData.nextSteps.filter((_, i) => completed.has(`step-${i}`)).length} / {selectedPathwayData.nextSteps.length} done
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {selectedPathwayData.nextSteps.map((step, i) => {
                const isChecked = completed.has(`step-${i}`);
                return (
                  <div key={i} className={cn("px-5 py-4 flex items-start gap-3", isChecked && "opacity-60")}>
                    <button onClick={() => toggle(`step-${i}`)} className="mt-0.5 flex-shrink-0">
                      {isChecked
                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                        : <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-indigo-400 transition-colors">
                            <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                          </div>}
                    </button>
                    <span className={cn("text-sm text-slate-700 leading-relaxed mt-0.5", isChecked && "line-through text-slate-400")}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* B5: Document & task checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Documents & tasks</h3>
            {!lodgementDate && (
              <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3" /> Set a target date above for due dates
              </span>
            )}
          </div>
          <div className="divide-y divide-slate-100">
            {checklistItems.map((item) => {
              const isCompleted = completed.has(item.id);
              const isOverdue = item.weeksRemaining !== null && item.weeksRemaining < 0 && !isCompleted;
              const isUrgent = item.weeksRemaining !== null && item.weeksRemaining >= 0 && item.weeksRemaining <= 2 && !isCompleted;
              const pConfig = priorityConfig[item.priority];
              const cConfig = categoryConfig[item.category];
              const isExpanded = expandedItem === item.id;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "transition-colors",
                    isOverdue ? "bg-red-50/40" : isUrgent ? "bg-amber-50/30" : "",
                    isCompleted ? "opacity-50" : ""
                  )}
                >
                  <div className="px-5 py-4 flex items-start gap-3">
                    <button onClick={() => toggle(item.id)} className="mt-0.5 flex-shrink-0">
                      {isCompleted
                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                        : <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-400 transition-colors" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", pConfig.color)}>{pConfig.label}</span>
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cConfig.color)}>{cConfig.label}</span>
                      </div>
                      <h4 className={cn("text-sm font-bold", isCompleted ? "line-through text-slate-400" : "text-slate-900")}>{item.title}</h4>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      {item.dueDate && (
                        <>
                          <div className="flex items-center gap-1">
                            <CalendarDays className={cn("w-3.5 h-3.5", isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-slate-400")} />
                            <span className={cn("text-xs font-medium", isOverdue ? "text-red-600" : isUrgent ? "text-amber-600" : "text-slate-600")}>
                              {formatDate(item.dueDate)}
                            </span>
                          </div>
                          {!isCompleted && item.weeksRemaining !== null && (
                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                              isOverdue ? "bg-red-100 text-red-600" : isUrgent ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                            )}>
                              {isOverdue ? `${Math.abs(item.weeksRemaining)}w overdue` : item.weeksRemaining === 0 ? "Due this week" : `${item.weeksRemaining}w`}
                            </span>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors mt-1"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-4 ml-8">
                      <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* B6: Bottom CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white">
          <h3 className="text-base font-bold mb-2">Ready to stress-test your application?</h3>
          <p className="text-slate-400 text-sm mb-4">Run a pre-lodgement risk audit to find weak spots before you submit.</p>
          <Link
            href={selectedPathway ? `/${countryCode}/audit?pathway=${selectedPathway}` : `/${countryCode}/audit`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Run risk audit
          </Link>
        </div>

        {/* B7: Disclaimer note */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Processing times and requirements change. Always verify current requirements with{" "}
            <a href={countryData.visaBodyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{countryData.visaBodyName}</a>{" "}
            before lodging.
          </p>
        </div>
      </div>
    </div>
  );
}
