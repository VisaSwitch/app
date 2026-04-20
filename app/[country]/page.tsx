import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Globe,
  ArrowRight,
  Clock,
  DollarSign,
  Building2,
  ChevronRight,
  Info,
  CheckCircle,
  Sparkles,
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


export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  if (!isValidCountry(country)) notFound();
  const data = getCountryData(country)!;

  const categoryCount = [...new Set(data.pathways.map((p) => p.category))].length;
  const permanentCount = data.pathways.filter((p) => p.validity === "Permanent").length;

  const difficultyColor = {
    straightforward: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
    moderate: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
    complex: "text-red-400 bg-red-500/10 border border-red-500/20",
  };

  return (
    <div className="flex flex-col bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, rgba(180,200,255,1) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex items-center gap-1.5 text-sm text-zinc-600 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{data.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-zinc-500 mb-5 uppercase tracking-widest">
              {data.name} Immigration Guide
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight leading-tight text-white">
              Every visa pathway for{" "}
              <span className="gradient-text">{data.name}</span>,<br />
              mapped and explained.
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-2xl">
              Whether you are planning ahead, currently in {data.name}, or navigating a complex situation — start with your pathway check, then use the full toolkit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${country}/guide`}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-white text-black rounded-xl hover:bg-zinc-100 transition-all group"
              >
                <Sparkles className="w-4 h-4" />
                Start my visa guide
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={data.visaBodyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-400 border border-white/[0.12] rounded-xl hover:border-white/25 hover:text-white transition-all"
              >
                <Building2 className="w-4 h-4" />
                {data.visaBodyName}
              </a>
            </div>
          </div>
          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-3 gap-3 max-w-md">
            {[
              { label: "Visa pathways", value: data.pathways.length },
              { label: "Categories", value: categoryCount },
              { label: "Permanent options", value: permanentCount },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl border border-white/[0.08] p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-zinc-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-[#04060c] pointer-events-none" />
      </section>

      {/* Unified guide CTA banner */}
      <section className="section-dark pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${country}/guide`}
            className="group block glass card-hover rounded-2xl border border-white/[0.14] p-7 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div className="absolute top-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
                style={{ background: "radial-gradient(circle, rgba(200,255,200,1) 0%, transparent 70%)" }} />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7 text-black" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full mb-2 uppercase tracking-widest">
                  New — all-in-one
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Complete Visa Guide — one flow, start to approval
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-xl">
                  Pathway finder, eligibility check, risk audit, checklist &amp; application
                  tracker — all in a single guided journey. Your progress is saved.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold bg-white text-black rounded-xl group-hover:bg-zinc-100 transition-all">
                  Start guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Visa pathways overview */}
      <section className="section-mid py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Visa Pathways</h2>
              <p className="text-zinc-500">All current pathways for {data.name} — click to explore each in detail.</p>
            </div>
            <Link
              href={`/${country}/pathways`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Full eligibility check
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...data.pathways].sort((a, b) => {
              const order = { straightforward: 0, moderate: 1, complex: 2 };
              return order[a.difficulty] - order[b.difficulty];
            }).map((pathway) => (
              <div key={pathway.id} className="glass card-hover rounded-xl border border-white/[0.08] p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {pathway.subclass && (
                        <span className="text-xs font-bold text-zinc-600 uppercase">{pathway.subclass}</span>
                      )}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[pathway.difficulty]}`}>
                        {pathway.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{pathway.name}</h3>
                  </div>
                  <span className="text-xs text-zinc-600 bg-white/[0.05] px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
                    {pathway.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                    <span className="text-xs text-zinc-500 truncate">{pathway.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                    <span className="text-xs text-zinc-500 truncate">{pathway.cost}</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-600 border-t border-white/[0.06] pt-3">
                  Validity: <span className="font-medium text-zinc-400">{pathway.validity}</span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 mb-2">Key benefits</h4>
                  <ul className="space-y-1">
                    {pathway.pros.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1 h-1 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-xs text-zinc-500">{b}</span>
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
      <section className="py-8 bg-[#04060c] border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 max-w-3xl">
            <Info className="w-5 h-5 text-amber-500/70 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-400/80 mb-1">Important notice</p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Immigration rules change frequently. All information on VisaSwitch is for guidance purposes only and does not constitute legal advice. Always verify current requirements with{" "}
                <a href={data.visaBodyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-400 hover:text-white underline">
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
