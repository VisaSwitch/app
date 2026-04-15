import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  ListChecks,
  BarChart3,
  RefreshCw,
  Star,
  ChevronRight,
  Globe,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { countryList } from "@/data";

const tools = [
  {
    icon: Globe,
    title: "Pathway Checker",
    description:
      "Answer a few questions about your situation and get a complete breakdown of every visa pathway you qualify for — ranked by ease, speed, and chance of success.",
    cta: "Check my pathways",
    href: "/au/pathways",
    color: "blue",
    step: "01",
  },
  {
    icon: ListChecks,
    title: "Checklist & Timeline",
    description:
      "Generate a personalised checklist and timeline for your application. Know exactly what to do, in what order, and by when — even with complex situations.",
    cta: "Build my plan",
    href: "/au/planner",
    color: "indigo",
    step: "02",
  },
  {
    icon: BarChart3,
    title: "Pre-lodgement Risk Audit",
    description:
      "Before you submit, run a comprehensive risk analysis. Identify weak spots in your application, get actionable next steps, and understand your approval odds.",
    cta: "Audit my application",
    href: "/au/audit",
    color: "violet",
    step: "03",
  },
  {
    icon: RefreshCw,
    title: "Refusal Recovery",
    description:
      "Had a visa refused? Get a structured audit of the decision, understand the real reasons, and build your strongest possible path to approval.",
    cta: "Recover from refusal",
    href: "/au/recovery",
    color: "purple",
    step: "04",
  },
];

const stats = [
  { label: "Visa pathways mapped", value: "300+", icon: Globe },
  { label: "Countries covered", value: "4", icon: TrendingUp },
  { label: "Average processing insight", value: "48h", icon: Clock },
  { label: "Applicants guided", value: "12,000+", icon: Users },
];

const testimonials = [
  {
    quote:
      "I had no idea there were so many pathways available. VisaSwitch helped me realise I qualified for the 485 visa before it expired — saved me a fortune.",
    name: "Anh T.",
    role: "Software engineer, Vietnam to Australia",
    rating: 5,
  },
  {
    quote:
      "The refusal recovery tool was incredibly thorough. It pointed out issues I hadn't considered and gave me a clear action plan that worked.",
    name: "Carlos M.",
    role: "Project manager, Colombia to UK",
    rating: 5,
  },
  {
    quote:
      "The timeline planner removed so much stress from our Express Entry application. We knew exactly what to do every week.",
    name: "Priya & Raj S.",
    role: "Engineers, India to Canada",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is VisaSwitch a substitute for a migration agent?",
    a: "No. VisaSwitch provides structured information and analysis tools to help you understand your options and prepare effectively. For complex cases or formal legal advice, we recommend engaging a registered migration agent or immigration lawyer.",
  },
  {
    q: "How current is the immigration information?",
    a: "Our visa rules and processing data are reviewed regularly. However, immigration rules change frequently — always verify critical details with official government sources before lodging your application.",
  },
  {
    q: "Which countries do you cover?",
    a: "Currently Australia, United Kingdom, Canada, and Japan. More countries are being added — vote for your priority on our roadmap page.",
  },
  {
    q: "Can I use VisaSwitch if my situation is complex?",
    a: "Yes — the tools are designed to handle complexity. Whether you have a prior refusal, an expiring visa, multiple concurrent pathways, or dependants, you can input your specific situation for a tailored result.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.3) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span className="text-slate-200">Australia, UK, Canada & Japan visa guidance</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Navigate your visa journey{" "}
              <span className="gradient-text">with clarity.</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              From eligibility check to approval — VisaSwitch gives you the full picture across every pathway, so you can decide with confidence and apply when ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/au/pathways"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 group"
              >
                Check my pathways
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all"
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Country selector */}
          <div className="mt-16 max-w-2xl mx-auto">
            <p className="text-center text-sm text-slate-400 mb-4">Select your destination country</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {countryList.map((country) => (
                <Link
                  key={country.code}
                  href={`/${country.code}`}
                  className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 hover:border-white/25 transition-all text-center group"
                >
                  <span className="text-base font-semibold text-white">{country.name}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{country.code}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 mb-4 uppercase tracking-wide">
              Four connected tools
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Every stage of the visa journey, covered.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you are researching options, preparing to apply, or recovering from a refusal — our tools work together seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const colorMap: Record<string, string> = {
                blue: "bg-blue-500/10 text-blue-600 border-blue-100",
                indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
                violet: "bg-violet-500/10 text-violet-600 border-violet-100",
                purple: "bg-purple-500/10 text-purple-600 border-purple-100",
              };
              const btnMap: Record<string, string> = {
                blue: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                indigo: "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50",
                violet: "text-violet-600 hover:text-violet-700 hover:bg-violet-50",
                purple: "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
              };
              return (
                <div
                  key={tool.title}
                  className="card-hover bg-white rounded-2xl border border-slate-200 p-7 shadow-sm flex flex-col gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[tool.color]}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Step {tool.step}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{tool.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                  <Link
                    href={tool.href}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors self-start ${btnMap[tool.color]}`}
                  >
                    {tool.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Built for how people actually navigate visas
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Most people don't know what they don't know. VisaSwitch structures the complexity so you can move forward with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                number: "1",
                title: "Tell us your situation",
                desc: "Answer questions about your nationality, current visa status, occupation, and goals. No account required to start.",
              },
              {
                number: "2",
                title: "Get your complete picture",
                desc: "Receive a ranked list of pathways, a personalised checklist, and a risk breakdown — all in one place.",
              },
              {
                number: "3",
                title: "Take confident action",
                desc: "Know exactly what to prepare, when to lodge, and what to fix before you spend a dollar on application fees.",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 text-white font-bold text-lg shadow-lg shadow-blue-200">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              People who used it. People who got through.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed flex-1">{t.quote}</p>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-5">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight">Your next step starts here.</h2>
          <p className="text-lg text-slate-300 mb-10">No guesswork. No expensive surprises. Just a clear path forward.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/au/pathways"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-900/30 group"
            >
              Start with Australia
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all"
            >
              View pricing
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Free pathway check. No credit card required.
          </p>
        </div>
      </section>
    </div>
  );
}
