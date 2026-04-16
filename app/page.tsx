import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  ListChecks,
  BarChart3,
  RefreshCw,
  Star,
  Globe,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  Zap,
  Lock,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { countryList } from "@/data";

const countryMeta: Record<string, { abbr: string; tagline: string; pathways: string; authority: string }> = {
  au: { abbr: "AU", tagline: "Australia", pathways: "14 pathways", authority: "Home Affairs" },
  uk: { abbr: "UK", tagline: "United Kingdom", pathways: "8 pathways", authority: "UKVI" },
  ca: { abbr: "CA", tagline: "Canada", pathways: "9 pathways", authority: "IRCC" },
  jp: { abbr: "JP", tagline: "Japan", pathways: "8 pathways", authority: "Immigration Bureau" },
};

const countryColors: Record<string, { badge: string; border: string; glow: string }> = {
  au: { badge: "bg-blue-500/15 text-blue-300 border border-blue-500/20", border: "rgba(59,130,246,0.15)", glow: "rgba(59,130,246,0.06)" },
  uk: { badge: "bg-rose-500/15 text-rose-300 border border-rose-500/20", border: "rgba(244,63,94,0.15)", glow: "rgba(244,63,94,0.06)" },
  ca: { badge: "bg-red-500/15 text-red-300 border border-red-500/20", border: "rgba(239,68,68,0.15)", glow: "rgba(239,68,68,0.06)" },
  jp: { badge: "bg-zinc-600/30 text-zinc-300 border border-zinc-500/25", border: "rgba(161,161,170,0.15)", glow: "rgba(161,161,170,0.05)" },
};

const tools = [
  {
    icon: Globe,
    step: "01",
    title: "Pathway Checker",
    description: "Input your current visa status and goals. Get every pathway you qualify for — ranked by difficulty, speed, and fit.",
    cta: "Check my pathways",
    href: "/au/pathways",
  },
  {
    icon: ListChecks,
    step: "02",
    title: "Checklist & Timeline",
    description: "A personalised, pathway-specific checklist with every document, deadline, and milestone — nothing generic.",
    cta: "Build my plan",
    href: "/au/planner",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Pre-lodgement Risk Audit",
    description: "Score your application before you submit. Surface critical weaknesses, get priority fixes, and maximise your approval odds.",
    cta: "Audit my application",
    href: "/au/audit",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "Refusal Recovery",
    description: "Received a refusal? Identify the exact reasons, understand their severity, and map the strongest path to overturning it.",
    cta: "Recover from refusal",
    href: "/au/recovery",
  },
];

const stats = [
  { value: "39", label: "Visa pathways mapped", sub: "AU · UK · CA · JP" },
  { value: "4", label: "Countries covered", sub: "Official sources only" },
  { value: "Free", label: "To start", sub: "No credit card needed" },
  { value: "100%", label: "Browser-based", sub: "Nothing stored server-side" },
];

const features = [
  {
    icon: Zap,
    title: "Instant results, no waiting",
    description: "Select your situation and see ranked visa pathways in seconds. No form submissions, no waiting for a consultant to reply.",
  },
  {
    icon: FileCheck,
    title: "Pathway-specific, not generic",
    description: "Every checklist item, risk factor, and eligibility requirement is specific to your selected visa — not a copy-paste template.",
  },
  {
    icon: Lock,
    title: "No account required",
    description: "All tools run entirely in your browser. Your situation, answers, and results never leave your device unless you choose.",
  },
  {
    icon: ShieldCheck,
    title: "Verified against official sources",
    description: "Every visa requirement is cross-referenced with the official immigration authority — Home Affairs, UKVI, IRCC, and Japan MOJ.",
  },
  {
    icon: TrendingUp,
    title: "Connected, not siloed",
    description: "Your pathway choice flows directly into the planner, the audit, and refusal recovery — the tools hand context to each other.",
  },
  {
    icon: Users,
    title: "Built for real complexity",
    description: "Multiple visas, prior refusals, expiring status, dependants — the tools are designed for situations that don't fit a simple box.",
  },
];

