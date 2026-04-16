"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, Globe, ArrowRight,
  ListChecks, BarChart3, RefreshCw, MapPin,
  LogIn, Sparkles, Layers, Tag, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { countryList } from "@/data";

const countryMeta: Record<string, { abbr: string; tagline: string; color: string }> = {
  au: { abbr: "AU", tagline: "14 pathways · Home Affairs", color: "bg-blue-500/15 text-blue-300 border border-blue-500/20" },
  uk: { abbr: "UK", tagline: "8 pathways · UKVI", color: "bg-rose-500/15 text-rose-300 border border-rose-500/20" },
  ca: { abbr: "CA", tagline: "9 pathways · IRCC", color: "bg-red-500/15 text-red-300 border border-red-500/20" },
  jp: { abbr: "JP", tagline: "8 pathways · Immigration Bureau", color: "bg-zinc-700/40 text-zinc-300 border border-zinc-600/30" },
};

const toolGroups = [
  {
    heading: "Find your path",
    items: [
      {
        href: "/pathways",
        icon: Globe,
        label: "Pathway Checker",
        description: "Find visas you qualify for, ranked by fit",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
      },
      {
        href: "/planner",
        icon: ListChecks,
        label: "Checklist & Timeline",
        description: "Step-by-step plan with document deadlines",
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-400",
      },
    ],
  },
  {
    heading: "Strengthen your case",
    items: [
      {
        href: "/audit",
        icon: BarChart3,
        label: "Pre-lodgement Risk Audit",
        description: "Identify weak spots before you submit",
        iconBg: "bg-violet-500/10",
        iconColor: "text-violet-400",
      },
      {
        href: "/recovery",
        icon: RefreshCw,
        label: "Refusal Recovery",
        description: "Recover from a refusal with a clear plan",
        iconBg: "bg-rose-500/10",
        iconColor: "text-rose-400",
      },
    ],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"countries" | "tools" | null>(null);
  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement>(null);

  const countryCode = pathname.split("/")[1];
  const currentCountry = countryList.find((c) => c.code === countryCode);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function toggle(menu: "countries" | "tools") {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }

  const base = currentCountry ? `/${currentCountry.code}` : "/au";

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/[0.07]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={navRef}>
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center shadow-sm border border-white/[0.08]">
              <Globe className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Visa<span className="text-zinc-300">Switch</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">

            {/* Countries */}
            <div className="relative">
              <button
                onClick={() => toggle("countries")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  openMenu === "countries"
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                {currentCountry ? (
                  <>
                    <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", countryMeta[currentCountry.code]?.color)}>
                      {countryMeta[currentCountry.code]?.abbr}
                    </span>
                    <span>{currentCountry.name}</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Countries</span>
                  </>
                )}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-150", openMenu === "countries" && "rotate-180")} />
              </button>

              {openMenu === "countries" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.09] overflow-hidden z-50">
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-1">Select country</p>
                  </div>
                  <div className="px-2 pb-2 space-y-0.5">
                    {countryList.map((country) => {
                      const meta = countryMeta[country.code];
                      const active = pathname.startsWith(`/${country.code}`);
                      return (
                        <Link
                          key={country.code}
                          href={`/${country.code}`}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group",
                            active ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
                          )}
                        >
                          <span className={cn("text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", meta.color)}>
                            {meta.abbr}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className={cn("text-sm font-semibold", active ? "text-white" : "text-zinc-200 group-hover:text-white")}>
                              {country.name}
                            </div>
                            <div className="text-xs text-zinc-600 mt-0.5">{meta.tagline}</div>
                          </div>
                          {active && <div className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tools */}
            <div className="relative">
              <button
                onClick={() => toggle("tools")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  openMenu === "tools"
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tools</span>
                </>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-150", openMenu === "tools" && "rotate-180")} />
              </button>

              {openMenu === "tools" && (
                <div className="absolute top-full left-0 mt-2 w-[520px] bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.09] overflow-hidden z-50">
                  <div className="grid grid-cols-2 gap-0 divide-x divide-white/[0.06]">
                    {toolGroups.map((group) => (
                      <div key={group.heading} className="p-3">
                        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">
                          {group.heading}
                        </p>
                        <div className="space-y-0.5">
                          {group.items.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <Link
                                key={tool.href}
                                href={`${base}${tool.href}`}
                                className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
                              >
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/[0.07]", tool.iconBg)}>
                                  <Icon className={cn("w-4 h-4", tool.iconColor)} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                    {tool.label}
                                  </div>
                                  <div className="text-xs text-zinc-600 mt-0.5 leading-snug">{tool.description}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer strip */}
                  <div className="border-t border-white/[0.06] px-4 py-2.5 bg-white/[0.03] flex items-center justify-between">
                    <span className="text-xs text-zinc-600">All tools update per selected country</span>
                    <Link
                      href={`/${currentCountry?.code ?? "au"}`}
                      className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      {currentCountry ? `${currentCountry.name} hub` : "Country hub"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <Tag className="w-3.5 h-3.5" />
              Pricing
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              About
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg border border-white/[0.12] hover:border-white/25 hover:bg-white/[0.06] transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white text-black rounded-lg hover:bg-zinc-100 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get started free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-zinc-950">
          <div className="px-4 py-4 space-y-1">
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider px-3 py-1">Countries</p>
            {countryList.map((country) => {
              const meta = countryMeta[country.code];
              return (
                <Link
                  key={country.code}
                  href={`/${country.code}`}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.05] rounded-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className={cn("text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", meta.color)}>
                    {meta.abbr}
                  </span>
                  <div>
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-zinc-600">{meta.tagline}</div>
                  </div>
                </Link>
              );
            })}
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider px-3 pt-4 pb-1">Tools</p>
            {toolGroups.flatMap((g) => g.items).map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={`${base}${tool.href}`}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.05] rounded-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/[0.07]", tool.iconBg)}>
                    <Icon className={cn("w-3.5 h-3.5", tool.iconColor)} />
                  </div>
                  <div>
                    <div className="font-medium">{tool.label}</div>
                    <div className="text-xs text-zinc-600">{tool.description}</div>
                  </div>
                </Link>
              );
            })}
            <div className="pt-4 space-y-2">
              <Link
                href="/sign-in"
                className="block px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/[0.05] rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="block px-3 py-2.5 text-sm font-semibold text-black text-center bg-white rounded-xl hover:bg-zinc-100 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
