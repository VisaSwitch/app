"use client";

import { useState, useEffect } from "react";
import {
  Bell, BellOff, Zap, SlidersHorizontal, Clock, DollarSign,
  FileText, TrendingUp, ShieldAlert, Share, Plus, Home,
  CheckCircle, ChevronDown, Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type NotifPerm = "default" | "granted" | "denied";

interface VisaWatch {
  id: string;
  country: string;
  countryCode: string;
  name: string;
  subclass?: string;
  color: string;
}

interface UpdatePref {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const VISAS: VisaWatch[] = [
  { id: "au-485", country: "Australia", countryCode: "au", name: "Temporary Graduate", subclass: "485", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/25" },
  { id: "au-189", country: "Australia", countryCode: "au", name: "Skilled Independent", subclass: "189", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/25" },
  { id: "au-190", country: "Australia", countryCode: "au", name: "Skilled Nominated", subclass: "190", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/25" },
  { id: "au-482", country: "Australia", countryCode: "au", name: "Temp Skill Shortage", subclass: "482", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/25" },
  { id: "uk-skilled", country: "United Kingdom", countryCode: "uk", name: "Skilled Worker", color: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-500/25" },
  { id: "uk-graduate", country: "United Kingdom", countryCode: "uk", name: "Graduate Route", color: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-500/25" },
  { id: "ca-express", country: "Canada", countryCode: "ca", name: "Express Entry", color: "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/25" },
  { id: "jp-engineer", country: "Japan", countryCode: "jp", name: "Engineer / Specialist", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25" },
];

const UPDATE_PREFS: UpdatePref[] = [
  { id: "processing",  icon: Clock,        label: "Processing time changes",       desc: "When median wait times increase or decrease significantly" },
  { id: "fees",        icon: DollarSign,   label: "Fee updates",                   desc: "When government application fees are revised" },
  { id: "policy",      icon: FileText,     label: "Policy & rule changes",         desc: "When eligibility criteria or conditions are updated" },
  { id: "points",      icon: TrendingUp,   label: "Points cut-off movements",      desc: "When invitation round cut-offs move up or down (AU/CA)" },
  { id: "occupation",  icon: SlidersHorizontal, label: "Occupation list updates",  desc: "When your occupation is added or removed from skills lists" },
  { id: "refusal",     icon: ShieldAlert,  label: "Refusal recovery tips",         desc: "Periodic guidance if you've marked your status as refused" },
];

const BENEFITS = [
  {
    icon: Zap,
    color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    title: "Be first to know",
    desc: "Visa rules change without warning. Get notified the moment processing times, fees, or eligibility criteria shift for the visas you're watching.",
  },
  {
    icon: SlidersHorizontal,
    color: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    title: "Only what you care about",
    desc: "You choose which visas and which types of updates matter to you. No spam, no noise — just relevant changes.",
  },
  {
    icon: Clock,
    color: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    title: "Never miss a deadline",
    desc: "Points cut-offs, occupation list reviews, and fee increases happen on specific dates. Advance notice lets you act in time.",
  },
  {
    icon: ShieldAlert,
    color: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    title: "Turn off any time",
    desc: "Full control, always. Change your preferences or disable notifications completely from this page — no account needed.",
  },
];

const STEPS = [
  { icon: Share,  label: "Tap the Share button",   desc: 'Tap ↑ at the bottom of your Safari browser.' },
  { icon: Plus,   label: 'Tap "Add to Home Screen"', desc: 'Scroll down and tap ⊕ "Add to Home Screen".' },
  { icon: Home,   label: "Open from your Home Screen", desc: "Launch VisaSwitch from the icon on your home screen to enable notifications." },
];

// ── Main component ────────────────────────────────────────────────────────────

export function NotificationsClient() {
  const [permission, setPermission] = useState<NotifPerm>("default");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [watchedVisas, setWatchedVisas] = useState<Set<string>>(new Set(["au-485"]));
  const [updatePrefs, setUpdatePrefs] = useState<Set<string>>(new Set(["processing", "policy", "points"]));
  const [showVisaSelector, setShowVisaSelector] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPermission((Notification?.permission ?? "default") as NotifPerm);
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  async function requestPermission() {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as NotifPerm);
  }

  function toggleVisa(id: string) {
    setWatchedVisas((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function togglePref(id: string) {
    setUpdatePrefs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function savePrefs() {
    // In production: persist to localStorage / backend
    const prefs = { visas: [...watchedVisas], updates: [...updatePrefs] };
    localStorage.setItem("vs_notif_prefs", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const groupedVisas = VISAS.reduce<Record<string, VisaWatch[]>>((acc, v) => {
    (acc[v.country] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-lg mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5 border border-white/30">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Stay ahead of visa changes
          </h1>
          <p className="text-teal-100 text-sm leading-relaxed max-w-sm mx-auto">
            Get instant alerts when processing times, fees, or requirements change for the visas you&apos;re watching — before it affects your application.
          </p>
          {permission !== "granted" && (
            <div className="mt-7">
              {isIOS && !isStandalone ? (
                <p className="text-xs text-teal-200 bg-white/10 rounded-xl px-4 py-2.5 inline-block border border-white/20">
                  📲 Add VisaSwitch to your Home Screen first to enable notifications on iPhone
                </p>
              ) : (
                <button
                  onClick={requestPermission}
                  disabled={permission === "denied"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 text-sm font-bold rounded-xl hover:bg-teal-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bell className="w-4 h-4" />
                  {permission === "denied" ? "Notifications blocked in browser" : "Enable notifications"}
                </button>
              )}
            </div>
          )}
          {permission === "granted" && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white text-xs font-semibold">
              <CheckCircle className="w-4 h-4" /> Notifications enabled
            </div>
          )}
        </div>
      </section>

      <div className="max-w-lg mx-auto w-full px-4 sm:px-6 py-8 space-y-6">

        {/* ── iOS install steps (shown if on iOS and not standalone) ───── */}
        {isIOS && !isStandalone && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>3 quick steps to get started</p>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-4 px-5 py-4" style={{ borderColor: "var(--border)" }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/25">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>{step.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Why notifications ─────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Why turn on notifications?</p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex items-start gap-4 px-5 py-4" style={{ borderColor: "var(--border)" }}>
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", b.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold mb-0.5" style={{ color: "var(--foreground)" }}>{b.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Visa watchlist ────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowVisaSelector((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--border)", background: "var(--muted)" }}
          >
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Visas you&apos;re watching</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{watchedVisas.size} selected</p>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", showVisaSelector && "rotate-180")} style={{ color: "var(--muted-foreground)" }} />
          </button>

          {/* Selected visas summary */}
          {!showVisaSelector && watchedVisas.size > 0 && (
            <div className="px-5 py-4 flex flex-wrap gap-2">
              {VISAS.filter((v) => watchedVisas.has(v.id)).map((v) => (
                <span key={v.id} className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", v.color)}>
                  {v.subclass ? `${v.country.split(" ")[0]} ${v.subclass}` : v.country.split(" ")[0]} — {v.name}
                </span>
              ))}
            </div>
          )}

          {showVisaSelector && (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {Object.entries(groupedVisas).map(([country, visas]) => (
                <div key={country}>
                  <div className="px-5 py-2.5" style={{ background: "var(--muted)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{country}</p>
                  </div>
                  {visas.map((v) => {
                    const checked = watchedVisas.has(v.id);
                    return (
                      <label key={v.id} className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:opacity-80 transition-opacity" style={{ borderColor: "var(--border)" }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleVisa(v.id)}
                          className="w-4 h-4 rounded accent-teal-600 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                            {v.subclass && <span className="font-normal" style={{ color: "var(--muted-foreground)" }}>Subclass {v.subclass} — </span>}
                            {v.name}
                          </span>
                        </div>
                        {checked && <Globe className="w-3.5 h-3.5 flex-shrink-0 text-teal-600 dark:text-teal-400" />}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Update type toggles ───────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Notify me about</p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {UPDATE_PREFS.map((pref) => {
              const Icon = pref.icon;
              const active = updatePrefs.has(pref.id);
              return (
                <label key={pref.id} className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:opacity-80 transition-opacity" style={{ borderColor: "var(--border)" }}>
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                    active
                      ? "bg-teal-500/15 text-teal-700 dark:text-teal-400"
                      : ""
                  )}
                    style={active ? undefined : { background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold transition-colors", active ? "text-teal-700 dark:text-teal-400" : "")}
                      style={active ? undefined : { color: "var(--foreground)" }}>
                      {pref.label}
                    </p>
                    <p className="text-xs leading-snug mt-0.5" style={{ color: "var(--muted-foreground)" }}>{pref.desc}</p>
                  </div>
                  {/* Toggle switch */}
                  <div className={cn("relative w-11 h-6 rounded-full transition-colors flex-shrink-0", active ? "bg-teal-600" : "bg-zinc-300 dark:bg-zinc-600")}>
                    <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform", active ? "translate-x-5" : "translate-x-0.5")} />
                    <input type="checkbox" checked={active} onChange={() => togglePref(pref.id)} className="sr-only" />
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Save button ───────────────────────────────────────────────── */}
        <div className="pb-8">
          {permission !== "granted" && !isIOS && (
            <p className="text-xs text-center mb-4" style={{ color: "var(--muted-foreground)" }}>
              {permission === "denied"
                ? "⚠️ Notifications are blocked. Enable them in your browser settings, then save."
                : "Enable notifications above to receive alerts."}
            </p>
          )}
          <button
            onClick={savePrefs}
            disabled={watchedVisas.size === 0 || updatePrefs.size === 0}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
              saved ? "bg-emerald-600 text-white" : "bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Preferences saved</>
            ) : (
              <><Bell className="w-4 h-4" /> Save preferences</>
            )}
          </button>
          {(permission === "granted" || isIOS) && (
            <button
              onClick={() => { setUpdatePrefs(new Set()); setWatchedVisas(new Set()); }}
              className="w-full mt-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 hover:opacity-80"
              style={{ color: "var(--muted-foreground)" }}
            >
              <BellOff className="w-3.5 h-3.5" /> Turn off all notifications
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
