import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Globe,
  ListChecks,
  BarChart3,
  RefreshCw,
  ArrowRight,
  Clock,
  DollarSign,
  Building2,
  ChevronRight,
  Info,
} from "lucide-react";
import { getCountryData, isValidCountry } from "@/data";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!isValidCountry(country)) return {};
  const data = getCountryData(country);
  return {
    title: `${data!.name} Visa Guide`,
    description: `Explore visa pathways, checklists, risk audits, and refusal recovery for ${data!.name}. Powered by VisaSwitch.`,
  };
}

export async function generateStaticParams() {
  return [{ country: "au" }, { country: "uk" }, { country: "ca" }, { country: "jp" }];
}

const tools = [
  {
    icon: Globe,
    title: "Pathway Checker",
    description: "Find out which visa pathways you qualify for based on your personal profile and situation.",
    href: "pathways",
    color: "blue",
    badge: "Start here",
  },
  {
    icon: ListChecks,
    title: "Checklist & Timeline",
    description: "Get a step-by-step personalised checklist with deadlines for your specific visa application.",
    href: "planner",
    color: "indigo",
    badge: null,
  },
  {
    icon: BarChart3,
    title: "Pre-lodgement Risk Audit",
    description: "Analyse your application's risk profile before submitting to maximise your approval chances.",
    href: "audit",
    color: "violet",
    badge: null,
  },
  {
    icon: RefreshCw,
    title: "Refusal Recovery",
    description: "Received a refusal? Understand why and build your strongest path to overturning it.",
    href: "recovery",
    color: "purple",
    badge: null,
  },
];

export default async function CountryPage({ params }: Props) {
  const { country } = await params;

  if (!isValidCountry(country)) {
    notFound();
  }

  const data = getCountryData(country)!;

  const categoryCount = [...new Set(data.pathways.map((p) => p.category))].length;
  const permanentCount = data.pathways.filter((p) => p.validity === "Permanent").length;

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-100",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
    violet: "bg-violet-500/10 text-violet-600 border-violet-100",
    purple: "bg-purple-500/10 text-purple-600 border-purple-100",
  };

  const difficultyColor = {
    straightforward: "bg-emerald-100 text-emerald-700",
    moderate: "bg-amber-100 text-amber-700",
    complex: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(99,102,241,0.4) 0%, transparent 50%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{data.name}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-300 mb-5 uppercase tracking-wider">
              {data.name} Immigration Guide
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight leading-tight">
              Every visa pathway for{" "}
              <span className="gradient-text">{data.name}</span>,<br />
              mapped and explained.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Whether you are planning ahead, currently in {data.name}, or navigating a complex situation — start with your pathway check, then use the full toolkit.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${country}/pathways`}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 group"
              >
                Check my pathways
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={data.visaBodyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all"
              >
                <Building2 className="w-4 h-4" />
                {data.visaBodyName}
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { label: "Visa pathways", value: data.pathways.length },
              { label: "Categories", value: categoryCount },
              { label: "Permanent options", value: permanentCount },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl border border-white/10 p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Tools for {data.name}</h2>
            <p className="text-slate-600">Four interconnected tools that guide you from eligibility through to approval.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={`/${country}/${tool.href}`}
                  className="card-hover bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[tool.color]}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    {tool.badge && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                    Open tool
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visa pathways overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Visa Pathways</h2>
              <p className="text-slate-600">All current pathways for {data.name} — click to explore each in detail.</p>
            </div>
            <Link
              href={`/${country}/pathways`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Full eligibility check
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.pathways.map((pathway) => (
              <div
                key={pathway.id}
                className="card-hover bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {pathway.subclass && (
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          {pathway.subclass}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor[pathway.difficulty]}`}
                      >
                        {pathway.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{pathway.name}</h3>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                    {pathway.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-600 truncate">{pathway.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-600 truncate">{pathway.cost}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                  Validity: <span className="font-medium text-slate-700">{pathway.validity}</span>
                </div>

                <div className="mt-1">
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">Key benefits</h4>
                  <ul className="space-y-1">
                    {pathway.keyBenefits.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-xs text-slate-600">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-amber-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 max-w-3xl">
            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Important notice</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                Immigration rules change frequently. All information on VisaSwitch is for guidance purposes only and does not constitute legal advice. Always verify current requirements with{" "}
                <a href={data.visaBodyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-amber-900">
                  {data.visaBodyName}
                </a>{" "}
                before lodging your application.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
