"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Sun, Moon, ChevronDown, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
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
  const router = useRouter();
  const countryCode = pathname.split("/")[1];
  const currentCountry = countryList.find((c) => c.code === countryCode);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: "var(--nav-bg)", borderColor: "var(--nav-border)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              <Globe className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--foreground)" }}>
              Visa<span style={{ color: "var(--muted-foreground)" }}>Switch</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">

            {/* Country switcher pill */}
            {currentCountry && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors hover:opacity-80"
                  style={{ borderColor: "var(--border)", background: "var(--muted)" }}
                >
                  <span className={cn("text-[11px] font-bold px-1.5 py-0.5 rounded", countryMeta[currentCountry.code]?.color)}>
                    {countryMeta[currentCountry.code]?.abbr}
                  </span>
                  <span className="hidden sm:inline text-sm" style={{ color: "var(--muted-foreground)" }}>{currentCountry.name}</span>
                  <ChevronDown className={cn("hidden sm:block w-3.5 h-3.5 transition-transform", open && "rotate-180")} style={{ color: "var(--muted-foreground)" }} />
                </button>

                {/* Dropdown */}
                {open && (
                  <div
                    className="absolute right-0 top-full mt-2 w-44 rounded-xl border overflow-hidden shadow-lg z-50"
                    style={{ background: "var(--nav-bg)", borderColor: "var(--border)" }}
                  >
                    {countryList.map((c) => {
                      const isActive = c.code === currentCountry.code;
                      return (
                        <button
                          key={c.code}
                          onClick={() => {
                            router.push(`/${c.code}`);
                            setOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left",
                            isActive ? "font-semibold" : "hover:opacity-80"
                          )}
                          style={{
                            color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                            background: isActive ? "var(--muted)" : "transparent",
                          }}
                        >
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0", countryMeta[c.code]?.color)}>
                            {countryMeta[c.code]?.abbr}
                          </span>
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            <Link
              href="/notifications"
              className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-105"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </Link>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-105"
                style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}
