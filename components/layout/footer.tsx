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
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Visa<span className="text-blue-400">Switch</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Intelligent visa navigation for Australia, UK, Canada, and Japan. Plan smarter. Apply with confidence.
            </p>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>Not legal advice. For informational purposes only.</span>
            </div>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Countries</h3>
            <ul className="space-y-2.5">
              {countryList.map((country) => (
                <li key={country.code}>
                  <Link href={`/${country.code}`} className="text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span>{country.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={`/au${tool.href}`} className="text-sm hover:text-white transition-colors">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">About</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/guides" className="text-sm hover:text-white transition-colors flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />Guides</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Contact</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} VisaSwitch. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 text-center">
            Immigration rules change frequently. Always verify with official government sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
