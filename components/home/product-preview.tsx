"use client";

import { useState } from "react";
import {
  Globe,
  Shield,
  ListChecks,
  SendHorizonal,
  CheckCircle,
  Circle,
  Clock,
  DollarSign,
  Calendar,
  CheckSquare,
  Square,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  Target,
  ExternalLink,
  FileText,
  Lock,
  ClipboardList,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: 1, label: "Find Pathway",    sublabel: "Pick the right visa",     icon: Globe },
  { id: 2, label: "Check Readiness", sublabel: "Eligibility & risk",      icon: Shield },
  { id: 3, label: "Build Your Plan", sublabel: "Timeline & checklist",    icon: ListChecks },
  { id: 4, label: "Track & Submit",  sublabel: "Application status",      icon: SendHorizonal },
] as const;

// ── Step 1 preview — exact match to Step1FindPathway ────────────────────────

function Step1Preview() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Find Your Pathway</h2>
        <p className="text-sm text-zinc-500">Tell us where you are now and where you want to go — we&apos;ll rank every available pathway instantly.</p>
      </div>

      {/* Selectors */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-black text-[10px] font-black">1</span>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Your current visa</label>
          </div>
          <div className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between">
            <span>Student Visa — Subclass 500</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-black">2</span>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Your goal</label>
          </div>
          <div className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between">
            <span>Extend my stay — Keep living in Australia</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500">Showing <span className="text-white font-semibold">6</span> of 14 pathways relevant to your selection</p>

      {/* Best match card — exact BestMatchCard style */}
      <div className="rounded-2xl border overflow-hidden relative border-white/[0.22] bg-white/[0.05]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <div className="px-6 py-3 border-b border-white/[0.08] flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Your best match</span>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/20">Moderate</span>
        </div>
        <div className="px-7 pt-7 pb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-500/20 border border-amber-500/30">
              <Globe className="w-6 h-6 text-amber-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-500 mb-0.5">Subclass 189</div>
              <h2 className="text-xl font-bold text-white leading-tight">Skilled Independent Visa</h2>
              <p className="text-sm text-zinc-400 mt-1 leading-relaxed">Australia&apos;s most prestigious PR — no employer, no state sponsor needed</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Clock, label: "Processing", value: "6–18 months after invitation" },
              { icon: Calendar, label: "Validity", value: "Permanent" },
              { icon: DollarSign, label: "Govt fee", value: "AUD 4,640" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                    <span className="text-xs text-zinc-500">{stat.label}</span>
                  </div>
                  <span className="text-xs font-bold text-white leading-snug block">{stat.value}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-start gap-2 bg-amber-500/[0.07] border border-amber-500/25 rounded-xl px-4 py-3 mb-5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/90 leading-relaxed">Current invitation rounds are highly competitive — check the latest cut-off points before investing in a skills assessment.</p>
          </div>
        </div>
      </div>

      {/* Secondary cards — SecondaryCard collapsed style */}
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Also consider <span className="font-normal text-zinc-600 normal-case tracking-normal">— 5 other options</span></p>
        <div className="space-y-2">
          {[
            { sub: "491", name: "Skilled Work Regional (Provisional)", tagline: "Lower cut-off, 15 bonus points, and a clear path to PR via regional Australia", diff: "Moderate", diffColor: "text-amber-400 bg-amber-500/10 border-amber-500/20", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-300", time: "6–18 months after invitation", cost: "AUD 4,640", validity: "5 years provisional" },
            { sub: "482", name: "Temporary Skill Shortage Visa", tagline: "Employer-sponsored pathway for nominated occupations on the skills list", diff: "Complex", diffColor: "text-red-400 bg-red-500/10 border-red-500/20", iconBg: "bg-violet-500/20", iconColor: "text-violet-300", time: "60 days (most cases)", cost: "AUD 3,115", validity: "Up to 4 years" },
          ].map((p) => (
            <div key={p.sub} className="rounded-2xl border overflow-hidden bg-white/[0.03] border-white/[0.08]">
              <div className="p-5 text-left">
                <div className="flex items-start gap-3 mb-2.5">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", p.iconBg)}>
                    <Globe className={cn("w-4 h-4", p.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-xs text-zinc-400 bg-white/[0.05] px-1.5 py-0.5 rounded-full">Subclass {p.sub}</span>
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", p.diffColor)}>{p.diff}</span>
                        </div>
                        <div className="text-sm font-bold text-white leading-snug">{p.name}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed pl-[52px] mb-2.5">{p.tagline}</p>
                <div className="flex items-center gap-4 pl-[52px] text-xs text-zinc-600">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 flex-shrink-0" />{p.time}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3 flex-shrink-0" />{p.cost}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 flex-shrink-0" />{p.validity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2 preview — exact match to Step2CheckReadiness ─────────────────────

function Step2Preview() {
  const eligibility = [
    { id: "eoi", label: "Expression of Interest (EOI) submitted", desc: "Via SkillSelect — must receive an invitation to apply", met: true, required: true },
    { id: "mltssl", label: "Occupation on MLTSSL", desc: "Must be on the Medium and Long-Term Strategic Skills List", met: true, required: true },
    { id: "skills", label: "Positive skills assessment", desc: "From the relevant assessing authority for your occupation", met: true, required: true },
    { id: "points", label: "65 points minimum (higher in practice)", desc: "Current cut-offs are typically 85–100+ points", met: false, required: true },
    { id: "age", label: "Under 45 years", desc: "At time of invitation to apply", met: false, required: true },
    { id: "english", label: "Competent English — IELTS 6.0 per band", desc: "Superior English (IELTS 8.0) adds 20 points", met: false, required: true },
  ];

  const riskFactors: Array<{ id: string; label: string; ans: "yes" | "no" | "partial" }> = [
    { id: "refusal", label: "Have you had a previous Australian visa refusal or cancellation?", ans: "no" },
    { id: "points-claim", label: "Have you claimed points you cannot fully substantiate with documents?", ans: "no" },
    { id: "english-expiry", label: "Are your English test results more than 3 years old?", ans: "partial" },
  ];

  const metCount = eligibility.filter(e => e.met).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Check Your Readiness</h2>
        <p className="text-sm text-zinc-500">Review eligibility requirements and answer a few questions to get your risk score before you start gathering documents.</p>
      </div>

      {/* Pathway pill */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.05] border border-white/[0.10] rounded-xl">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/20">
          <Globe className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <div>
          <div className="text-xs text-zinc-500">Checking readiness for</div>
          <div className="text-sm font-bold text-white">Skilled Independent Visa</div>
        </div>
      </div>

      {/* Eligibility self-check */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-zinc-400" />
            Eligibility self-check
          </h3>
          <span className="text-xs text-zinc-500">{metCount} / {eligibility.length} confirmed</span>
        </div>
        <div className="space-y-2">
          {eligibility.map((req) => (
            <div key={req.id} className={cn(
              "w-full flex items-start gap-3 p-4 rounded-xl border text-left",
              req.met ? "bg-emerald-500/[0.08] border-emerald-500/25" : "bg-white/[0.03] border-white/[0.08]"
            )}>
              <div className="flex-shrink-0 mt-0.5">
                {req.met ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-zinc-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{req.label}</span>
                  {req.required && !req.met && (
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Required</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{req.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2.5 bg-amber-500/[0.07] border border-amber-500/25 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/90 leading-relaxed"><span className="font-semibold">3 required criteria not yet confirmed.</span> Tick each requirement above once you&apos;ve verified you meet it.</p>
        </div>
      </div>

      {/* Risk questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-400" />
            Risk profile questions
          </h3>
          <span className="text-xs text-zinc-500">3 / 3 answered</span>
        </div>
        <div className="space-y-3">
          {riskFactors.map((f) => (
            <div key={f.id} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-3 leading-snug">{f.label}</p>
              <div className="flex gap-2 flex-wrap">
                {(["yes", "partial", "no"] as const).map((opt) => (
                  <div key={opt} className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold border",
                    f.ans === opt
                      ? opt === "yes" ? "bg-red-500/20 border-red-500/50 text-red-300"
                        : opt === "partial" ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                        : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                      : "bg-white/[0.04] border-white/[0.10] text-zinc-400"
                  )}>
                    {opt === "yes" ? "Yes" : opt === "partial" ? "Partially" : "No"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk score result */}
      <div className="rounded-2xl border p-5 flex items-start gap-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex-shrink-0 w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center">
          <span className="text-xl font-black text-amber-400">68</span>
        </div>
        <div>
          <div className="text-base font-bold mb-1 text-amber-400">Moderate Risk</div>
          <p className="text-sm text-zinc-400 leading-relaxed">Some risk factors identified. Address the recommendations below before lodging.</p>
        </div>
      </div>
    </div>
  );
}

// ── Step 3 preview — exact match to Step3BuildPlan ───────────────────────────

function Step3Preview() {
  const phases = [
    {
      label: "Phase 1 — Critical requirements",
      items: [
        { id: "1", text: "Confirm occupation on relevant skilled list", note: "189 requires MLTSSL. Check current lists — they change quarterly.", priority: "critical", done: true, cost: null, link: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list", linkLabel: "View occupation lists" },
        { id: "2", text: "Obtain positive skills assessment", note: "Allow 3–6 months. This is typically the longest step.", priority: "critical", done: false, cost: "AUD 600", link: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-assessment", linkLabel: "Find assessing body" },
        { id: "3", text: "Check passport validity", note: "Passport must be valid for at least the intended visa duration plus 6 months.", priority: "critical", done: false, cost: null, link: null, linkLabel: null },
        { id: "4", text: "Obtain English test (IELTS 6.0 / PTE 50 Competent)", note: "Each band must meet the minimum. Scores valid for 3 years.", priority: "critical", done: false, cost: "AUD 320", link: "https://ielts.org/book-a-test", linkLabel: "Book IELTS test" },
        { id: "5", text: "Complete health examination (HAP)", note: "Book with a Department-approved panel physician. Allow 3–6 weeks.", priority: "critical", done: true, cost: "AUD 370", link: "https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health", linkLabel: "Find panel physician" },
        { id: "6", text: "Calculate your points score carefully", note: "Use the official calculator. 65 is minimum; you typically need 80+.", priority: "critical", done: true, cost: null, link: "https://immi.homeaffairs.gov.au/points-test-advice-online/points-test/points", linkLabel: "Official points calculator" },
      ],
    },
    {
      label: "Phase 2 — EOI & nomination",
      items: [
        { id: "7", text: "Submit Expression of Interest (EOI) via SkillSelect", note: "EOI registers your interest. Wait for an invitation to apply (ITA).", priority: "critical", done: false, cost: null, link: "https://skillselect.gov.au", linkLabel: "Open SkillSelect" },
        { id: "8", text: "Gather employment evidence for all claimed experience", note: "Reference letters, payslips, tax records for every job claimed in EOI.", priority: "critical", done: false, cost: null, link: null, linkLabel: null },
        { id: "9", text: "Create ImmiAccount", note: "Register to lodge the application and receive communications.", priority: "critical", done: false, cost: null, link: "https://online.immi.homeaffairs.gov.au/lusc/register", linkLabel: "Create ImmiAccount" },
      ],
    },
  ];

  const totalItems = phases.flatMap(p => p.items).length;
  const doneItems = phases.flatMap(p => p.items).filter(i => i.done).length;
  const pct = Math.round((doneItems / totalItems) * 100);

  const priorityColor: Record<string, string> = {
    critical: "text-red-400 bg-red-500/10 border-red-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Build Your Plan</h2>
        <p className="text-sm text-zinc-500">Work through your personalised checklist and set your target lodgement date.</p>
      </div>

      {/* Progress card */}
      <div className="glass rounded-2xl border border-white/[0.10] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20">
              <Globe className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs text-zinc-500">Planning for</div>
              <div className="text-sm font-bold text-white">Skilled Independent Visa</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-white">{pct}%</div>
            <div className="text-xs text-zinc-500">{doneItems}/{totalItems} done</div>
          </div>
        </div>
        <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Lodgement date */}
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-bold text-white">Target lodgement date</span>
        <div className="bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-2 text-sm text-white">3 Sep 2025</div>
        <span className="text-xs text-zinc-500">That&apos;s <span className="text-white font-semibold">19 weeks</span> from today</span>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {phases.map((phase, pi) => (
          <div key={pi}>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="inline-flex w-5 h-5 rounded-full bg-white/10 items-center justify-center text-[10px] font-black text-white">{pi + 1}</span>
              {phase.label}
              <span className="font-normal text-zinc-600 normal-case tracking-normal">— {phase.items.filter(i => i.done).length}/{phase.items.length} done</span>
            </h3>
            <div className="space-y-2">
              {phase.items.map((item) => (
                <div key={item.id} className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-xl border text-left",
                  item.done ? "bg-emerald-500/[0.07] border-emerald-500/20" : "bg-white/[0.03] border-white/[0.08]"
                )}>
                  <div className="flex-shrink-0 mt-0.5">
                    {item.done ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-zinc-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-sm font-semibold", item.done ? "text-zinc-500 line-through" : "text-white")}>{item.text}</span>
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide", priorityColor[item.priority])}>{item.priority}</span>
                    </div>
                    <p className={cn("text-xs mt-0.5 leading-relaxed", item.done ? "text-zinc-600" : "text-zinc-500")}>{item.note}</p>
                    {(item.cost || item.link) && (
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        {item.cost && <span className="text-xs text-zinc-500 flex items-center gap-1"><DollarSign className="w-3 h-3" />{item.cost}</span>}
                        {item.link && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400">
                            <ExternalLink className="w-3 h-3" />
                            {item.linkLabel ?? "Open →"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 4 preview — exact match to Step4TrackSubmit ────────────────────────

function Step4Preview() {
  // Mirrors outcomeConfig in visa-guide.tsx exactly
  const outcomeOptions = [
    { id: "preparing", label: "Preparing",               desc: "Gathering documents and completing forms.",           color: "text-zinc-300",    bg: "bg-white/[0.06]",       border: "border-white/[0.12]",    icon: ClipboardList },
    { id: "applied",   label: "Application lodged",      desc: "Your application is submitted and under assessment.", color: "text-amber-400",   bg: "bg-amber-500/10",       border: "border-amber-500/25",    icon: SendHorizonal },
    { id: "rfi",       label: "Further info requested",  desc: "The case officer has requested additional information.", color: "text-orange-400", bg: "bg-orange-500/10",     border: "border-orange-500/25",   icon: AlertTriangle },
    { id: "approved",  label: "Approved",                desc: "Congratulations — your visa has been granted!",      color: "text-emerald-400", bg: "bg-emerald-500/10",     border: "border-emerald-500/25",  icon: CheckCircle },
    { id: "refused",   label: "Refused",                 desc: "Your application was refused. Use the recovery plan below.", color: "text-red-400", bg: "bg-red-500/10",    border: "border-red-500/25",      icon: XCircle },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Track Your Application</h2>
        <p className="text-sm text-zinc-500">Update your application status as things progress. If refused, the recovery plan below will guide your reapplication.</p>
      </div>

      {/* Application details card */}
      <div className="glass rounded-2xl border border-white/[0.10] p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20">
            <Globe className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="text-xs text-zinc-500">Tracking</div>
            <div className="text-sm font-bold text-white">Skilled Independent Visa</div>
          </div>
        </div>
        <div className="border-t border-white/[0.07]" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Application reference number</label>
            <div className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2 text-sm text-zinc-300">3AC7F2910</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-500 mb-1.5">Processing time</div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-sm text-zinc-400">6–18 months after invitation</span>
            </div>
            <div className="text-xs text-zinc-600 mt-1">Lodged: 3 Sep 2025</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.10] bg-white/[0.03]">
          <div>
            <div className="text-sm font-semibold text-white">Check status on Department of Home Affairs</div>
            <div className="text-xs text-zinc-600 mt-0.5">immi.homeaffairs.gov.au</div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        </div>
      </div>

      {/* Status grid */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-zinc-400" />
          Application status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {outcomeOptions.map((o) => {
            const Icon = o.icon;
            const selected = o.id === "approved";
            return (
              <div key={o.id} className={cn(
                "flex flex-col items-start gap-2 p-3.5 rounded-xl border",
                selected ? cn(o.bg, o.border, "ring-1 ring-white/20") : "bg-white/[0.03] border-white/[0.08]"
              )}>
                <Icon className={cn("w-4 h-4", selected ? o.color : cn(o.color, "opacity-30"))} />
                <div>
                  <div className={cn("text-xs font-bold", selected ? o.color : "text-zinc-400")}>{o.label}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{o.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approved content */}
      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-emerald-400">Congratulations! 🎉</h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">Your Skilled Independent Visa has been granted. Keep your grant letter safe, note your visa conditions, and check your pathway options.</p>
        <div className="mb-4">
          <p className="text-xs font-semibold text-zinc-500 mb-2">Your next pathways:</p>
          <div className="flex flex-wrap gap-1.5">
            {["Citizenship", "Subclass 888"].map((p) => (
              <span key={p} className="text-xs bg-white/[0.07] text-zinc-300 border border-white/10 px-2.5 py-1 rounded-full font-medium">{p} →</span>
            ))}
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-100 transition-all">
          <FileText className="w-4 h-4" />
          Download full report
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProductPreview() {
  const [active, setActive] = useState<1 | 2 | 3 | 4>(1);

  const previews: Record<number, React.ReactNode> = {
    1: <Step1Preview />,
    2: <Step2Preview />,
    3: <Step3Preview />,
    4: <Step4Preview />,
  };

  return (
    <section className="section-dark relative overflow-hidden py-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, rgba(180,200,255,1) 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-zinc-500 mb-5 uppercase tracking-widest">
            Live preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            See exactly what you get,{" "}
            <span className="gradient-text">before you start.</span>
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-base sm:text-lg">
            Four steps. One flow. Here&apos;s what each stage looks like.
          </p>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id as 1 | 2 | 3 | 4)}
                className={cn(
                  "flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  isActive ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-black" : "text-zinc-500")} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-[10px]">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Browser chrome frame */}
        <div className="rounded-2xl border border-white/[0.12] bg-[#0a0d14] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          {/* Browser bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-white/[0.03]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.07] text-[11px] text-zinc-500 max-w-xs w-full justify-center">
                <div className="w-3 h-3 rounded-sm bg-white/[0.10] flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                </div>
                visaswitch.com/au/guide
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              {TABS.map((t) => (
                <div key={t.id} className={cn("w-1.5 h-1.5 rounded-full transition-all", t.id === active ? "bg-white" : t.id < active ? "bg-emerald-400" : "bg-white/[0.15]")} />
              ))}
            </div>
          </div>

          {/* Sticky step nav inside browser — mirrors the real guide's StepNav */}
          <div className="px-4 py-3 border-b border-white/[0.06] bg-black/40">
            <div className="relative flex items-stretch max-w-lg mx-auto">
              {[0, 1, 2].map((i) => (
                <div key={i} className="absolute top-5 h-px bg-white/[0.10]"
                  style={{ left: `calc(${(i + 0.5) * 25}% + 1.25rem)`, width: `calc(25% - 2.5rem)` }} />
              ))}
              {TABS.map((s) => {
                const done = s.id < active;
                const isActive = s.id === active;
                const locked = s.id > active;
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => setActive(s.id as 1|2|3|4)}
                    className="relative flex-1 flex flex-col items-center gap-1.5 px-1 py-2 transition-all">
                    <div className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all",
                      done ? "bg-emerald-500/20 border-emerald-500/60" : isActive ? "bg-white border-white" : "bg-white/[0.05] border-white/[0.18]")}>
                      {done ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : locked ? <Lock className="w-4 h-4 text-zinc-500" /> : <Icon className={cn("w-4 h-4", isActive ? "text-black" : "text-zinc-400")} />}
                    </div>
                    <div className="text-center">
                      <div className={cn("text-[10px] font-bold leading-tight hidden sm:block",
                        isActive ? "text-white" : done ? "text-emerald-400" : "text-zinc-500")}>{s.label}</div>
                      <div className="text-[9px] text-zinc-500 hidden sm:block">{s.sublabel}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview content — matches real guide px-4 sm:px-6 py-10 */}
          <div className="px-4 sm:px-8 py-8 max-h-[620px] overflow-y-auto">
            {previews[active]}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <a href="/au/guide"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all group">
            Try it yourself — it&apos;s free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <p className="text-xs text-zinc-600">No account needed · Progress saved automatically</p>
        </div>
      </div>
    </section>
  );
}
