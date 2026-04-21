import Link from "next/link";
import { Globe } from "lucide-react";
import { countryList } from "@/data";

export function Footer() {
  return (
    <footer className="border-t" style={{ background: "var(--footer-bg)", borderColor: "var(--footer-border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg border flex items-center justify-center" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <Globe className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
          </div>
          <span className="font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Visa<span style={{ color: "var(--muted-foreground)" }}>Switch</span>
          </span>
        </Link>

        {/* Country links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-3" style={{ color: "var(--muted-foreground)" }}>
          {countryList.map((c) => (
            <Link key={c.code} href={`/${c.code}/guide`} className="transition-colors hover:opacity-80">
              {c.name}
            </Link>
          ))}
        </div>

        {/* Page links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-6" style={{ color: "var(--muted-foreground)", opacity: 0.7 }}>
          <Link href="/about" className="transition-colors hover:opacity-100">About</Link>
          <Link href="/pricing" className="transition-colors hover:opacity-100">Pricing</Link>
          <Link href="/privacy" className="transition-colors hover:opacity-100">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:opacity-100">Terms</Link>
        </div>

        {/* Bottom row */}
        <div className="pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5" style={{ borderColor: "var(--footer-border)" }}>
          <p className="text-xs" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>&copy; {new Date().getFullYear()} VisaSwitch. All rights reserved.</p>
          <p className="text-xs text-amber-500/60">Not legal advice. Always verify with official government sources.</p>
        </div>
      </div>
    </footer>
  );
}
