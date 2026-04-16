"use client";
import Link from "next/link";
import { MapPin, X, ListChecks, BarChart3, RefreshCw, Globe } from "lucide-react";
import type { StoredPathway } from "@/hooks/use-active-pathway";

interface Props {
  active: StoredPathway;
  currentTool: "pathways" | "planner" | "audit" | "recovery";
  onClear: () => void;
}

const toolLinks = [
  { key: "pathways", label: "Pathways", href: (c: string, _p: string) => `/${c}/pathways`, Icon: Globe },
  { key: "planner", label: "Checklist", href: (c: string, p: string) => `/${c}/planner?pathway=${p}`, Icon: ListChecks },
  { key: "audit", label: "Risk Audit", href: (c: string, p: string) => `/${c}/audit?pathway=${p}`, Icon: BarChart3 },
  { key: "recovery", label: "Recovery", href: (c: string, p: string) => `/${c}/recovery?pathway=${p}`, Icon: RefreshCw },
] as const;

export function ActivePathwayBanner({ active, currentTool, onClear }: Props) {
  const pathwayLabel = active.subclass
    ? `Subclass ${active.subclass} — ${active.pathwayName}`
    : active.pathwayName;

  return (
    <div className="glass border-b border-white/[0.08] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
        {/* Pathway indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span className="text-xs text-zinc-500 flex-shrink-0">Tracking:</span>
          <span className="text-xs font-semibold text-white truncate">{pathwayLabel}</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-3 bg-white/10 flex-shrink-0" />

        {/* Quick-jump links */}
        <div className="flex items-center gap-1 flex-wrap">
          {toolLinks
            .filter((t) => t.key !== currentTool)
            .map(({ key, label, href, Icon }) => (
              <Link
                key={key}
                href={href(active.countryCode, active.pathwayId)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all"
              >
                <Icon className="w-3 h-3 text-zinc-500" />
                <span className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">{label}</span>
              </Link>
            ))}
        </div>

        {/* Spacer + dismiss */}
        <button
          onClick={onClear}
          className="ml-auto flex items-center gap-1 text-zinc-600 hover:text-zinc-400 transition-colors"
          aria-label="Clear active pathway"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