const testimonials = [
  {
    quote: "I had no idea there were so many pathways available. VisaSwitch helped me realise I qualified for the 485 visa before it expired — saved me a fortune in migration agent fees.",
    name: "Anh T.",
    role: "Software Engineer · Vietnam → Australia",
    rating: 5,
    highlight: "Saved thousands in agent fees",
  },
  {
    quote: "The refusal recovery tool was incredibly thorough. It identified the exact issue — a GTE statement that wasn't specific enough — and gave me a clear action plan that worked second time.",
    name: "Carlos M.",
    role: "Project Manager · Colombia → UK",
    rating: 5,
    highlight: "Approved on second attempt",
  },
  {
    quote: "The timeline planner removed so much stress from our Express Entry application. We knew exactly what to do every single week. No surprises, no scrambling.",
    name: "Priya & Raj S.",
    role: "Engineers · India → Canada",
    rating: 5,
    highlight: "Express Entry approved",
  },
];

const faqs = [
  {
    q: "Is VisaSwitch a substitute for a migration agent?",
    a: "No — and we're upfront about that. VisaSwitch gives you structured information, personalised checklists, and risk analysis so you can understand your options and prepare effectively. For complex situations or formal legal advice, always engage a registered migration agent or immigration lawyer.",
  },
  {
    q: "How current is the information?",
    a: "We review visa requirements regularly against official government sources. That said, immigration rules change frequently — always verify critical details with the relevant official authority (Home Affairs, UKVI, IRCC, or Japan MOJ) before lodging.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. All four tools work fully in your browser without an account. A free account unlocks saved progress, export features, and priority updates when rules change.",
  },
  {
    q: "Which countries are covered?",
    a: "Currently Australia, United Kingdom, Canada, and Japan — covering 39 visa pathways. More countries are on the roadmap.",
  },
  {
    q: "Can I use VisaSwitch if my situation is complex?",
    a: "Yes — it's designed for complexity. Prior refusals, expiring visas, multiple overlapping pathways, dependants — input your real situation and get a result that reflects it.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-black">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black min-h-screen flex items-center">
        {/* Background: radial glow blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-15%] left-[10%] w-[700px] h-[700px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, rgba(180,200,255,1) 0%, transparent 70%)" }} />
          <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, rgba(200,180,255,1) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-[35%] w-[600px] h-[300px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(ellipse, rgba(150,180,255,1) 0%, transparent 70%)" }} />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-zinc-400 mb-8 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Australia · UK · Canada · Japan
            </div>

            {/* H1 */}
            <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-bold leading-[1.04] mb-7 tracking-tight text-white">
              Your visa journey,
              <br />
              <span className="gradient-text">navigated precisely.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              Four connected tools that take you from eligibility check through to
              approval — with pathway-specific checklists, live risk scoring,
              and refusal recovery built in.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
              <Link
                href="/au/pathways"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all shadow-[0_0_60px_rgba(255,255,255,0.10)] group"
              >
                Check my pathways
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#tools"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium text-zinc-400 rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-all"
              >
                See how it works
              </Link>
            </div>

            {/* Country selector */}
            <div>
              <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-5">Select your destination</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {countryList.map((country) => {
                  const meta = countryMeta[country.code];
                  const col = countryColors[country.code];
                  return (
                    <Link
                      key={country.code}
                      href={`/${country.code}`}
                      className="glass glass-hover rounded-2xl p-5 flex flex-col items-center gap-2.5 text-center group"
                      style={{ borderColor: col.border }}
                    >
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${col.badge}`}>
                        {meta.abbr}
                      </span>
                      <span className="text-sm font-semibold text-white leading-tight">{meta.tagline}</span>
                      <span className="text-xs text-zinc-600">{meta.pathways}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Fade bottom into next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#04060c] pointer-events-none" />
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="bg-[#04060c] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#04060c] px-8 py-7 flex flex-col gap-1">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm font-medium text-zinc-400">{stat.label}</div>
                <div className="text-xs text-zinc-600">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS ─────────────────────────────────────────────────────── */}
      <section id="tools" className="section-dark relative overflow-hidden py-28">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, rgba(180,200,255,1) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-zinc-500 mb-6 uppercase tracking-widest">
              Four connected tools
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              Every stage of the visa journey,{" "}
              <span className="gradient-text">covered.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-lg">
              Use one, use all four — they share context so your pathway choice flows directly into your checklist, audit, and recovery plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.title} className="glass glass-hover card-hover rounded-2xl p-7 flex flex-col gap-5 border border-white/[0.07] group cursor-default">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl border border-white/[0.09] bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Step {tool.step}</div>
                      <h3 className="text-base font-bold text-white mb-2">{tool.title}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-300 hover:text-white group-hover:gap-2 transition-all self-start"
                  >
                    {tool.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="section-mid relative overflow-hidden py-28">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              From uncertainty to action{" "}
              <span className="gradient-text">in three steps.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-lg">
              Most people don&apos;t know what they don&apos;t know. VisaSwitch structures the complexity so you always know your next move.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Connector */}
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5" />

            {[
              {
                number: "1",
                title: "Tell us your situation",
                desc: "Select your current visa status, nationality, occupation, and goal. No account needed — takes under a minute.",
              },
              {
                number: "2",
                title: "Get your complete picture",
                desc: "Ranked visa pathways, a pathway-specific checklist, and a live risk score — generated instantly for your exact situation.",
              },
              {
                number: "3",
                title: "Apply with confidence",
                desc: "Know precisely what to prepare, when to lodge, and which risks to address — before you spend a dollar on fees.",
              },
            ].map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center gap-5">
                <div className="relative z-10 w-24 h-24 rounded-2xl border border-white/[0.12] bg-white/[0.04] flex items-center justify-center text-white font-bold text-3xl">
                  {step.number}
                  {i < 2 && <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-px bg-white/20 hidden md:block" />}
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA under steps */}
          <div className="flex justify-center mt-14">
            <Link
              href="/au/pathways"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all group"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section className="section-dark relative overflow-hidden py-28">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute bottom-0 left-[5%] w-[600px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(ellipse, rgba(180,200,255,1) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              Why VisaSwitch is different
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-lg">
              Not a directory. Not a forum. A precision toolkit built specifically for navigating the visa application process.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass card-hover rounded-2xl p-7 border border-white/[0.07] flex flex-col gap-5">
                  <div className="w-11 h-11 rounded-xl border border-white/[0.09] bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="section-mid relative overflow-hidden py-28">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.07] text-xs font-semibold text-amber-400 mb-5 uppercase tracking-widest">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              What people say
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              People who used it.{" "}
              <span className="gradient-text">People who got through.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="glass card-hover rounded-2xl border border-white/[0.07] p-7 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 bg-white/[0.07] border border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {t.highlight}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-700 mt-6">
            Testimonials reflect individual experiences. Immigration outcomes vary based on personal circumstances.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="section-dark relative py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Common questions</h2>
            <p className="text-zinc-500">Straight answers — no fluff.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass card-hover rounded-2xl border border-white/[0.07] overflow-hidden">
                <div className="px-7 py-6">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg border border-white/[0.09] bg-white/[0.05] text-zinc-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed ml-9">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black py-32">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, rgba(200,220,255,1) 0%, transparent 70%)" }} />
        </div>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.09] bg-white/[0.04] text-xs font-semibold text-zinc-500 mb-7 uppercase tracking-widest">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Free pathway check · No credit card
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Your next step{" "}
            <span className="gradient-text">starts here.</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-12 leading-relaxed max-w-xl mx-auto">
            No guesswork. No expensive surprises. Just a clear, precise path forward — built for your exact situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/au/pathways"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all shadow-[0_0_80px_rgba(255,255,255,0.12)] group"
            >
              <Sparkles className="w-4 h-4" />
              Start with Australia
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium text-zinc-400 rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-all"
            >
              View pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
            {[
              "No account required to start",
              "Pathway-specific content",
              "Browser-only · Nothing stored",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-600" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
