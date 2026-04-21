import Link from "next/link";
import { ProductPreview } from "@/components/home/product-preview";
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
  Shield,
  SendHorizonal,
} from "lucide-react";
import { countryList } from "@/data";

const countryMeta: Record<string, { abbr: string; tagline: string; pathways: string; authority: string }> = {
  au: { abbr: "AU", tagline: "Australia", pathways: "14 pathways", authority: "Home Affairs" },
  uk: { abbr: "UK", tagline: "United Kingdom", pathways: "8 pathways", authority: "UKVI" },
  ca: { abbr: "CA", tagline: "Canada", pathways: "9 pathways", authority: "IRCC" },
  jp: { abbr: "JP", tagline: "Japan", pathways: "8 pathways", authority: "Immigration Bureau" },
};

const countryColors: Record<string, { badge: string; border: string; glow: string }> = {
  au: { badge: "bg-blue-500/15 text-blue-300 border border-blue-500/25",   border: "rgba(59,130,246,0.18)",  glow: "rgba(59,130,246,0.06)" },
  uk: { badge: "bg-violet-500/15 text-violet-300 border border-violet-500/25", border: "rgba(139,92,246,0.18)", glow: "rgba(139,92,246,0.06)" },
  ca: { badge: "bg-red-500/15 text-red-300 border border-red-500/25",      border: "rgba(239,68,68,0.18)",   glow: "rgba(239,68,68,0.06)" },
  jp: { badge: "bg-amber-500/15 text-amber-300 border border-amber-500/25",  border: "rgba(245,158,11,0.18)",  glow: "rgba(245,158,11,0.06)" },
};

const guideSteps = [
  {
    icon: Globe,
    step: "01",
    title: "Find Your Pathway",
    description: "Select your current visa and goal. We instantly rank every pathway available to you — best match first, with full eligibility breakdown.",
  },
  {
    icon: Shield,
    step: "02",
    title: "Check Your Readiness",
    description: "Self-assess each eligibility requirement and answer a short risk questionnaire. Get a live risk score before you commit a dollar.",
  },
  {
    icon: ListChecks,
    step: "03",
    title: "Build Your Plan",
    description: "A phased, pathway-specific checklist with every document, deadline, and cost — mapped to your target lodgement date.",
  },
  {
    icon: SendHorizonal,
    step: "04",
    title: "Track & Submit",
    description: "Update your application status as it progresses. If refused, the built-in recovery tool diagnoses why and maps your next move.",
  },
];

const stats = [
  { value: "39", label: "Visa pathways mapped", sub: "AU · UK · CA · JP" },
  { value: "4", label: "Guide stages", sub: "Pathway → Approval" },
  { value: "Free", label: "To start", sub: "No credit card needed" },
  { value: "100%", label: "Browser-based", sub: "Nothing stored server-side" },
];

const features = [
  {
    icon: Zap,
    title: "One flow, start to approval",
    description: "Everything you need — pathway matching, eligibility, risk scoring, checklist, and application tracking — unified in a single guided journey that saves your progress.",
  },
  {
    icon: FileCheck,
    title: "Pathway-specific, not generic",
    description: "Every checklist item, risk factor, and eligibility requirement is tailored to your selected visa — not a copy-paste template.",
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
    title: "Progressive, not overwhelming",
    description: "Each stage unlocks after you complete the previous one. You always know exactly where you are and what to do next.",
  },
  {
    icon: Users,
    title: "Built for real complexity",
    description: "Multiple visas, prior refusals, expiring status, dependants — the guide is designed for situations that don't fit a simple box.",
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
    a: "No. The complete visa guide works fully in your browser without an account. Your progress is saved to your device automatically.",
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
      <section className="relative overflow-hidden bg-black min-h-[90vh] sm:min-h-screen flex items-center">
        {/* Background glows */}
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
            <h1 className="text-4xl sm:text-6xl lg:text-[5rem] font-bold leading-[1.08] sm:leading-[1.04] mb-6 tracking-tight text-white">
              Your visa journey,
              <br />
              <span className="gradient-text">step by step.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              One guided flow that takes you from &ldquo;which visa?&rdquo; all the way to
              approval — with pathway ranking, eligibility checks, risk scoring,
              checklists, and refusal recovery built in.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <Link
                href="/au/guide"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all shadow-[0_0_60px_rgba(255,255,255,0.10)] group"
              >
                <Sparkles className="w-4 h-4" />
                Start my visa guide
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
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
                      href={`/${country.code}/guide`}
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

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#04060c] pointer-events-none" />
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="bg-[#04060c] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#04060c] px-5 sm:px-8 py-6 sm:py-7 flex flex-col gap-1">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm font-medium text-zinc-300">{stat.label}</div>
                <div className="text-xs text-zinc-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUIDE STEPS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="section-dark relative overflow-hidden py-28">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, rgba(180,200,255,1) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] text-xs font-semibold text-emerald-400 mb-6 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              One guided flow
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              Every stage of your visa journey,{" "}
              <span className="gradient-text">in order.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-lg">
              Four stages, one flow. Each stage unlocks after the previous one —
              so you always know exactly where you are and what to do next.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {guideSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="glass glass-hover card-hover rounded-2xl p-7 flex flex-col gap-5 border border-white/[0.07] group">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl border border-white/[0.09] bg-white/[0.05] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-zinc-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Stage {step.step}</div>
                      <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA under steps */}
          <div className="flex justify-center mt-12">
            <Link
              href="/au/guide"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all group"
            >
              <Sparkles className="w-4 h-4" />
              Start the guide — Australia
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
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
              <span className="gradient-text">in minutes.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-lg">
              Most people don&apos;t know what they don&apos;t know. VisaSwitch structures
              the complexity so you always know your next move.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Single connector line — sits behind all boxes via z-index -1 */}
            <div className="hidden md:block absolute top-12 h-px bg-white/[0.14]"
              style={{ left: "calc(16.67% + 3rem)", right: "calc(16.67% + 3rem)", zIndex: -1 }} />

            {[
              {
                number: "1",
                title: "Tell us your situation",
                desc: "Select your current visa, destination country, and goal. No account, no forms — takes under a minute.",
              },
              {
                number: "2",
                title: "Get your complete picture",
                desc: "Ranked visa pathways, eligibility self-check, and a live risk score — generated instantly for your exact situation.",
              },
              {
                number: "3",
                title: "Apply with confidence",
                desc: "Know precisely what to prepare, when to lodge, and which risks to address — before you spend a dollar on fees.",
              },
            ].map((step) => (
              <div key={step.number} className="relative z-10 flex flex-col items-center text-center gap-5">
                <div className="w-24 h-24 rounded-2xl border border-white/[0.12] bg-[#09090b] flex items-center justify-center text-white font-bold text-3xl">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ───────────────────────────────────────────── */}
      <ProductPreview />

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
              Not a directory. Not a forum. A precision guide built specifically for
              navigating the visa application process from start to finish.
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
          <p className="text-center text-xs text-zinc-500 mt-6">
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
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, rgba(200,220,255,1) 0%, transparent 70%)" }} />
        </div>
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.09] bg-white/[0.04] text-xs font-semibold text-zinc-500 mb-7 uppercase tracking-widest">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Free to use · No account required
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Your next step{" "}
            <span className="gradient-text">starts here.</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-12 leading-relaxed max-w-xl mx-auto">
            No guesswork. No expensive surprises. Just a clear, precise path from
            eligibility to approval — built for your exact situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/au/guide"
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
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-500">
            {[
              "No account required to start",
              "Pathway-specific content",
              "Browser-only · Nothing stored",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-zinc-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
