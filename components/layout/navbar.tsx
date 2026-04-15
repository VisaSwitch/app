"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryList } from "@/data";

const tools = [
  { href: "/pathways", label: "Pathway Checker", description: "Find visas you qualify for" },
  { href: "/planner", label: "Checklist & Timeline", description: "Plan your application step by step" },
  { href: "/audit", label: "Risk Audit", description: "Analyse your chances before lodging" },
  { href: "/recovery", label: "Refusal Recovery", description: "Recover from a visa rejection" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const pathname = usePathname();

  const countryCode = pathname.split("/")[1];
  const currentCountry = countryList.find((c) => c.code === countryCode);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Visa<span className="text-blue-600">Switch</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Countries Dropdown */}
            <div className="relative" onMouseEnter={() => setCountriesOpen(true)} onMouseLeave={() => setCountriesOpen(false)}>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
                {currentCountry ? (
                  <span>{currentCountry.name}</span>
                ) : (
                  <span>Countries</span>
                )}
                <ChevronDown className={cn("w-4 h-4 transition-transform", countriesOpen && "rotate-180")} />
              </button>
              {countriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  {countryList.map((country) => (
                    <Link
                      key={country.code}
                      href={`/${country.code}`}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors",
                        pathname.startsWith(`/${country.code}`)
                          ? "text-blue-600 font-medium"
                          : "text-slate-700"
                      )}
                    >
                      <span>{country.name}</span>
                      <span className="text-xs text-slate-400 uppercase">{country.code}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
                Tools
                <ChevronDown className={cn("w-4 h-4 transition-transform", toolsOpen && "rotate-180")} />
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  {tools.map((tool) => {
                    const base = currentCountry ? `/${currentCountry.code}` : "/au";
                    return (
                      <Link
                        key={tool.href}
                        href={`${base}${tool.href}`}
                        className="flex flex-col px-4 py-3 hover:bg-slate-50 transition-colors group"
                      >
                        <span className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{tool.label}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{tool.description}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm shadow-blue-200"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">Countries</p>
            {countryList.map((country) => (
              <Link
                key={country.code}
                href={`/${country.code}`}
                className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {country.name}
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">Tools</p>
            {tools.map((tool) => {
              const base = currentCountry ? `/${currentCountry.code}` : "/au";
              return (
                <Link
                  key={tool.href}
                  href={`${base}${tool.href}`}
                  className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {tool.label}
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
            <div className="pt-3 space-y-2">
              <Link href="/sign-in" className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
              <Link href="/sign-up" className="block px-3 py-2.5 text-sm font-semibold text-white text-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg" onClick={() => setMobileOpen(false)}>
                Get started free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
