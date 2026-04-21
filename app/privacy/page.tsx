import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — VisaSwitch",
  description: "How VisaSwitch handles your data. We store guide progress locally by default.",
};

const sections = [
  {
    title: "1. Overview",
    body: `VisaSwitch is designed with privacy as a default. Your visa guide progress — pathway selections, eligibility answers, risk responses, and checklist state — is stored locally in your browser using localStorage. We do not collect or transmit this data unless you explicitly sign up for a Pro account with cloud sync enabled.`,
  },
  {
    title: "2. Data we collect",
    body: `Free users: no account is required. No personal information is collected or stored on our servers. All guide data lives in your browser and is cleared when you clear your browser data.\n\nPro users: if you create an account, we collect your email address and password hash to authenticate you. We also store your guide state on our servers to enable cloud sync across devices. We do not sell this data.`,
  },
  {
    title: "3. Payment data",
    body: `Payments for Pro are processed by a third-party payment provider (e.g. Stripe). We do not store credit card numbers, bank details, or payment credentials on our servers. Please review the payment provider's privacy policy for how they handle your financial data.`,
  },
  {
    title: "4. Analytics",
    body: `We may collect anonymised, aggregated usage analytics (e.g. which pages are visited, how many users reach each guide step) to improve the product. This data does not include personal identifiers and cannot be traced back to individual users.`,
  },
  {
    title: "5. Cookies",
    body: `We use only essential cookies required to maintain your session if you are signed in. We do not use advertising cookies, third-party tracking pixels, or behavioural profiling tools.`,
  },
  {
    title: "6. Data retention",
    body: `Free users: no server-side data is retained. Your localStorage data persists until you clear it.\n\nPro users: your account data is retained for as long as your account is active. You may request deletion of your account and all associated data by emailing support@visaswitch.com.`,
  },
  {
    title: "7. Third-party services",
    body: `VisaSwitch may link to external government portals, visa application sites, and other resources. We are not responsible for the privacy practices of those sites. Review their policies before submitting personal information.`,
  },
  {
    title: "8. Children",
    body: `VisaSwitch is not intended for use by people under the age of 18. We do not knowingly collect data from minors.`,
  },
  {
    title: "9. Your rights",
    body: `Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data. To exercise these rights, contact us at support@visaswitch.com. We will respond within 30 days.`,
  },
  {
    title: "10. Changes",
    body: `We may update this policy from time to time. Material changes will be noted on this page with a revised date. Continued use of the Service after changes are posted constitutes acceptance.`,
  },
  {
    title: "11. Contact",
    body: `Questions or requests? Email us at support@visaswitch.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen hero-gradient">

      {/* Hero */}
      <section className="relative overflow-hidden py-20 hero-gradient">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-[20%] w-[500px] h-[300px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, rgba(180,200,255,1) 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-zinc-500 mb-5 uppercase tracking-widest">
            Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight" style={{ color: "var(--foreground)" }}>Privacy Policy</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Last updated: April 2025</p>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-[#04060c] pointer-events-none" />
      </section>

      {/* Body */}
      <section className="section-dark py-12 flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* TL;DR */}
          <div className="glass rounded-xl p-5 mb-10" style={{ border: "1px solid var(--border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--muted-foreground)" }}>tl;dr</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              Your guide progress is stored in your browser only. We never send it anywhere unless you sign up for cloud sync. No ads. No tracking. No data sales.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>{s.title}</h2>
                {s.body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-zinc-500 leading-relaxed mb-2 last:mb-0">{para}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs text-amber-500/60 mb-4">
              VisaSwitch is not a migration agent or legal service. Always verify immigration requirements with official government sources.
            </p>
            <Link href="/terms" className="text-xs text-zinc-600 hover:text-white transition-colors">
              Terms of Use →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
