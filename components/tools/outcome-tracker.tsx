"use client";
import Link from "next/link";
import {
  CheckCircle, Clock, PartyPopper, XCircle, FileQuestion,
  ArrowRight, RefreshCw, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicationOutcome } from "@/hooks/use-outcome";

interface Props {
  outcome: ApplicationOutcome | null;
  pathwayId: string;
  pathwayName: string;
  countryCode: string;
  onSelect: (o: ApplicationOutcome) => void;
  onReset: () => void;
}

const options: Array<{
  value: ApplicationOutcome;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  activeClass: string;
}> = [
  {
    value: "preparing",
    label: "Preparing",
    sublabel: "Still getting documents ready",
    icon: Clock,
    activeClass: "border-zinc-400/40 bg-zinc-400/10 text-zinc-200",
  },
  {
    value: "applied",
    label: "Applied",
    sublabel: "Application lodged, waiting",
    icon: CheckCircle,
    activeClass: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  },
  {
    value: "rfi",
    label: "RFI received",
    sublabel: "Request for Further Information",
    icon: FileQuestion,
    activeClass: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  },
  {
    value: "approved",
    label: "Approved! 🎉",
    sublabel: "Visa granted",
    icon: PartyPopper,
    activeClass: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  {
    value: "refused",
    label: "Refused",
    sublabel: "Application was not successful",
    icon: XCircle,
    activeClass: "border-red-400/40 bg-red-400/10 text-red-300",
  },
];

const guidance: Record<
  ApplicationOutcome,
  {
    heading: string;
    body: string;
    cta?: {
      label: string;
      href: (cc: string, pid: string) => string;
      icon: React.ElementType;
    };
  }
> = {
  preparing: {
    heading: "Keep going — you're on track",
    body: "Complete each task in order of priority. Run a risk audit before you lodge to catch any weak spots in your application.",
    cta: { label: "Run risk audit", href: (cc, pid) => `/${cc}/audit?pathway=${pid}`, icon: ArrowRight },
  },
  applied: {
    heading: "Application lodged — hang tight",
    body: "Processing times vary. Don't travel offshore without checking if it affects your application. Respond to any government requests promptly.",
  },
  rfi: {
    heading: "Respond carefully and completely",
    body: "An RFI is not a refusal — but how you respond matters. Address every point raised with specific evidence. Consider engaging a migration agent for complex RFIs.",
    cta: { label: "Refusal & RFI recovery guide", href: (cc, pid) => `/${cc}/recovery?pathway=${pid}`, icon: ArrowRight },
  },
  approved: {
    heading: "Congratulations — visa granted! 🎉",
    body: "Check your grant conditions carefully, note the stay period and any work limitations. Ensure any dependants on the same application have also received their grants.",
  },
  refused: {
    heading: "A refusal isn't the end",
    body: "Most refusals can be addressed. Identify the exact refusal grounds from your decision letter and build a targeted reapplication strategy. Act quickly — some appeal windows are short.",
    cta: { label: "Open Refusal Recovery tool", href: (cc, pid) => `/${cc}/recovery?pathway=${pid}`, icon: RefreshCw },
  },
};

export function OutcomeTracker({ outcome, pathwayId, pathwayName, countryCode, onSelect, onReset }: Props) {
  const guide = outcome ? guidance[outcome] : null;
  const CTA = guide?.cta;

  return (
    <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Application status</h3>
          <p className="text-xs text-zinc-600 mt-0.5">Track where you are with {pathwayName}</p>
        </div>
        {outcome && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Status picker */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 md:grid-cols-5">
        {options.map(({ value, label, sublabel, icon: Icon, activeClass }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={cn(
              "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-center transition-all",
              outcome === value
                ? activeClass
                : "border-white/[0.08] bg-white/[0.02] text-zinc-500 hover:border-white/[0.15] hover:text-zinc-300"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-semibold leading-tight">{label}</span>
            <span className="text-xs text-current opacity-60 leading-tight hidden sm:block">{sublabel}</span>
          </button>
        ))}
      </div>

      {/* Contextual guidance */}
      {guide && (
        <div className={cn(
          "mx-4 mb-4 rounded-xl border p-4",
          outcome === "approved" ? "bg-emerald-500/[0.07] border-emerald-500/20" :
          outcome === "refused" ? "bg-red-500/[0.07] border-red-500/20" :
          outcome === "rfi" ? "bg-amber-500/[0.07] border-amber-500/20" :
          "bg-white/[0.03] border-white/[0.08]"
        )}>
          <p className={cn(
            "text-xs font-bold mb-1",
            outcome === "approved" ? "text-emerald-400" :
            outcome === "refused" ? "text-red-400" :
            outcome === "rfi" ? "text-amber-400" :
            "text-white"
          )}>
            {guide.heading}
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed mb-3">{guide.body}</p>
          {CTA && (
            <Link
              href={CTA.href(countryCode, pathwayId)}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all",
                outcome === "refused"
                  ? "bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30"
                  : outcome === "rfi"
                  ? "bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30"
                  : "bg-white text-black hover:bg-zinc-100"
              )}
            >
              <CTA.icon className="w-3.5 h-3.5" />
              {CTA.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
