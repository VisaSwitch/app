import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, Zap, Shield, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for VisaSwitch. Start free — upgrade when you need deeper analysis.",
};

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Full pathway check and basic tools — no account required.",
    cta: "Start for free",
    href: "/au/pathways",
    highlight: false,
    icon: Zap,
    features: [
      { label: "Pathway Checker (all countries)", included: true },
      { label: "Full eligibility breakdown", included: true },
      { label: "Refusal reasons library", included: true },
      { label: "Basic checklist template", included: true },
      { label: "Personalised timeline with deadlines", included: false },
      { label: "Pre-lodgement risk score", included: false },
      { label: "Refusal recovery plan", included: false },
      { label: "Save & export your results", included: false },
    ],
  },
  {
    name: "Pro",
    price: "29",
    period: "one-time",
    description: "Everything you need for a single visa application — pay once, use as long as you need.",
    cta: "Get Pro access",
    href: "/sign-up",
    highlight: true,
    icon: Shield,
    badge: "Most popular",
    features: [
      { label: "Everything in Free", included: true },
      { label: "Personalised timeline with deadlines", included: true },
      { label: "Pre-lodgement risk score & audit", included: true },
      { label: "Refusal recovery plan", included: true },
      { label: "Save & export your results (PDF)", included: true },
      { label: "Unlimited re-assessments", included: true },
      { label: "Multi-pathway comparison", included: true },
      { label: "Priority email support", included: false },
    ],
  },
  {
    name: "Premium",
    price: "79",
    period: "one-time",
    description: "Complex situations, multiple pathways, or family applications — full coverage.",
    cta: "Get Premium",
    href: "/sign-up",
    highlight: false,
    icon: Building2,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Multi-country comparison", included: true },
      { label: "Family / dependant planning", included: true },
      { label: "Complex situation assessment", included: true },
      { label: "Priority email support (48h response)", included: true },
      { label: "Personalised checklist for dependants", included: true },
      { label: "Pathway change scenario modelling", included: true },
      { label: "Early access to new features", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Start with the free pathway check. Upgrade when you need personalised planning, risk analysis, or refusal recovery.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-7 flex flex-col ${
                    plan.highlight
                      ? "bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 shadow-xl shadow-blue-500/10 text-white"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      {plan.badge && (
                        <span className="inline-block text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full mb-2">
                          {plan.badge}
                        </span>
                      )}
                      <h2 className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                        {plan.name}
                      </h2>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? "bg-blue-500/20 border border-blue-400/30" : "bg-slate-100 border border-slate-200"}`}>
                      <Icon className={`w-5 h-5 ${plan.highlight ? "text-blue-300" : "text-slate-500"}`} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-end gap-1.5">
                      <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                        ${plan.price}
                      </span>
                      <span className={`text-sm pb-1 ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>
                        AUD / {plan.period}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 leading-relaxed ${plan.highlight ? "text-slate-400" : "text-slate-600"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full py-3 text-sm font-semibold rounded-xl text-center mb-6 transition-all ${
                      plan.highlight
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.label} className="flex items-center gap-2.5">
                        {feature.included ? (
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-blue-400" : "text-emerald-500"}`} />
                        ) : (
                          <XCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-slate-600" : "text-slate-300"}`} />
                        )}
                        <span className={`text-sm ${feature.included ? (plan.highlight ? "text-slate-200" : "text-slate-700") : (plan.highlight ? "text-slate-600" : "text-slate-400")}`}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            All plans are one-time payments. No subscriptions, no recurring charges.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Pricing FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I start without paying?",
                a: "Yes — the Pathway Checker is fully free. You can check your eligibility across all pathways and see a full breakdown without creating an account.",
              },
              {
                q: "Do I need to pay per country?",
                a: "No. A Pro or Premium purchase covers all countries (Australia, UK, Canada, and Japan) for the duration of your application.",
              },
              {
                q: "What if I have a complex situation?",
                a: "Premium is designed for complex cases — multiple pathways, family applications, prior refusals, or situations involving more than one country.",
              },
              {
                q: "Is there a refund policy?",
                a: "Yes — if the tools are not useful for your situation, contact us within 7 days for a full refund. No questions asked.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 hero-gradient text-white text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-3">Start with the free pathway check</h2>
          <p className="text-slate-300 text-sm mb-7">No account required. See all your options in under 3 minutes.</p>
          <Link
            href="/au/pathways"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Check my pathways
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
