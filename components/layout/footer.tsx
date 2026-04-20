import Link from "next/link";
import { Globe } from "lucide-react";
import { countryList } from "@/data";

export function Footer() {
  return (
    <footer className="bg-[#020407] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Main row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* Logo + tagline */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-white/[0.07] border border-white/[0.09] flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <span className="font-bold text-white tracking-tight">
              Visa<span className="text-zinc-500">Switch</span>
            </span>
          </Link>

          {/* All links in one line */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            <span className="text-zinc-700 text-xs font-semibold uppercase tracking-wider">Countries</span>
            {countryList.map((c) => (
              <Link key={c.code} href={`/${c.code}/guide`} className="hover:text-white transition-colors">
                {c.name}
              </Link>
            ))}
            <span className="text-white/[0.08]">·</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

        {/* Bottom micro-row */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-700">&copy; {new Date().getFullYear()} VisaSwitch. All rights reserved.</p>
          <p className="text-xs text-zinc-800">Not legal advice. Always verify with official government sources.</p>
        </div>
      </div>
    </footer>
  );
}
