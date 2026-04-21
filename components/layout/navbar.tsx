"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryList } from "@/data";

const countryMeta: Record<string, { abbr: string; color: string }> = {
  au: { abbr: "AU", color: "bg-blue-500/15 text-blue-300 border border-blue-500/25" },
  uk: { abbr: "UK", color: "bg-violet-500/15 text-violet-300 border border-violet-500/25" },
  ca: { abbr: "CA", color: "bg-red-500/15 text-red-300 border border-red-500/25" },
  jp: { abbr: "JP", color: "bg-amber-500/15 text-amber-300 border border-amber-500/25" },
};

export function Navbar() {
  const pathname = usePathname();
  const countryCode = pathname.split("/")[1];
  const currentCountry = countryList.find((c) => c.code === countryCode);
  const base = currentCountry ? `/${currentCountry.code}` : "/au";

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/[0.07]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center border border-white/[0.08]">
              <Globe className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Visa<span className="text-zinc-400">Switch</span>
            </span>
          </Link>

          {/* Country context pill — only shown when inside a country */}
          {currentCountry && (
            <Link
              href={`/${currentCountry.code}`}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
            >
              <span className={cn("text-[11px] font-bold px-1.5 py-0.5 rounded", countryMeta[currentCountry.code]?.color)}>
                {countryMeta[currentCountry.code]?.abbr}
              </span>
              <span className="text-sm text-zinc-400">{currentCountry.name}</span>
            </Link>
          )}

        </div>
      </nav>
    </header>
  );
}
