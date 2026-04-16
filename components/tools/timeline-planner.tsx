"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useActivePathway } from "@/hooks/use-active-pathway";
import { ActivePathwayBanner } from "@/components/tools/active-pathway-banner";
import {
  ListChecks, ChevronRight, CheckCircle, Circle, Clock, AlertCircle,
  CalendarDays, BarChart3, Info,
  ChevronDown, ChevronUp, Sparkles, Target, FileCheck, Shield,
  LayoutList, GitBranch, DollarSign,
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
  critical: { label: "Critical", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  high: { label: "High", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  medium: { label: "Medium", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  low: { label: "Low", color: "text-zinc-400 bg-white/[0.05] border-white/[0.10]" },
};

const categoryConfig = {
  document: { label: "Document", color: "bg-blue-500/15 text-blue-400" },
  financial: { label: "Financial", color: "bg-emerald-500/10 text-emerald-400" },
  health: { label: "Health", color: "bg-rose-500/10 text-rose-400" },
  form: { label: "Form / Application", color: "bg-violet-500/10 text-violet-400" },
  other: { label: "Other", color: "bg-white/[0.06] text-zinc-400" },
};

export function TimelinePlanner({ countryData, countryCode }: Props) {
  const searchParams = useSearchParams();
  const pathwayParam = searchParams.get("pathway") ?? "";

  const [selectedPathway, setSelectedPathway] = useState<string>(pathwayParam);
  const [lodgementDate, setLodgementDate] = useState<string>("");

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
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");

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

  // Cost aggregation
  const itemCosts = useMemo(() => {
    return filteredChecklist
      .filter(item => item.estimatedCost)
      .map(item => ({ title: item.title, cost: item.estimatedCost! }));
  }, [filteredChecklist]);

  const applicationFee = selectedPathwayData?.cost ?? null;

  // Week-by-week grouping (only useful when lodgementDate is set)
  const weekGroups = useMemo(() => {
    if (!targetDate) return null;
    const groups = new Map<number, typeof checklistItems>();
    for (const item of checklistItems) {
      const key = item.dueWeeks ?? 0;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    // Sort weeks ascending (most negative = earliest)
    return Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([week, items]) => ({ week, items }));
  }, [checklistItems, targetDate]);

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-black">
      {loaded && active && (
        <ActivePathwayBanner active={active} currentTool="planner" onClear={clear} />
      )}
      {/* Hero header */}
      <div className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-zinc-600 mb-4">
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
              <p className="text-zinc-400 text-sm">{countryData.name} — Your personalised application plan</p>
            </div>
          </div>

          {/* Config bar — always visible */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Visa pathway</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-white/20 bg-white/[0.07] text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  value={selectedPathway}
                  onChange={(e) => setSelectedPathway(e.target.value)}
                >
                  <option value="" className="bg-zinc-900">All pathways — full checklist</option>
                  {countryData.pathways.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-900">
                      {p.subclass ? `Subclass ${p.subclass} — ` : ""}{p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Target lodgement date <span className="text-zinc-400 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 rounded-xl border border-white/20 bg-white/[0.07] text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  value={lodgementDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setLodgementDate(e.target.value)}
                />
              </div>
            </div>
            {/* View toggle */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-500">View mode</span>
              <div className="flex items-center gap-1 p-1 bg-white/[0.07] rounded-lg border border-white/10">
                {(["list", "timeline"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                      viewMode === mode
                        ? "bg-white text-black"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {mode === "list" ? <LayoutList className="w-3.5 h-3.5" /> : <GitBranch className="w-3.5 h-3.5" />}
                    {mode === "list" ? "List" : "Timeline"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 max-w-lg">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
              <span>{completedCount} of {totalTrackableItems} tasks completed</span>
              <span className="font-semibold text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full transition-all duration-500"
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
          <div className="glass border border-white/[0.09] rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-zinc-300" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-sm font-bold text-white">Planning for: {selectedPathwayData.name}</h2>
                {selectedPathwayData.subclass && (
                  <span className="text-xs font-semibold text-zinc-600 bg-white/[0.07] px-2 py-0.5 rounded-full">
                    Subclass {selectedPathwayData.subclass}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedPathwayData.processingTime}</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {selectedPathwayData.validity}</span>
                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {selectedPathwayData.difficulty}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedPathway("")}
              className="text-xs text-zinc-600 hover:text-zinc-300 underline whitespace-nowrap"
            >Clear</button>
          </div>
        )}

        {/* B1b: Total Investment card */}
        {selectedPathwayData && (applicationFee || itemCosts.length > 0) && (
          <div className="glass border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Estimated Total Investment</h3>
              <span className="ml-auto text-xs text-zinc-600">indicative only</span>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {applicationFee && (
                <div className="px-5 py-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">Application fee (VAC)</span>
                  <span className="text-xs font-bold text-white">{applicationFee}</span>
                </div>
              )}
              {itemCosts.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{item.title}</span>
                  <span className="text-xs font-semibold text-zinc-300">{item.cost}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-white/[0.03] border-t border-white/[0.07] flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Listed costs total</span>
              <span className="text-xs text-zinc-600">See individual items above</span>
            </div>
          </div>
        )}

        {/* B2: Alerts */}
        {targetDate && overdueItems.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-300 mb-1">
                  {overdueItems.length} task{overdueItems.length > 1 ? "s" : ""} overdue
                </p>
                <p className="text-xs text-red-400/80">
                  {overdueItems.map((i) => i.title).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {targetDate && urgentItems.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-300 mb-1">
                  {urgentItems.length} task{urgentItems.length > 1 ? "s" : ""} due within 2 weeks
                </p>
                <p className="text-xs text-amber-400/80">
                  {urgentItems.map((i) => i.title).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* B3: Pathway eligibility checklist */}
        {selectedPathwayData && selectedPathwayData.eligibility.length > 0 && (
          <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-600" />
              <h3 className="text-sm font-bold text-white">Eligibility requirements</h3>
              <span className="ml-auto text-xs text-zinc-600">
                {selectedPathwayData.eligibility.filter((e) => completed.has(`elig-${e.id}`)).length} / {selectedPathwayData.eligibility.length} confirmed
              </span>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {selectedPathwayData.eligibility.map((req) => {
                const isChecked = completed.has(`elig-${req.id}`);
                return (
                  <div key={req.id} className={cn("px-5 py-4 flex items-start gap-3 hover:bg-white/[0.025] transition-colors", isChecked && "opacity-50")}>
                    <button onClick={() => toggle(`elig-${req.id}`)} className="mt-0.5 flex-shrink-0">
                      {isChecked
                        ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                        : <Circle className="w-5 h-5 text-zinc-700 hover:text-zinc-400 transition-colors" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">{req.label}</span>
                        {!req.required && <span className="text-xs text-zinc-600 bg-white/[0.06] px-1.5 py-0.5 rounded">Optional</span>}
                        {req.required && <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">Required</span>}
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{req.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* B4: Key milestones / Next steps */}
        {selectedPathwayData && selectedPathwayData.nextSteps.length > 0 && (
          <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-600" />
              <h3 className="text-sm font-bold text-white">Application milestones</h3>
              <span className="ml-auto text-xs text-zinc-600">
                {selectedPathwayData.nextSteps.filter((_, i) => completed.has(`step-${i}`)).length} / {selectedPathwayData.nextSteps.length} done
              </span>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {selectedPathwayData.nextSteps.map((step, i) => {
                const isChecked = completed.has(`step-${i}`);
                return (
                  <div key={i} className={cn("px-5 py-4 flex items-start gap-3 hover:bg-white/[0.025] transition-colors", isChecked && "opacity-60")}>
                    <button onClick={() => toggle(`step-${i}`)} className="mt-0.5 flex-shrink-0">
                      {isChecked
                        ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                        : <div className="w-5 h-5 rounded-full border-2 border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors">
                            <span className="text-xs font-bold text-zinc-600">{i + 1}</span>
                          </div>}
                    </button>
                    <span className={cn("text-sm text-zinc-300 leading-relaxed mt-0.5", isChecked && "line-through text-zinc-700")}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* B5: Document & task checklist (list) OR week-by-week timeline */}
        {viewMode === "list" || !targetDate ? (
          <>
            {viewMode === "timeline" && !targetDate && (
              <div className="glass border border-white/[0.08] rounded-2xl p-6 text-center">
                <GitBranch className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-400 mb-1">Set a target lodgement date</p>
                <p className="text-xs text-zinc-600">Timeline view groups tasks by week — set a target date above to activate it.</p>
              </div>
            )}
            {(viewMode === "list" || !targetDate) && (
              <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-zinc-600" />
                  <h3 className="text-sm font-bold text-white">Documents & tasks</h3>
                  {!lodgementDate && (
                    <span className="ml-auto text-xs text-zinc-600 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Set a target date above for due dates
                    </span>
                  )}
                </div>
                <div className="divide-y divide-white/[0.06]">
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
                          isOverdue ? "bg-red-500/[0.04]" : isUrgent ? "bg-amber-500/[0.04]" : "",
                          isCompleted ? "opacity-50" : ""
                        )}
                      >
                        <div className="px-5 py-4 flex items-start gap-3 hover:bg-white/[0.025] transition-colors">
                          <button onClick={() => toggle(item.id)} className="mt-0.5 flex-shrink-0">
                            {isCompleted
                              ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                              : <Circle className="w-5 h-5 text-zinc-700 hover:text-zinc-400 transition-colors" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", pConfig.color)}>{pConfig.label}</span>
                              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cConfig.color)}>{cConfig.label}</span>
                              {item.estimatedCost && (
                                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{item.estimatedCost}</span>
                              )}
                            </div>
                            <h4 className={cn("text-sm font-bold", isCompleted ? "line-through text-zinc-600" : "text-white")}>{item.title}</h4>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-1">
                            {item.dueDate && (
                              <>
                                <div className="flex items-center gap-1">
                                  <CalendarDays className={cn("w-3.5 h-3.5", isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-zinc-600")} />
                                  <span className={cn("text-xs font-medium", isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-zinc-500")}>
                                    {formatDate(item.dueDate)}
                                  </span>
                                </div>
                                {!isCompleted && item.weeksRemaining !== null && (
                                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                                    isOverdue ? "bg-red-500/15 text-red-400" : isUrgent ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.06] text-zinc-500"
                                  )}>
                                    {isOverdue ? `${Math.abs(item.weeksRemaining)}w overdue` : item.weeksRemaining === 0 ? "Due this week" : `${item.weeksRemaining}w`}
                                  </span>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                              className="text-zinc-600 hover:text-zinc-300 transition-colors mt-1"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="border-t border-white/[0.06] px-5 pb-4 pt-3 ml-8">
                            <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Timeline view */
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-4 h-4 text-zinc-600" />
              <h3 className="text-sm font-bold text-white">Week-by-week plan</h3>
              <span className="text-xs text-zinc-600 ml-auto">Relative to {formatDate(targetDate!)}</span>
            </div>
            {weekGroups!.map(({ week, items }) => {
              const weekLabel = week === 0
                ? "Lodgement week"
                : week < 0
                ? `${Math.abs(week)} week${Math.abs(week) !== 1 ? "s" : ""} before`
                : `${week} week${week !== 1 ? "s" : ""} after`;
              const weekDate = addWeeks(targetDate!, week);
              const isPast = weekDate < today;
              const allDone = items.every(i => completed.has(i.id));
              return (
                <div key={week} className={cn("glass rounded-2xl border overflow-hidden", allDone ? "border-emerald-500/20 opacity-60" : "border-white/[0.08]")}>
                  {/* Week header */}
                  <div className={cn("px-5 py-3 flex items-center gap-3 border-b border-white/[0.07]", allDone ? "bg-emerald-500/[0.05]" : "bg-white/[0.02]")}>
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", allDone ? "bg-emerald-400" : isPast ? "bg-red-400" : "bg-zinc-600")} />
                    <span className="text-xs font-bold text-white">{weekLabel}</span>
                    <span className="text-xs text-zinc-600">{formatDate(weekDate)}</span>
                    <span className="ml-auto text-xs text-zinc-600">{items.filter(i => completed.has(i.id)).length}/{items.length} done</span>
                  </div>
                  {/* Items in this week */}
                  <div className="divide-y divide-white/[0.05]">
                    {items.map((item) => {
                      const isCompleted = completed.has(item.id);
                      const pConfig = priorityConfig[item.priority];
                      return (
                        <div key={item.id} className={cn("px-5 py-3 flex items-center gap-3 hover:bg-white/[0.025] transition-colors", isCompleted && "opacity-50")}>
                          <button onClick={() => toggle(item.id)} className="flex-shrink-0">
                            {isCompleted
                              ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                              : <Circle className="w-4 h-4 text-zinc-700 hover:text-zinc-400 transition-colors" />}
                          </button>
                          <span className={cn("text-xs font-medium flex-1", isCompleted ? "line-through text-zinc-600" : "text-zinc-300")}>{item.title}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {item.estimatedCost && (
                              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{item.estimatedCost}</span>
                            )}
                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", pConfig.color)}>{pConfig.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* B6: Bottom CTA */}
        <div className="glass border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-2">Ready to stress-test your application?</h3>
          <p className="text-zinc-400 text-sm mb-4">Run a pre-lodgement risk audit to find weak spots before you submit.</p>
          <Link
            href={selectedPathway ? `/${countryCode}/audit?pathway=${selectedPathway}` : `/${countryCode}/audit`}
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 text-sm rounded-xl hover:bg-zinc-100 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Run risk audit
          </Link>
        </div>

        {/* B7: Disclaimer note */}
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            Processing times and requirements change. Always verify current requirements with{" "}
            <a href={countryData.visaBodyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{countryData.visaBodyName}</a>{" "}
            before lodging.
          </p>
        </div>
      </div>
    </div>
  );
}
