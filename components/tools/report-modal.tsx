"use client";
import { useEffect, useCallback } from "react";
import {
  X, Printer, CheckCircle, Circle, Clock, DollarSign, CalendarDays,
  Shield, FileCheck, AlertCircle, XCircle, AlertTriangle, BarChart3,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VisaPathway, ChecklistItem, RiskFactor, RefusalReason } from "@/types";
import type { ApplicationOutcome } from "@/hooks/use-outcome";

interface Props {
  pathway: VisaPathway | null;
  countryName: string;
  countryCode: string;
  checklist: ChecklistItem[];
  completed: Set<string>;
  lodgementDate: string;
  totalEstimate: number;
  applicationFee: string | null;
  eligibilityChecks?: Record<string, boolean>;
  riskAnswers?: Record<string, "yes" | "no" | "partial">;
  riskFactors?: RiskFactor[];
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

const outcomeLabels: Record<ApplicationOutcome, string> = {
  preparing: "Preparing — gathering documents",
  applied:   "Application lodged — under assessment",
  rfi:       "Further information requested",
  approved:  "Approved — visa granted",
  refused:   "Refused",
};

// ── Build standalone print HTML ───────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildPrintHtml(props: Omit<Props, "onClose">): string {
  const {
    pathway, countryName, checklist, completed, lodgementDate,
    totalEstimate, applicationFee, eligibilityChecks, riskAnswers,
    riskFactors, outcome, appReferenceNumber, refusalReasons, refusalReasonData,
  } = props;

  const targetDate = lodgementDate ? new Date(lodgementDate) : null;
  const generatedAt = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const byCategory = Object.entries(categoryConfig).map(([key, cfg]) => ({
    key, label: cfg.label,
    items: checklist.filter(i => i.category === key),
  })).filter(g => g.items.length > 0);

  const completedCount = checklist.filter(i => completed.has(i.id)).length;
  const progress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;
  const costItems = checklist.filter(i => i.estimatedCost && i.estimatedCostNumeric);

  const answeredFactors = riskFactors?.filter(f => riskAnswers?.[f.id] !== undefined) ?? [];
  const riskScore = (() => {
    if (!riskFactors || !riskAnswers || answeredFactors.length === 0) return null;
    let total = 0, weight = 0;
    for (const f of answeredFactors) {
      const ans = riskAnswers[f.id];
      if (!ans) continue;
      total += { yes: 0, partial: 50, no: 100 }[ans] * f.weight;
      weight += f.weight;
    }
    return weight > 0 ? Math.round(total / weight) : null;
  })();
  const riskLevel = riskScore !== null
    ? riskScore >= 75 ? "Low Risk" : riskScore >= 50 ? "Moderate Risk" : riskScore >= 30 ? "High Risk" : "Critical Risk"
    : null;

  const eligibilityWithStatus = pathway?.eligibility.map(req => ({
    ...req, met: eligibilityChecks ? (eligibilityChecks[req.id] ?? null) : null,
  })) ?? [];

  const selectedRefusalReasons = (refusalReasons ?? [])
    .map(id => refusalReasonData?.find(r => r.id === id))
    .filter(Boolean) as RefusalReason[];

