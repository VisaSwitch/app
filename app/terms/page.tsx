import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — VisaSwitch",
  description: "Terms of Use for VisaSwitch. Read before using the platform.",
};

const sections = [
  {
    title: "1. Acceptance",
    body: `By accessing or using VisaSwitch ("the Service"), you agree to be bound by these Terms of Use. If you do not agree, do not use the Service.`,
  },
  {
    title: "2. What VisaSwitch is",
    body: `VisaSwitch is an information and self-assessment tool designed to help you understand visa options, eligibility factors, and application processes. It is not a migration agent, law firm, government service, or visa consultancy.`,
  },
  {
    title: "3. Not legal advice",
    body: `Nothing on VisaSwitch constitutes legal advice, migration advice, or a guarantee of any outcome. Visa rules change frequently and vary by individual circumstance. Always verify requirements with the relevant official government source and, for complex situations, consult a registered migration professional.`,
  },
  {
    title: "4. No lodgement",
    body: `VisaSwitch does not lodge, submit, or manage visa applications on your behalf. Any information you enter is used solely to generate your personalised guide and is stored locally in your browser (or in your cloud account if you subscribe to Pro).`,
  },
  {
    title: "5. Accuracy",
    body: `We make reasonable efforts to keep content up to date, but we do not warrant that all information is current, complete, or free from error. Use the Service as a starting point, not as your sole source of immigration guidance.`,
  },
  {
    title: "6. Pro subscription",
    body: `The Pro tier is a one-time payment. It grants access to PDF export, cloud sync, and priority support as described on the Pricing page. All sales are subject to our 7-day money-back guarantee. We reserve the right to modify Pro features with reasonable notice.`,
  },
  {
    title: "7. Prohibited use",
    body: `You must not use VisaSwitch to: (a) provide immigration or legal advice to third parties; (b) resell or redistribute our content; (c) attempt to reverse-engineer or scrape the platform; or (d) use the Service in any way that violates applicable law.`,
  },
  {
    title: "8. Intellectual property",
    body: `All content, design, and code on VisaSwitch is owned by or licensed to us. You may not reproduce, distribute, or create derivative works without our prior written consent.`,
  },
  {
    title: "9. Limitation of liability",
    body: `To the maximum extent permitted by law, VisaSwitch and its operators are not liable for any direct, indirect, incidental, or consequential loss arising from your use of the Service — including refusals, errors, or reliance on information provided.`,
  },
  {
    title: "10. Changes",
    body: `We may update these Terms at any time. Continued use of the Service after changes are posted constitutes acceptance. The date below reflects the most recent revision.`,
  },
  {
    title: "11. Contact",
    body: `Questions? Email us at support@visaswitch.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen hero-gradient">

      {/* Hero */}
      <section className="relative overflow-hidden py-20 hero-gradient">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-[20%] w-[500px] h-[300px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, rgba(180,200,255,1) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold text-zinc-500 mb-5 uppercase tracking-widest" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
            Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight" style={{ color: "var(--foreground)" }}>Terms of Use</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Last updated: April 2025</p>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-12 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--section-dark-from))" }} />
      </section>

      {/* Body */}
      <section className="section-dark py-12 flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>{s.title}</h2>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs text-amber-500/60 mb-4">
              VisaSwitch is not a migration agent or legal service. Always verify immigration requirements with official government sources.
            </p>
            <Link href="/privacy" className="text-xs transition-colors" style={{ color: "var(--muted-foreground)" }}>
              Privacy Policy →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
