import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, Zap, Sparkles } from "lucide-react";
import { FAQAccordion } from "@/components/ui/faq-accordion";

export const metadata: Metadata = {
  title: "Pricing — VisaSwitch",
  description: "Free visa guide for everyone. Upgrade to Pro for PDF reports, cloud sync, and priority support.",
};

const free = [
  "Full 4-step visa guide (all countries)",
  "Pathway finder & ranking",
  "Eligibility self-check",
  "Pre-lodgement risk score",
  "Application checklist & timeline",
  "Refusal recovery plan",
  "Application status tracker",
  "Progress saved locally (your browser)",
];

const pro = [
  "Everything in Free",
  "Download full guide as PDF",
  "Cloud sync — access from any device",
  "Multiple pathway comparisons",
  "Priority email support (48h)",
  "Early access to new features",
];

const notFree = [
  "Download full guide as PDF",
  "Cloud sync — access from any device",
  "Multiple pathway comparisons",
  "Priority email support",
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 hero-gradient">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-[20%] w-[500px] h-[400px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, rgba(180,200,255,1) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold text-zinc-500 mb-5 uppercase tracking-widest" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
            Simple pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--foreground)" }}>
            Free to use. <span className="gradient-text">Pay only for more.</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto leading-relaxed">
            The complete visa guide is free — no account needed. Upgrade to Pro for PDF export, cloud sync, and support.
          </p>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--section-dark-from))" }} />
      </section>

      {/* Plans */}
      <section className="section-dark py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-5">

            {/* Free */}
            <div className="glass rounded-2xl p-7 flex flex-col" style={{ border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>Free</h2>
                  <p className="text-xs text-zinc-500">No account required</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                  <Zap className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>$0</span>
                  <span className="text-sm text-zinc-500 pb-1">forever</span>
                </div>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  The full visa guide — pathway finder, eligibility check, risk score, checklist, and tracker. All four steps, completely free.
                </p>
              </div>

              <Link
                href="/au/guide"
                className="w-full py-3 text-sm font-semibold rounded-xl text-center mb-7 transition-all border"
                style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              >
                Start free guide
              </Link>

              <ul className="space-y-2.5 flex-1">
                {free.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-zinc-500">{f}</span>
                  </li>
                ))}
                {notFree.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 flex-shrink-0 text-zinc-400 mt-0.5" />
                    <span className="text-sm text-zinc-400 opacity-50">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-7 flex flex-col relative overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--muted)" }}>
              <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }} />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: "var(--glass-bg)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                    One-time payment
                  </span>
                  <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Pro</h2>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                  <Sparkles className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>$29</span>
                  <span className="text-sm text-zinc-500 pb-1">AUD · one-time</span>
                </div>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Pay once, use forever. Everything in Free plus PDF export, cloud save, and support — across all countries.
                </p>
              </div>

              <Link
                href="/sign-up"
                className="w-full py-3 text-sm font-semibold rounded-xl text-center mb-7 transition-all"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Get Pro access
              </Link>

              <ul className="space-y-2.5 flex-1">
                {pro.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                    <span className="text-sm text-zinc-500">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500 mt-6">
            One-time payment. No subscription, no recurring charges. 7-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-mid py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight" style={{ color: "var(--foreground)" }}>Common questions</h2>
            <p className="text-sm text-zinc-500">Everything you need to know before deciding.</p>
          </div>
          <div className="glass rounded-2xl px-6 sm:px-8" style={{ border: "1px solid var(--border)" }}>
            <FAQAccordion items={[
              {
                q: "Is the guide really fully free?",
                a: "Yes — the complete visa guide (pathway finder, eligibility check, risk score, checklist, and application tracker) is completely free. No account, no credit card, no time limit.",
              },
              {
                q: "What does Pro add?",
                a: "PDF export of your full guide, cloud sync across devices, multi-pathway side-by-side comparison, and priority email support. Everything in Free, plus tools that save time when your situation is complex.",
              },
              {
                q: "Does one payment cover all countries?",
                a: "Yes. A single Pro purchase covers Australia, UK, Canada, and Japan — for all your applications, forever. No per-country charges.",
              },
              {
                q: "Is this a subscription?",
                a: "No. Pro is a one-time payment. You pay once and keep access forever — no recurring charges, no renewal reminders, no surprises.",
              },
              {
                q: "Do I need an account to use the free tools?",
                a: "No. All free tools work in your browser without signing up. Pro requires an account so your data can sync across devices.",
              },
              {
                q: "Can I upgrade from Free to Pro later?",
                a: "Yes, at any time. Your existing progress and checklist answers carry over — nothing is lost when you upgrade.",
              },
              {
                q: "What payment methods do you accept?",
                a: "All major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay. Payments are processed securely — we never store your card details.",
              },
              {
                q: "Is Pro useful if I'm only applying for one visa?",
                a: "Absolutely. Even for a single application, PDF export alone is worth it — you get a shareable, printable document covering your pathway, eligibility, risk score, and full checklist.",
              },
              {
                q: "What if it's not useful for me?",
                a: "7-day full refund, no questions asked. Just email us at support@visaswitch.com and we'll process it the same day.",
              },
              {
                q: "Is VisaSwitch legal advice?",
                a: "No. VisaSwitch provides structured information and self-assessment tools. It is not a law firm and does not provide legal or migration advice. For complex cases or formal advice, always consult a registered migration agent or immigration lawyer.",
              },
            ]} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 text-center hero-gradient">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse, rgba(200,220,255,1) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>Start your free visa guide</h2>
          <p className="text-zinc-500 text-sm mb-7">No account. No payment. All four steps, right now.</p>
          <Link
            href="/au/guide"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all group"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Start free guide
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