  const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4; margin: 2cm 2cm 2.5cm 2cm; }
    @media print { .print-bar { display: none !important; } }
    .print-bar {
      position: sticky; top: 0; z-index: 100;
      background: #111; color: #fff; padding: 10px 20px;
      display: flex; align-items: center; justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 13px;
    }
    .print-bar span { opacity: .7; font-size: 12px; }
    .print-btn {
      background: #fff; color: #111; border: none; border-radius: 8px;
      padding: 7px 18px; font-size: 13px; font-weight: 700; cursor: pointer;
    }
    .print-btn:hover { background: #e5e5e5; }
    .report-body { max-width: 800px; margin: 0 auto; padding: 32px 24px 60px; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 10pt; line-height: 1.5; color: #111; background: #fff;
    }
    h1 { font-size: 22pt; font-weight: 800; line-height: 1.2; margin-bottom: 6pt; }
    h2 { font-size: 12pt; font-weight: 800; margin: 0; }
    p  { margin-bottom: 8pt; }

    /* Cover */
    .cover { border-bottom: 2pt solid #111; padding-bottom: 16pt; margin-bottom: 24pt; }
    .eyebrow { font-size: 7pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #888; margin-bottom: 4pt; }
    .cover-sub { font-size: 10pt; color: #555; margin-bottom: 14pt; }
    .meta-grid { display: flex; flex-wrap: wrap; gap: 20pt; }
    .meta-item .label { font-size: 8pt; color: #888; }
    .meta-item .value { font-weight: 600; font-size: 9pt; }
    .progress-wrap { margin-top: 14pt; }
    .progress-label { display: flex; justify-content: space-between; font-size: 9pt; color: #555; margin-bottom: 4pt; }
    .progress-track { height: 6pt; background: #e5e7eb; border-radius: 3pt; overflow: hidden; }
    .progress-fill  { height: 100%; background: #111; border-radius: 3pt; }

    /* Sections */
    .section { margin-top: 24pt; page-break-inside: avoid; }
    .section-header {
      display: flex; align-items: center; gap: 8pt;
      border-bottom: 1.5pt solid #111; padding-bottom: 6pt; margin-bottom: 12pt;
    }
    .step-num {
      width: 18pt; height: 18pt; border-radius: 50%;
      background: #111; color: #fff;
      font-size: 8pt; font-weight: 800;
      display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .badge {
      margin-left: auto; font-size: 8pt; font-weight: 700;
      padding: 2pt 8pt; border-radius: 20pt;
      border: 1pt solid #ccc; color: #555;
    }
    .summary { font-size: 9.5pt; color: #444; line-height: 1.6; margin-bottom: 12pt; }
    .sub-label {
      font-size: 8pt; font-weight: 700; letter-spacing: .06em;
      text-transform: uppercase; color: #555; margin: 12pt 0 6pt;
    }

    /* Tables */
    table { width: 100%; border-collapse: collapse; font-size: 9pt; }
    td, th { padding: 5pt 4pt; vertical-align: top; }
    .divider-row td { border-bottom: .5pt solid #e5e7eb; }

    /* Eligibility */
    .req-status { width: 16pt; text-align: center; font-weight: 800; }
    .met    { color: #16a34a; }
    .notmet { color: #dc2626; }
    .unk    { color: #9ca3af; }
    .req-name { font-weight: 600; }
    .req-desc { color: #666; font-size: 8.5pt; margin-top: 1pt; }
    .badge-req {
      display: inline-block; font-size: 7pt; font-weight: 700;
      padding: 1pt 5pt; border-radius: 10pt;
      border: .5pt solid #fca5a5; color: #b91c1c; background: #fef2f2; margin-left: 4pt;
    }

    /* Pros/cons */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin-top: 10pt; }
    ul.plain { list-style: none; }
    ul.plain li { display: flex; gap: 6pt; align-items: flex-start; margin-bottom: 4pt; font-size: 9pt; color: #444; }
    .dot { width: 5pt; height: 5pt; border-radius: 50%; margin-top: 4pt; flex-shrink: 0; }
    .dot-green { background: #16a34a; }
    .dot-red   { background: #dc2626; }
    .dot-gray  { background: #6b7280; }

    /* Risk */
    .risk-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10pt; gap: 16pt; }
    .risk-score-big { font-size: 20pt; font-weight: 800; }
    .risk-level { font-size: 9pt; font-weight: 700; color: #555; margin-top: 1pt; }
    .risk-desc  { font-size: 9pt; color: #555; max-width: 280pt; }
    .ans-yes     { color: #dc2626; font-weight: 700; }
    .ans-partial { color: #d97706; font-weight: 700; }
    .ans-no      { color: #16a34a; font-weight: 700; }
    .risk-name   { font-weight: 600; }
    .risk-desc-text { color: #666; font-size: 8.5pt; margin-top: 1pt; }
    .mitigation  { color: #555; font-size: 8.5pt; font-style: italic; margin-top: 3pt; }

    /* Costs */
    .cost-right  { text-align: right; font-weight: 600; }
    .cost-total td { border-top: 1.5pt solid #111 !important; font-weight: 800; font-size: 11pt; padding-top: 8pt; }

    /* Checklist */
    .cat-header { font-size: 9pt; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #555; border-bottom: .5pt solid #e5e7eb; padding-bottom: 4pt; margin: 14pt 0 6pt; }
    .check-done  { color: #16a34a; font-weight: 800; text-align: center; width: 14pt; }
    .check-open  { color: #d1d5db; text-align: center; width: 14pt; }
    .item-done   { text-decoration: line-through; color: #9ca3af; font-weight: 600; }
    .item-title  { font-weight: 600; }
    .item-desc   { color: #666; font-size: 8.5pt; margin-top: 1pt; }
    .item-link   { color: #2563eb; font-size: 8pt; }
    .item-meta   { text-align: right; white-space: nowrap; font-size: 8pt; color: #6b7280; }
    .badge-critical { font-size: 7pt; font-weight: 700; padding: 1pt 5pt; border-radius: 10pt; border: .5pt solid #fca5a5; color: #b91c1c; background: #fef2f2; }
    .badge-cost  { font-size: 8pt; font-weight: 600; color: #059669; }

    /* Status */
    .status-box { border: 1.5pt solid #111; border-radius: 6pt; padding: 10pt 14pt; margin-bottom: 12pt; }
    .status-label { font-size: 8pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #888; margin-bottom: 3pt; }
    .status-value { font-size: 13pt; font-weight: 800; }
    .approved-box { border: 1.5pt solid #16a34a; border-radius: 6pt; padding: 12pt 14pt; background: #f0fdf4; }
    .approved-title { font-weight: 800; color: #15803d; font-size: 12pt; margin-bottom: 4pt; }
    .approved-desc  { color: #166534; font-size: 9pt; }
    .refusal-item { margin-top: 10pt; padding: 8pt 10pt; border-left: 3pt solid #dc2626; background: #fef2f2; page-break-inside: avoid; }
    .refusal-title { font-weight: 700; font-size: 10pt; }
    .refusal-desc  { color: #555; font-size: 9pt; margin: 4pt 0 6pt; }
    .sols-label    { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #555; margin-bottom: 4pt; }

    /* Disclaimer */
    .disclaimer { margin-top: 28pt; padding: 10pt 12pt; border: 1pt solid #fbbf24; border-radius: 6pt; background: #fffbeb; font-size: 8.5pt; color: #92400e; line-height: 1.5; page-break-inside: avoid; }
    .footer { margin-top: 16pt; border-top: .5pt solid #e5e7eb; padding-top: 8pt; font-size: 8pt; color: #9ca3af; display: flex; justify-content: space-between; }
  `;

  // ── Cover ────────────────────────────────────────────────────────────────
  let body = `
  <div class="cover">
    <div class="eyebrow">VisaSwitch &middot; Visa Application Report</div>
    <h1>${esc(pathway ? pathway.name : `${countryName} Visa Guide`)}</h1>
    <div class="cover-sub">${pathway?.subclass ? `Subclass ${pathway.subclass} &middot; ` : ""}${esc(countryName)}</div>
    <div class="meta-grid">
      <div class="meta-item"><div class="label">Generated</div><div class="value">${esc(generatedAt)}</div></div>
      ${targetDate ? `<div class="meta-item"><div class="label">Target lodgement</div><div class="value">${esc(fmt(targetDate))}</div></div>` : ""}
      ${appReferenceNumber ? `<div class="meta-item"><div class="label">Reference number</div><div class="value">${esc(appReferenceNumber)}</div></div>` : ""}
      ${pathway ? `
        <div class="meta-item"><div class="label">Processing time</div><div class="value">${esc(pathway.processingTime)}</div></div>
        <div class="meta-item"><div class="label">Validity</div><div class="value">${esc(pathway.validity)}</div></div>
        <div class="meta-item"><div class="label">Application fee</div><div class="value">${esc(pathway.cost)}</div></div>
      ` : ""}
    </div>
    <div class="progress-wrap">
      <div class="progress-label"><span>Checklist: ${completedCount} of ${checklist.length} tasks completed</span><span>${progress}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
    </div>
  </div>`;

  // ── Step 1: Pathway ──────────────────────────────────────────────────────
  if (pathway) {
    body += `
    <div class="section">
      <div class="section-header">
        <span class="step-num">1</span>
        <h2>Find Pathway &mdash; ${esc(pathway.name)}</h2>
        <span class="badge">${esc(pathway.category)}</span>
      </div>
      <p class="summary">${esc(pathway.summary)}</p>`;

    if (eligibilityWithStatus.length > 0) {
      body += `<div class="sub-label">Eligibility requirements</div>
      <table>
        <tbody>
          ${eligibilityWithStatus.map(req => `
          <tr class="divider-row">
            <td class="req-status">${req.met === true ? `<span class="met">&#10003;</span>` : req.met === false ? `<span class="notmet">&#10007;</span>` : `<span class="unk">&ndash;</span>`}</td>
            <td>
              <div class="req-name">${esc(req.label)}${req.required ? `<span class="badge-req">Required</span>` : ""}${req.met === null ? ` <span style="font-size:8pt;color:#9ca3af">(not checked)</span>` : ""}</div>
              <div class="req-desc">${esc(req.description)}</div>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>`;
    }

    if (pathway.pros.length > 0 || pathway.cons.length > 0) {
      body += `<div class="two-col" style="margin-top:12pt">`;
      if (pathway.pros.length > 0) {
        body += `<div><div class="sub-label" style="margin-top:0">Advantages</div><ul class="plain">${pathway.pros.map(p => `<li><span class="dot dot-green"></span>${esc(p)}</li>`).join("")}</ul></div>`;
      }
      if (pathway.cons.length > 0) {
        body += `<div><div class="sub-label" style="margin-top:0">Limitations</div><ul class="plain">${pathway.cons.map(c => `<li><span class="dot dot-red"></span>${esc(c)}</li>`).join("")}</ul></div>`;
      }
      body += `</div>`;
    }

    if (pathway.nextSteps.length > 0) {
      body += `<div class="sub-label">Official next steps</div><ul class="plain">${pathway.nextSteps.map(s => `<li><span class="dot dot-gray"></span>${esc(s)}</li>`).join("")}</ul>`;
    }

    body += `</div>`;
  }

  // ── Step 2: Risk assessment ──────────────────────────────────────────────
  if (riskFactors && riskAnswers && answeredFactors.length > 0) {
    const riskDesc = riskScore !== null
      ? riskScore >= 75 ? "Your application profile looks strong. Proceed with document preparation."
        : riskScore >= 50 ? "Some risk factors identified. Address the recommendations before lodging."
          : riskScore >= 30 ? "Significant risk factors detected. Strongly recommended to address these first."
            : "One or more critical issues detected. High probability of refusal — seek expert advice."
      : "";

    body += `
    <div class="section">
      <div class="section-header">
        <span class="step-num">2</span>
        <h2>Check Readiness &mdash; Risk Assessment</h2>
        ${riskScore !== null ? `<span class="badge">${esc(riskLevel ?? "")} &middot; ${riskScore}/100</span>` : ""}
      </div>
      ${riskScore !== null ? `
      <div class="risk-header">
        <div><div class="risk-score-big">${riskScore}/100</div><div class="risk-level">${esc(riskLevel ?? "")} &middot; ${answeredFactors.length} of ${riskFactors.length} factors assessed</div></div>
        <div class="risk-desc">${esc(riskDesc)}</div>
      </div>` : ""}
      <div class="sub-label">Risk factor answers</div>
      <table>
        <tbody>
          ${answeredFactors.map(factor => {
            const ans = riskAnswers[factor.id];
            const ansLabel = ans === "yes" ? `<span class="ans-yes">&#9888; Yes</span>` : ans === "partial" ? `<span class="ans-partial">&#9711; Partially</span>` : `<span class="ans-no">&#10003; No</span>`;
            return `
          <tr class="divider-row">
            <td style="width:70pt">${ansLabel}</td>
            <td>
              <div class="risk-name">${esc(factor.label)}</div>
              <div class="risk-desc-text">${esc(factor.description)}</div>
              ${ans !== "no" ? `<div class="mitigation">Mitigation: ${esc(factor.mitigation)}</div>` : ""}
            </td>
          </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
  }

  // ── Step 3a: Costs ───────────────────────────────────────────────────────
  if (applicationFee || costItems.length > 0) {
    body += `
    <div class="section">
      <div class="section-header">
        <span class="step-num">3</span>
        <h2>Build Your Plan &mdash; Estimated Costs</h2>
      </div>
      <table>
        <tbody>
          ${applicationFee ? `<tr class="divider-row"><td>Application fee (VAC)</td><td class="cost-right">${esc(applicationFee)}</td></tr>` : ""}
          ${costItems.map(item => `<tr class="divider-row"><td>${esc(item.title)}</td><td class="cost-right">${esc(item.estimatedCost ?? "")}</td></tr>`).join("")}
          ${totalEstimate > 0 ? `<tr class="cost-total"><td>Estimated total (excluding ongoing living costs)</td><td class="cost-right">AUD ${totalEstimate.toLocaleString()}</td></tr>` : ""}
        </tbody>
      </table>
    </div>`;
  }

  // ── Step 3b: Checklist ───────────────────────────────────────────────────
  if (byCategory.length > 0) {
    const hasOwnHeader = !(applicationFee || costItems.length > 0);
    body += `<div class="section">`;
    if (hasOwnHeader) {
      body += `<div class="section-header"><span class="step-num">3</span><h2>Build Your Plan &mdash; Action Checklist</h2><span class="badge">${completedCount}/${checklist.length} done</span></div>`;
    } else {
      body += `<div class="sub-label" style="margin-top:16pt">Action checklist &mdash; ${completedCount}/${checklist.length} tasks completed</div>`;
    }

    body += byCategory.map(({ label, items }) => {
      const doneInCat = items.filter(i => completed.has(i.id)).length;
      return `
      <div class="cat-header">${esc(label)} &mdash; ${doneInCat}/${items.length}</div>
      <table>
        <tbody>
          ${items.map(item => {
            const isDone = completed.has(item.id);
            const dueDate = targetDate ? addWeeks(targetDate, item.dueWeeks) : null;
            return `
          <tr class="divider-row">
            <td class="${isDone ? "check-done" : "check-open"}">${isDone ? "&#10003;" : "&#9675;"}</td>
            <td>
              <div class="${isDone ? "item-done" : "item-title"}">${esc(item.title)}${item.priority === "critical" && !isDone ? ` <span class="badge-critical">Critical</span>` : ""}</div>
              <div class="item-desc">${esc(item.description)}</div>
              ${item.link ? `<div class="item-link">${esc(item.link)}</div>` : ""}
            </td>
            <td class="item-meta">
              ${item.estimatedCost ? `<div class="badge-cost">${esc(item.estimatedCost)}</div>` : ""}
              ${dueDate ? `<div>${esc(fmt(dueDate))}</div>` : ""}
            </td>
          </tr>`;
          }).join("")}
        </tbody>
      </table>`;
    }).join("");

    body += `</div>`;
  }

  // ── Step 4: Application status ───────────────────────────────────────────
  if (outcome) {
    body += `
    <div class="section">
      <div class="section-header">
        <span class="step-num">4</span>
        <h2>Track &amp; Submit &mdash; Application Status</h2>
      </div>
      <div class="status-box">
        <div class="status-label">Current status</div>
        <div class="status-value">${esc(outcomeLabels[outcome])}</div>
        ${appReferenceNumber ? `<p style="margin-top:6pt;font-size:9pt;color:#555">Reference: <strong>${esc(appReferenceNumber)}</strong></p>` : ""}
        ${targetDate ? `<p style="font-size:9pt;color:#555">Target lodgement: <strong>${esc(fmt(targetDate))}</strong></p>` : ""}
      </div>`;

    if (outcome === "approved") {
      body += `
      <div class="approved-box">
        <div class="approved-title">&#10003; Visa Approved &mdash; Congratulations!</div>
        <div class="approved-desc">Your visa has been granted. Keep this report as a record of your successful application journey with VisaSwitch.</div>
      </div>`;
    }

    if (outcome === "refused" && selectedRefusalReasons.length > 0) {
      body += `<div class="sub-label">Identified refusal reasons &amp; recovery plan</div>`;
      body += selectedRefusalReasons.map((reason, ri) => `
      <div class="refusal-item">
        <div class="refusal-title">${ri + 1}. ${esc(reason.title)}${reason.code ? ` (${esc(reason.code)})` : ""}</div>
        <div class="refusal-desc">${esc(reason.description)}</div>
        ${reason.solutions.length > 0 ? `
        <div class="sols-label">How to fix this</div>
        <ul class="plain">${reason.solutions.map(sol => `<li><span class="dot dot-green"></span>${esc(sol)}</li>`).join("")}</ul>` : ""}
      </div>`).join("");
    }

    body += `</div>`;
  }

  // ── Disclaimer + footer ──────────────────────────────────────────────────
  body += `
  <div class="disclaimer">
    <strong>Important notice:</strong> This report is generated by VisaSwitch and is indicative only.
    Immigration requirements, fees, processing times, and policies change regularly.
    This is not legal advice. Always verify all information with the official immigration authority
    before lodging an application. Consider engaging a registered migration agent for complex cases.
  </div>
  <div class="footer">
    <span>Generated by VisaSwitch &middot; visaswitch.com</span>
    <span>${esc(generatedAt)}</span>
  </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Visa Application Report &mdash; ${esc(pathway ? pathway.name : countryName)}</title>
  <style>${css}</style>
</head>
<body>
  <div class="print-bar">
    <span>VisaSwitch &mdash; Visa Application Report</span>
    <button class="print-btn" onclick="window.print()">&#128438; Save as PDF</button>
  </div>
  <div class="report-body">${body}</div>
</body>
</html>`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReportModal({
  pathway, countryName, countryCode, checklist, completed,
  lodgementDate, totalEstimate, applicationFee,
  eligibilityChecks, riskAnswers, riskFactors,
  outcome, appReferenceNumber, refusalReasons, refusalReasonData,
  onClose,
}: Props) {
  void countryCode;

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const targetDate = lodgementDate ? new Date(lodgementDate) : null;
  const generatedAt = new Date().toLocaleDateString("en-AU", {
    day: "numeric", month: "long", year: "numeric",
  });

  const byCategory = Object.entries(categoryConfig).map(([key, cfg]) => ({
    key, label: cfg.label,
    items: checklist.filter(i => i.category === key),
  })).filter(g => g.items.length > 0);

  const completedCount = checklist.filter(i => completed.has(i.id)).length;
  const progress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;
  const costItems = checklist.filter(i => i.estimatedCost && i.estimatedCostNumeric);

  const answeredFactors = riskFactors?.filter(f => riskAnswers?.[f.id] !== undefined) ?? [];
  const riskScore = (() => {
    if (!riskFactors || !riskAnswers || answeredFactors.length === 0) return null;
    let total = 0, weight = 0;
    for (const f of answeredFactors) {
      const ans = riskAnswers[f.id];
      if (!ans) continue;
      total += { yes: 0, partial: 50, no: 100 }[ans] * f.weight;
      weight += f.weight;
    }
    return weight > 0 ? Math.round(total / weight) : null;
  })();
  const riskLevel = riskScore !== null
    ? riskScore >= 75 ? "Low Risk" : riskScore >= 50 ? "Moderate Risk" : riskScore >= 30 ? "High Risk" : "Critical Risk"
    : null;

  const eligibilityWithStatus = pathway?.eligibility.map(req => ({
    ...req, met: eligibilityChecks ? (eligibilityChecks[req.id] ?? null) : null,
  })) ?? [];

  const selectedRefusalReasons = (refusalReasons ?? [])
    .map(id => refusalReasonData?.find(r => r.id === id))
    .filter(Boolean) as RefusalReason[];

  const handlePrint = useCallback(() => {
    const html = buildPrintHtml({
      pathway, countryName, countryCode, checklist, completed,
      lodgementDate, totalEstimate, applicationFee,
      eligibilityChecks, riskAnswers, riskFactors,
      outcome, appReferenceNumber, refusalReasons, refusalReasonData,
    });
    // Open as a tab (no size params = tab, not popup — avoids Safari popup blocker)
    const win = window.open("", "_blank");
    if (!win) {
      // Fallback: blob download
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visa-report-${countryCode}.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    // Give the page a moment to render, then trigger print
    setTimeout(() => { win.print(); }, 500);
  }, [
    pathway, countryName, countryCode, checklist, completed,
    lodgementDate, totalEstimate, applicationFee,
    eligibilityChecks, riskAnswers, riskFactors,
    outcome, appReferenceNumber, refusalReasons, refusalReasonData,
  ]);

  return (
    <div className="dark-surface fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
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
            onClick={handlePrint}
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

      {/* Scrollable preview */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

          {/* Header */}
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
                    <p className="text-xs text-zinc-600 mt-2">Reference</p>
                    <p className="text-xs font-semibold text-zinc-300">{appReferenceNumber}</p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-white/[0.07]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-500">{completedCount} of {checklist.length} checklist tasks completed</span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Step 1 */}
          {pathway && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold text-white">Step 1 — Pathway</h2>
                <span className="ml-auto text-xs text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">{pathway.category}</span>
              </div>
              <div className="px-5 py-4 space-y-4">
                <p className="text-xs text-zinc-500 leading-relaxed">{pathway.summary}</p>
                {eligibilityWithStatus.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-zinc-400 mb-2">Eligibility requirements</p>
                    <div className="space-y-2">
                      {eligibilityWithStatus.map(req => (
                        <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="flex-shrink-0 mt-0.5">
                            {req.met === true ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                              : req.met === false ? <XCircle className="w-4 h-4 text-red-400" />
                                : <Circle className="w-4 h-4 text-zinc-700" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn("text-xs font-semibold", req.met === true ? "text-zinc-200" : req.met === false ? "text-red-300" : "text-zinc-400")}>{req.label}</span>
                              {req.required && <span className="text-[10px] font-bold text-red-400/80 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">Required</span>}
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed mt-0.5">{req.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(pathway.pros.length > 0 || pathway.cons.length > 0) && (
                  <div className="grid grid-cols-2 gap-3">
                    {pathway.pros.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-emerald-400/80 mb-1.5">Advantages</p>
                        <ul className="space-y-1">{pathway.pros.map((p, i) => <li key={i} className="flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" /><span className="text-xs text-zinc-500 leading-relaxed">{p}</span></li>)}</ul>
                      </div>
                    )}
                    {pathway.cons.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-red-400/80 mb-1.5">Limitations</p>
                        <ul className="space-y-1">{pathway.cons.map((c, i) => <li key={i} className="flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" /><span className="text-xs text-zinc-500 leading-relaxed">{c}</span></li>)}</ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {riskFactors && riskAnswers && answeredFactors.length > 0 && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold text-white">Step 2 — Readiness Check</h2>
                {riskScore !== null && riskLevel && (
                  <span className="ml-auto text-xs font-bold text-zinc-300 bg-white/[0.06] px-2.5 py-0.5 rounded-full border border-white/[0.10]">
                    {riskLevel} · {riskScore}/100
                  </span>
                )}
              </div>
              <div className="divide-y divide-white/[0.05] px-5 py-2">
                {answeredFactors.map(factor => {
                  const ans = riskAnswers[factor.id];
                  return (
                    <div key={factor.id} className="py-3 flex items-start gap-3">
                      <span className={cn("text-xs font-bold flex-shrink-0 w-16", ans === "yes" ? "text-red-400" : ans === "partial" ? "text-amber-400" : "text-emerald-400")}>
                        {ans === "yes" ? "Yes" : ans === "partial" ? "Partially" : "No"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-zinc-300">{factor.label}</span>
                        <p className="text-xs text-zinc-600 mt-0.5">{factor.description}</p>
                        {ans !== "no" && <p className="text-xs text-zinc-500 mt-1 italic">{factor.mitigation}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 cost */}
          {(applicationFee || costItems.length > 0) && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Step 3 — Estimated Investment</h2>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {applicationFee && <div className="px-5 py-3 flex justify-between"><span className="text-xs font-semibold text-zinc-300">Application fee (VAC)</span><span className="text-xs font-bold text-white">{applicationFee}</span></div>}
                {costItems.map(item => <div key={item.id} className="px-5 py-3 flex justify-between"><span className="text-xs text-zinc-500 flex-1 mr-4">{item.title}</span><span className="text-xs font-semibold text-zinc-400">{item.estimatedCost}</span></div>)}
              </div>
              {totalEstimate > 0 && (
                <div className="px-5 py-3.5 bg-white/[0.03] border-t border-white/[0.07] flex justify-between">
                  <span className="text-xs font-bold text-white">Estimated total</span>
                  <div className="text-right"><span className="text-sm font-bold text-white">AUD {totalEstimate.toLocaleString()}</span><span className="block text-xs text-zinc-600">+ ongoing living costs</span></div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 checklist */}
          {byCategory.map(({ key, label, items }) => (
            <div key={key} className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
                <div className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-zinc-600" /><h2 className="text-sm font-bold text-white">{label}</h2></div>
                <span className="text-xs text-zinc-600">{items.filter(i => completed.has(i.id)).length}/{items.length}</span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {items.map(item => {
                  const isDone = completed.has(item.id);
                  const dueDate = targetDate ? addWeeks(targetDate, item.dueWeeks) : null;
                  return (
                    <div key={item.id} className={cn("px-5 py-3.5 flex items-start gap-3", isDone && "opacity-50")}>
                      {isDone ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> : <Circle className="w-4 h-4 text-zinc-700 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold mb-0.5", isDone ? "line-through text-zinc-600" : "text-white")}>{item.title}</p>
                        <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                        {item.link && <p className="text-xs text-blue-400/70 mt-0.5 truncate">{item.link}</p>}
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1 ml-3">
                        {item.estimatedCost && <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{item.estimatedCost}</span>}
                        {dueDate && <span className="text-xs text-zinc-600 whitespace-nowrap">{fmt(dueDate)}</span>}
                        {item.priority === "critical" && !isDone && <span className="text-[10px] font-bold text-red-400/80 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">Critical</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Step 4 */}
          {outcome && (
            <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
                <Info className="w-4 h-4 text-zinc-500" />
                <h2 className="text-sm font-bold text-white">Step 4 — Application Status</h2>
              </div>
              <div className="px-5 py-4 space-y-4">
                <p className="text-sm font-semibold text-white">{outcomeLabels[outcome]}</p>
                {appReferenceNumber && <p className="text-xs text-zinc-400">Reference: <span className="font-mono font-bold text-white">{appReferenceNumber}</span></p>}
                {outcome === "approved" && (
                  <div className="p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25">
                    <p className="text-sm font-bold text-emerald-300 mb-1">Congratulations!</p>
                    <p className="text-xs text-zinc-400">Your visa has been granted.</p>
                  </div>
                )}
                {outcome === "refused" && selectedRefusalReasons.length > 0 && (
                  <div className="space-y-3">
                    {selectedRefusalReasons.map((reason, ri) => (
                      <div key={reason.id} className="p-3 rounded-xl bg-red-500/[0.05] border border-red-500/20">
                        <p className="text-xs font-bold text-zinc-300">{ri + 1}. {reason.title}</p>
                        <p className="text-xs text-zinc-500 mt-1">{reason.description}</p>
                        <ul className="mt-2 space-y-1">{reason.solutions.map((sol, si) => <li key={si} className="flex items-start gap-1.5"><div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" /><span className="text-xs text-zinc-500">{sol}</span></li>)}</ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300/80 leading-relaxed">
              This report is indicative only. Always verify with the official immigration authority before lodging. This is not legal advice.
            </p>
          </div>

          <p className="text-center text-xs text-zinc-700 pb-4">Generated by VisaSwitch · visaswitch.com · {generatedAt}</p>
        </div>
      </div>
    </div>
  );
}
