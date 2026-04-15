import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Shield, Target, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About VisaSwitch",
  description: "Learn about VisaSwitch — our mission to make visa navigation accessible, clear, and stress-free.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">About VisaSwitch</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Immigration is one of the most consequential decisions people make. We built VisaSwitch to make it navigable.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our mission</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Millions of people navigate complex immigration systems every year — often without clear guidance, spending thousands on fees for visas that get refused, or missing pathways they were eligible for all along.
              </p>
              <p className="text-slate-600 leading-relaxed">
                VisaSwitch exists to change that. We provide structured, data-driven tools that give people the same clarity a good migration agent would — at a fraction of the cost and without the waiting time.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What we are not</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We are not a migration agent, a law firm, or a government agency. VisaSwitch does not provide legal advice and does not lodge visa applications on your behalf.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We are a tools platform — designed to inform your decisions, prepare your application, and reduce the chance of costly mistakes. For complex legal situations, we always recommend engaging a registered professional.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              { icon: Globe, title: "Multi-country", desc: "Australia, UK, Canada, and Japan — more countries coming soon" },
              { icon: Target, title: "Data-driven", desc: "Tools built on current immigration rules, not general advice" },
              { icon: Shield, title: "Transparent", desc: "No legal advice, no hidden claims — just structured guidance" },
              { icon: Users, title: "People-first", desc: "Designed for real applicants in real situations, including complex ones" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Start navigating your visa journey</h2>
          <p className="text-slate-600 text-sm mb-6">Free pathway check — no account required.</p>
          <Link
            href="/au/pathways"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Check my pathways
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
