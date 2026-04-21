"use client";
import { useEffect } from "react";
import {
  X, Printer, CheckCircle, Circle, Clock, DollarSign, CalendarDays,
  Shield, FileCheck, AlertCircle, XCircle, AlertTriangle, BarChart3,
  ChevronRight, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisaPathway, ChecklistItem, RiskFactor, RefusalReason } from "@/types";
import type { ApplicationOutcome } from "@/hooks/use-outcome";

interface Props {
  pathway: VisaPathway | null;
  countryName: string;
  countryCode: string;
  // Step 3
  checklist: ChecklistItem[];
  completed: Set<string>;
  lodgementDate: string;
  totalEstimate: number;
  applicationFee: string | null;
  // Step 2 (optional — only passed from full guide, not timeline planner)
  eligibilityChecks?: Record<string, boolean>;
  riskAnswers?: Record<string, "yes" | "no" | "partial">;
  riskFactors?: RiskFactor[];
  // Step 4 (optional)
  outcome?: ApplicationOutcome | null;
  appReferenceNumber?: string;
  refusalReasons?: string[];
  refusalReasonData?: RefusalReason[];
  onClose: () => void;
}

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function fmt(date: Date): string {
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

const categoryConfig: Record<string, { label: string }> = {
  document:  { label: "Documents" },
  financial: { label: "Financial" },
  health:    { label: "Health" },
  form:      { label: "Forms & Applications" },
  other:     { label: "Other" },
};

const outcomeConfig: Record<ApplicationOutcome, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  preparing: {
    label: "Preparing",
    color: "text-zinc-300",
    bg: "bg-white/[0.05]",
    border: "border-white/[0.15]",
    icon: <FileCheck className="w-4 h-4" />,
  },
  applied: {
    label: "Application Lodged",
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    icon: <ChevronRight className="w-4 h-4" />,
  },
  rfi: {
    label: "Further Info Requested",
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  approved: {
    label: "Approved",
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  refused: {
    label: "Refused",
    color: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    icon: <XCircle className="w-4 h-4" />,
  },
};

const riskAnswerConfig = {
  yes:     { label: "Yes — risk applies",    color: "text-red-400",   dot: "bg-red-400" },
  partial: { label: "Partially applies",     color: "text-amber-400", dot: "bg-amber-400" },
  no:      { label: "No — not applicable",   color: "text-emerald-400", dot: "bg-emerald-400" },
};

export function ReportModal({
  pathway, countryName, countryCode, checklist, completed,
  lodgementDate, totalEstimate, applicationFee,
  eligibilityChecks, riskAnswers, riskFactors,
  outcome, appReferenceNumber, refusalReasons, refusalReasonData,
  onClose,
}: Props) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  void countryCode;

  const targetDate = lodgementDate ? new Date(lodgementDate) : null;
  const generatedAt = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  // Group checklist by category
  const byCategory = Object.entries(categoryConfig).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    items: checklist.filter(i => i.category === key),
  })).filter(g => g.items.length > 0);

  const completedCount = checklist.filter(i => completed.has(i.id)).length;
  const progress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  // Cost items
  const costItems = checklist.filter(i => i.estimatedCost && i.estimatedCostNumeric);

  // Risk score calculation (mirrors visa-guide.tsx logic)
  const answeredFactors = riskFactors?.filter(f => riskAnswers?.[f.id] !== undefined) ?? [];
  const riskScore = (() => {
    if (!riskFactors || !riskAnswers || answeredFactors.length === 0) return null;
    let total = 0, weight = 0;
    for (const f of answeredFactors) {
      const ans = riskAnswers[f.id];
      if (!ans) continue;
      const scoreMap = { yes: 0, partial: 50, no: 100 };
      total += scoreMap[ans] * f.weight;
      weight += f.weight;
    }
    return weight > 0 ? Math.round(total / weight) : null;
  })();

  const riskLevel = riskScore !== null
    ? riskScore >= 75 ? "low" : riskScore >= 50 ? "moderate" : riskScore >= 30 ? "high" : "critical"
    : null;

  const riskLevelConfig = {
    low:      { label: "Low Risk",      color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    moderate: { label: "Moderate Risk", color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
    high:     { label: "High Risk",     color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
    critical: { label: "Critical Risk", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
  };
  const rlConfig = riskLevel ? riskLevelConfig[riskLevel] : null;

  // Eligibility summary
  const eligibilityWithStatus = pathway?.eligibility.map(req => ({
    ...req,
    met: eligibilityChecks ? (eligibilityChecks[req.id] ?? null) : null,
  })) ?? [];

  // Refusal reasons with full data
  const selectedRefusalReasons = (refusalReasons ?? [])
    .map(id => refusalReasonData?.find(r => r.id === id))
    .filter(Boolean) as RefusalReason[];

  const outcomeInfo = outcome ? outcomeConfig[outcome] : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black">
        <div>
          <h2 className="text-sm font-bold text-white">Visa Application Report</h2>
          <p className="text-xs text-zinc-500">
            {countryName}{pathway ? ` — ${pathway.name}` : ""} · Generated {generatedAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-100 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-white/[0.10] text-zinc-500 hover:text-white hover:border-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable report body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="glass rounded-2xl border border-white/[0.10] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Visa Application Report</p>
                <h1 className="text-xl font-bold text-white mb-1">
                  {pathway ? pathway.name : `${countryName} Visa Plan`}
                </h1>
                {pathway?.subclass && (
                  <p className="text-sm text-zinc-500 mb-2">Subclass {pathway.subclass} · {countryName}</p>
                )}
                {pathway && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.08]">
                      <Clock className="w-3 h-3" /> {pathway.processingTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.08]">
                      <CalendarDays className="w-3 h-3" /> {pathway.validity}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.08]">
                      <DollarSign className="w-3 h-3" /> {pathway.cost}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-zinc-600">Generated</p>
                <p className="text-xs font-semibold text-zinc-400">{generatedAt}</p>
                {targetDate && (
                  <>
                    <p className="text-xs text-zinc-600 mt-2">Target lodgement</p>
                    <p className="text-xs font-semibold text-zinc-400">{fmt(targetDate)}</p>
                  </>
                )}
                {appReferenceNumber && (
                  <>
                    <p className="text-xs text-zinc-600 mt-2">Reference number</p>
                    <p className="text-xs font-semibold text-zinc-300">{appReferenceNumber}</p>
                  </>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 pt-5 border-t border-white/[0.07]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-500">{completedCount} of {checklist.length} checklist tasks completed</span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Step 1: Pathway overview ─────────────────────────────── */}
          {pathway && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold text-white">Step 1 — Pathway</h2>
                <span className="ml-auto text-xs text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                  {pathway.category}
                </span>
              </div>
              <div className="px-5 py-4 space-y-4">
                <p className="text-xs text-zinc-500 leading-relaxed">{pathway.summary}</p>

                {/* Eligibility requirements with self-assessed status */}
                {eligibilityWithStatus.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-zinc-400 mb-2">Eligibility requirements</p>
                    <div className="space-y-2">
                      {eligibilityWithStatus.map(req => (
                        <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="flex-shrink-0 mt-0.5">
                            {req.met === true ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : req.met === false ? (
                              <XCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-zinc-700" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn(
                                "text-xs font-semibold",
                                req.met === true ? "text-zinc-200" : req.met === false ? "text-red-300" : "text-zinc-400"
                              )}>
                                {req.label}
                              </span>
                              {req.required && (
                                <span className="text-[10px] font-bold text-red-400/80 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">
                                  Required
                                </span>
                              )}
                              {req.met === null && (
                                <span className="text-[10px] text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded-full border border-white/[0.06]">
                                  Not checked
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">{req.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pros & Cons */}
                {(pathway.pros.length > 0 || pathway.cons.length > 0) && (
                  <div className="grid grid-cols-2 gap-3">
                    {pathway.pros.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-emerald-400/80 mb-1.5">Pros</p>
                        <ul className="space-y-1">
                          {pathway.pros.map((p, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                              <span className="text-xs text-zinc-500 leading-relaxed">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pathway.cons.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-red-400/80 mb-1.5">Cons</p>
                        <ul className="space-y-1">
                          {pathway.cons.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                              <span className="text-xs text-zinc-500 leading-relaxed">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Risk assessment ──────────────────────────────── */}
          {riskFactors && riskAnswers && answeredFactors.length > 0 && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold text-white">Step 2 — Readiness Check</h2>
                {rlConfig && riskScore !== null && (
                  <span className={cn(
                    "ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full border",
                    rlConfig.color, rlConfig.bg, rlConfig.border
                  )}>
                    {rlConfig.label} · {riskScore}/100
                  </span>
                )}
              </div>

              {/* Risk score bar */}
              {riskScore !== null && rlConfig && (
                <div className="px-5 pt-4 pb-2">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-500">{answeredFactors.length} of {riskFactors.length} risk factors assessed</span>
                    <span className={cn("font-bold", rlConfig.color)}>{riskScore}/100</span>
                  </div>
                  <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", rlConfig.bg.replace("bg-", "bg-").replace("/10", "/60"))}
                      style={{ width: `${riskScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1.5">Higher score = lower risk</p>
                </div>
              )}

              {/* Risk factor answers */}
              <div className="divide-y divide-white/[0.05] px-5 pb-4 pt-2">
                {answeredFactors.map(factor => {
                  const ans = riskAnswers[factor.id];
                  const cfg = ans ? riskAnswerConfig[ans] : null;
                  return (
                    <div key={factor.id} className="py-3 flex items-start gap-3">
                      <div className={cn("w-2 h-2 rounded-full mt-1 flex-shrink-0", cfg?.dot ?? "bg-zinc-600")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-zinc-300">{factor.label}</span>
                          {cfg && (
                            <span className={cn("text-[10px] font-bold", cfg.color)}>{cfg.label}</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">{factor.description}</p>
                        {ans !== "no" && (
                          <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                            <span className="font-semibold text-zinc-400">Mitigation: </span>{factor.mitigation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Cost breakdown ───────────────────────────────── */}
          {(applicationFee || costItems.length > 0) && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Step 3 — Estimated Investment</h2>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {applicationFee && (
                  <div className="px-5 py-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Application fee (VAC)</span>
                    <span className="text-xs font-bold text-white">{applicationFee}</span>
                  </div>
                )}
                {costItems.map(item => (
                  <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 flex-1 mr-4">{item.title}</span>
                    <span className="text-xs font-semibold text-zinc-400 flex-shrink-0">{item.estimatedCost}</span>
                  </div>
                ))}
              </div>
              {totalEstimate > 0 && (
                <div className="px-5 py-3.5 bg-white/[0.03] border-t border-white/[0.07] flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Estimated total</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">AUD {totalEstimate.toLocaleString()}</span>
                    <span className="block text-xs text-zinc-600">+ ongoing living costs</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Checklist by category ───────────────────────── */}
          {byCategory.map(({ key, label, items }) => (
            <div key={key} className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-zinc-600" />
                  <h2 className="text-sm font-bold text-white">{label}</h2>
                </div>
                <span className="text-xs text-zinc-600">
                  {items.filter(i => completed.has(i.id)).length}/{items.length}
                </span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {items.map(item => {
                  const isDone = completed.has(item.id);
                  const dueDate = targetDate ? addWeeks(targetDate, item.dueWeeks) : null;
                  return (
                    <div key={item.id} className={cn("px-5 py-3.5 flex items-start gap-3", isDone && "opacity-50")}>
                      {isDone
                        ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        : <Circle className="w-4 h-4 text-zinc-700 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold mb-0.5", isDone ? "line-through text-zinc-600" : "text-white")}>
                          {item.title}
                        </p>
                        <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                        {item.link && (
                          <p className="text-xs text-blue-400/70 mt-0.5 truncate">{item.link}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1 ml-3">
                        {item.estimatedCost && (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            {item.estimatedCost}
                          </span>
                        )}
                        {dueDate && (
                          <span className="text-xs text-zinc-600 whitespace-nowrap">{fmt(dueDate)}</span>
                        )}
                        {item.priority === "critical" && !isDone && (
                          <span className="text-[10px] font-bold text-red-400/80 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20 whitespace-nowrap">
                            Critical
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ── Step 4: Application status ───────────────────────────── */}
          {outcome && outcomeInfo && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold text-white">Step 4 — Application Status</h2>
              </div>
              <div className="px-5 py-4 space-y-4">
                {/* Status badge */}
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm",
                  outcomeInfo.color, outcomeInfo.bg, outcomeInfo.border
                )}>
                  {outcomeInfo.icon}
                  {outcomeInfo.label}
                </div>

                {appReferenceNumber && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-xs text-zinc-500">Application reference:</span>
                    <span className="text-xs font-bold text-white font-mono">{appReferenceNumber}</span>
                  </div>
                )}

                {/* Refusal reasons */}
                {outcome === "refused" && selectedRefusalReasons.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-red-400/80 mb-2">Refusal reasons identified</p>
                    <div className="space-y-3">
                      {selectedRefusalReasons.map((reason, ri) => (
                        <div key={reason.id} className="p-3 rounded-xl bg-red-500/[0.05] border border-red-500/20">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-black text-red-400 flex-shrink-0">
                              {ri + 1}
                            </span>
                            <span className="text-xs font-bold text-zinc-300">{reason.title}</span>
                            {reason.code && (
                              <span className="text-[10px] text-red-400/60 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20 ml-auto">
                                {reason.code}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed mb-2 pl-7">{reason.description}</p>
                          {reason.solutions.length > 0 && (
                            <div className="pl-7">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Solutions</p>
                              <ul className="space-y-1">
                                {reason.solutions.map((sol, si) => (
                                  <li key={si} className="flex items-start gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                    <span className="text-xs text-zinc-500 leading-relaxed">{sol}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved congratulations */}
                {outcome === "approved" && (
                  <div className="p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-300">Congratulations!</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Your visa has been granted. Keep this report as a record of your successful application journey.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Disclaimer ──────────────────────────────────────────── */}
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300/80 leading-relaxed">
              This report is generated from VisaSwitch and is indicative only. Requirements, fees, and processing times change regularly. Always verify current information with the official immigration authority before lodging.
            </p>
          </div>

          <p className="text-center text-xs text-zinc-700 pb-4">
            Generated by VisaSwitch · visaswitch.com · {generatedAt}
          </p>
        </div>
      </div>
    </div>
  );
}
