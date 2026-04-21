"use client";

import { useState } from "react";
import {
  Globe,
  Shield,
  ListChecks,
  SendHorizonal,
  CheckCircle,
  Circle,
  Lock,
  ChevronDown,
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Clock,
  CheckSquare,
  Square,
  ArrowRight,
  Star,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: 1, label: "Find Pathway",    sublabel: "Pick the right visa",     icon: Globe },
  { id: 2, label: "Check Readiness", sublabel: "Eligibility & risk",      icon: Shield },
  { id: 3, label: "Build Your Plan", sublabel: "Timeline & checklist",    icon: ListChecks },
  { id: 4, label: "Track & Submit",  sublabel: "Application status",      icon: SendHorizonal },
] as const;

// ── Individual step previews ──────────────────────────────────────────────────

function Step1Preview() {
  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Your current visa</p>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.10] text-sm text-white">
            <span>Student Visa — Subclass 500</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Your goal</p>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.10] text-sm text-white">
            <span>Extend my stay</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Best match */}
      <div className="rounded-xl border border-white/[0.22] bg-white/[0.05] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.03]">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">Best match</span>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white">Skilled Independent Visa</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">Moderate</span>
              </div>
              <span className="text-xs text-zinc-500">Subclass 189 · Permanent residency</span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            Points-tested stream for skilled workers. No employer or state sponsorship required — strongest independence pathway available.
          </p>
          <div className="flex gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />6–18 months after invitation</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />AUD 4,640</span>
          </div>
        </div>
      </div>

      {/* Also consider strip */}
      <div>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Also consider — 5 other options</p>
        {[
          { name: "Skilled Work Regional (Provisional)", sub: "Subclass 491", diff: "Moderate", diffColor: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
          { name: "Temporary Skill Shortage", sub: "Subclass 482", diff: "Complex", diffColor: "text-red-300 bg-red-500/10 border-red-500/20" },
        ].map((p) => (
          <div key={p.sub} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.07] mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white truncate">{p.name}</span>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0", p.diffColor)}>{p.diff}</span>
              </div>
              <span className="text-[10px] text-zinc-600">{p.sub}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2Preview() {
  const items = [
    { label: "Expression of Interest (EOI) submitted", note: "Via SkillSelect — must receive an invitation to apply", checked: true },
    { label: "Occupation on MLTSSL", note: "Must be on the Medium and Long-Term Strategic Skills List", checked: true },
    { label: "Positive skills assessment", note: "From the relevant assessing authority", checked: true },
    { label: "65 points minimum", note: "Current cut-offs are typically 85–100+ points", checked: false },
    { label: "Under 45 years", note: "At time of invitation to apply", checked: false },
    { label: "Competent English — IELTS 6.0", note: "Superior English (8.0) adds 20 points", checked: false },
  ];
  const score = 68;

  return (
    <div className="space-y-4">
      {/* Pathway badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/[0.07] border border-amber-500/20 w-fit">
        <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center">
          <Globe className="w-3 h-3 text-amber-300" />
        </div>
        <div>
          <p className="text-[10px] text-zinc-500">Checking readiness for</p>
          <p className="text-xs font-bold text-white">Skilled Independent Visa</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-[1fr_160px] gap-4">
        {/* Eligibility list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-zinc-400" />Eligibility self-check</span>
            <span className="text-[10px] text-zinc-500">3 / 6 confirmed</span>
          </div>
          <div className="space-y-1.5">
            {items.map((item) => (
              <div key={item.label} className={cn("flex items-start gap-2.5 px-3 py-2 rounded-lg border", item.checked ? "bg-emerald-500/[0.06] border-emerald-500/20" : "bg-white/[0.03] border-white/[0.07]")}>
                {item.checked
                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  : <Circle className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                }
                <div>
                  <p className={cn("text-xs font-semibold leading-tight", item.checked ? "text-white" : "text-zinc-400")}>{item.label}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk score */}
        <div className="space-y-3">
          <div className="glass rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-4 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Risk Score</p>
            <div className="text-4xl font-bold text-amber-400 mb-1">{score}</div>
            <div className="text-xs font-bold text-amber-400 mb-2">Moderate Risk</div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden mb-3">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${score}%` }} />
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">Address 3 risk factors before lodging</p>
          </div>
          <div className="glass rounded-xl border border-white/[0.08] p-3 space-y-2">
            {[
              { label: "Points score", val: "70 pts", status: "amber" },
              { label: "EOI submitted", val: "Yes", status: "green" },
              { label: "Age", val: "32", status: "green" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">{r.label}</span>
                <span className={cn("text-[10px] font-bold", r.status === "green" ? "text-emerald-400" : "text-amber-400")}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3Preview() {
  const phases = [
    {
      label: "Phase 1 — Documents", weeks: "Weeks 1–4",
      items: [
        { text: "Obtain skills assessment from relevant authority", done: true },
        { text: "Gather identity documents (passport, birth certificate)", done: true },
        { text: "Collect employment reference letters", done: false },
        { text: "Obtain English test results (IELTS/PTE)", done: false },
      ],
    },
    {
      label: "Phase 2 — EOI", weeks: "Weeks 5–8",
      items: [
        { text: "Submit Expression of Interest via SkillSelect", done: false },
        { text: "Confirm points claim is accurate before submitting", done: false },
      ],
    },
    {
      label: "Phase 3 — Application", weeks: "After invitation",
      items: [
        { text: "Lodge visa application via ImmiAccount", done: false },
        { text: "Pay visa application charge", done: false },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {/* Lodgement target */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.10]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-300">Target lodgement</span>
        </div>
        <span className="text-xs font-bold text-white">3 Sep 2025</span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Overall progress</span>
          <span className="text-[10px] font-bold text-white">2 / 8 completed</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
          <div className="h-full rounded-full bg-emerald-400" style={{ width: "25%" }} />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {phases.map((phase, pi) => (
          <div key={pi} className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <span className="text-xs font-bold text-white">{phase.label}</span>
              <span className="text-[10px] text-zinc-500">{phase.weeks}</span>
            </div>
            <div className="p-2 space-y-1">
              {phase.items.map((item, ii) => (
                <div key={ii} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
                  {item.done
                    ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    : <Square className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                  }
                  <span className={cn("text-xs leading-tight", item.done ? "text-zinc-400 line-through decoration-zinc-600" : "text-zinc-300")}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4Preview() {
  return (
    <div className="space-y-4">
      {/* Status selector */}
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Application status</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Pending", color: "bg-white/[0.06] border-white/[0.12] text-zinc-300" },
            { label: "Approved", color: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300", active: true },
            { label: "Refused", color: "bg-white/[0.04] border-white/[0.08] text-zinc-600" },
          ].map((s) => (
            <div key={s.label} className={cn("flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all", s.color)}>
              {s.active && <CheckCircle className="w-3.5 h-3.5" />}
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Approved card */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-300">Visa Approved</p>
            <p className="text-xs text-zinc-500">Skilled Independent Visa · Subclass 189</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          {[
            { label: "Reference", val: "3AC7F2910" },
            { label: "Lodgement date", val: "3 Sep 2025" },
            { label: "Decision", val: "14 Oct 2025" },
            { label: "Valid from", val: "14 Oct 2025" },
          ].map((d) => (
            <div key={d.label} className="bg-white/[0.04] rounded-lg px-2.5 py-2">
              <p className="text-[10px] text-zinc-600 mb-0.5">{d.label}</p>
              <p className="font-semibold text-white">{d.val}</p>
            </div>
          ))}
        </div>

        {/* Next pathways */}
        <div>
          <p className="text-[10px] font-bold text-zinc-500 mb-1.5">Your next pathways</p>
          <div className="flex flex-wrap gap-1.5">
            {["Citizenship", "Subclass 888"].map((p) => (
              <span key={p} className="text-[10px] bg-white/[0.07] text-zinc-300 border border-white/10 px-2 py-1 rounded-full font-medium">{p} →</span>
            ))}
          </div>
        </div>
      </div>

      {/* Download CTA */}
      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-100 transition-all">
        <FileText className="w-4 h-4" />
        Download full report (PDF)
      </button>
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
      {/* Background glow */}
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
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-black" : "text-zinc-500")} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-[10px]">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Browser chrome mockup */}
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
                <div className="w-3 h-3 rounded-sm bg-white/[0.10] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                </div>
                visaswitch.com/au/guide
              </div>
            </div>
            {/* Step progress dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {TABS.map((t) => (
                <div key={t.id} className={cn("w-1.5 h-1.5 rounded-full transition-all", t.id === active ? "bg-white" : t.id < active ? "bg-emerald-400" : "bg-white/[0.15]")} />
              ))}
            </div>
          </div>

          {/* Step header bar inside browser */}
          <div className="px-5 pt-4 pb-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              {(() => {
                const tab = TABS[active - 1];
                const Icon = tab.icon;
                const stepColors = ["bg-blue-500/15 border-blue-500/25 text-blue-300", "bg-amber-500/15 border-amber-500/25 text-amber-300", "bg-violet-500/15 border-violet-500/25 text-violet-300", "bg-emerald-500/15 border-emerald-500/25 text-emerald-300"];
                return (
                  <>
                    <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0", stepColors[active - 1])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{tab.label}</h3>
                      <p className="text-[11px] text-zinc-500">{tab.sublabel}</p>
                    </div>
                    <div className="ml-auto hidden sm:flex items-center gap-1.5">
                      {TABS.map((t) => (
                        <div key={t.id} className={cn("h-1 rounded-full transition-all", t.id === active ? "w-6 bg-white" : t.id < active ? "w-3 bg-emerald-400" : "w-3 bg-white/[0.12]")} />
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Preview content */}
          <div className="p-5 min-h-[420px]">
            {previews[active]}
          </div>
        </div>

        {/* CTA below */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <a
            href="/au/guide"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all group"
          >
            Try it yourself — it&apos;s free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <p className="text-xs text-zinc-600">No account needed · Progress saved automatically</p>
        </div>
      </div>
    </section>
  );
}
