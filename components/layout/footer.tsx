import Link from "next/link";
import { Globe, Shield, BookOpen, Mail, ArrowRight } from "lucide-react";
import { countryList } from "@/data";

const tools = [
  { href: "/pathways", label: "Pathway Checker" },
  { href: "/planner", label: "Checklist & Timeline" },
  { href: "/audit", label: "Risk Audit" },
  { href: "/recovery", label: "Refusal Recovery" },
];

export function Footer() {
  return (
    <footer className="bg-[#020407] text-zinc-500 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Visa<span className="text-zinc-400">Switch</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6 text-zinc-600">
              Intelligent visa navigation for Australia, UK, Canada, and Japan. Plan smarter. Apply with confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Shield className="w-3.5 h-3.5" />
              <span>Not legal advice. For informational purposes only.</span>
            </div>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Countries</h3>
            <ul className="space-y-3">
              {countryList.map((country) => (
                <li key={country.code}>
                  <Link href={`/${country.code}`} className="text-sm text-zinc-600 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span>{country.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Tools</h3>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={`/au${tool.href}`} className="text-sm text-zinc-600 hover:text-white transition-colors">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-zinc-600 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/pricing" className="text-sm text-zinc-600 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/guides" className="text-sm text-zinc-600 hover:text-white transition-colors flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />Guides</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-600 hover:text-white transition-colors flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-zinc-600 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-zinc-600 hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} VisaSwitch. All rights reserved.
          </p>
          <p className="text-xs text-zinc-800 text-center">
            Immigration rules change frequently. Always verify with official government sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
