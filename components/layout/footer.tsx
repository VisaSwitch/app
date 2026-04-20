import Link from "next/link";
import { Globe, ShieldAlert } from "lucide-react";
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
          <div className="flex items-center gap-5 text-sm text-zinc-600">
            {countryList.map((c) => (
              <Link key={c.code} href={`/${c.code}/guide`} className="hover:text-white transition-colors whitespace-nowrap">
                {c.name}
              </Link>
            ))}
            <span className="text-white/[0.15] select-none">|</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-white transition-colors whitespace-nowrap">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div className="mt-8 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05]">
          <ShieldAlert className="w-4 h-4 text-amber-400/80 flex-shrink-0" />
          <p className="text-xs text-amber-300/70 leading-relaxed">
            <span className="font-semibold text-amber-300/90">Not legal advice.</span>{" "}
            Immigration rules change frequently. Always verify requirements with official government sources before lodging any application.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-4 flex items-center justify-center">
          <p className="text-xs text-zinc-700">&copy; {new Date().getFullYear()} VisaSwitch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
