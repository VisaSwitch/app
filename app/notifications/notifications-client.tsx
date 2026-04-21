"use client";

import { useState, useEffect } from "react";
import {
  Bell, BellOff, Zap, SlidersHorizontal, Clock, DollarSign,
  FileText, TrendingUp, ShieldAlert, Share, Plus, Home,
  CheckCircle, Globe, ChevronDown, Info, Trash2,
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
}

interface UpdatePref {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const COUNTRY_COLOR: Record<string, string> = {
  au: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25",
  uk: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25",
  ca: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
  jp: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
};

const VISAS: VisaWatch[] = [
  // Australia
  { id: "au-417",  country: "Australia",      countryCode: "au", name: "Working Holiday",              subclass: "417" },
  { id: "au-462",  country: "Australia",      countryCode: "au", name: "Work and Holiday",             subclass: "462" },
  { id: "au-500",  country: "Australia",      countryCode: "au", name: "Student Visa",                 subclass: "500" },
  { id: "au-485",  country: "Australia",      countryCode: "au", name: "Temporary Graduate",           subclass: "485" },
  { id: "au-482",  country: "Australia",      countryCode: "au", name: "Temp Skill Shortage",          subclass: "482" },
  { id: "au-494",  country: "Australia",      countryCode: "au", name: "Skilled Employer Sponsored",   subclass: "494" },
  { id: "au-186",  country: "Australia",      countryCode: "au", name: "Employer Nomination Scheme",   subclass: "186" },
  { id: "au-189",  country: "Australia",      countryCode: "au", name: "Skilled Independent",          subclass: "189" },
  { id: "au-190",  country: "Australia",      countryCode: "au", name: "Skilled Nominated",            subclass: "190" },
  { id: "au-491",  country: "Australia",      countryCode: "au", name: "Skilled Work Regional",        subclass: "491" },
  { id: "au-191",  country: "Australia",      countryCode: "au", name: "Permanent Residence Regional", subclass: "191" },
  { id: "au-820",  country: "Australia",      countryCode: "au", name: "Partner Visa",                 subclass: "820/801" },
  { id: "au-188",  country: "Australia",      countryCode: "au", name: "Business Innovation",          subclass: "188" },
  { id: "au-600",  country: "Australia",      countryCode: "au", name: "Visitor Visa",                 subclass: "600" },
  // United Kingdom
  { id: "uk-student",   country: "United Kingdom", countryCode: "uk", name: "Student Visa" },
  { id: "uk-graduate",  country: "United Kingdom", countryCode: "uk", name: "Graduate Visa" },
  { id: "uk-skilled",   country: "United Kingdom", countryCode: "uk", name: "Skilled Worker Visa" },
  { id: "uk-ilr",       country: "United Kingdom", countryCode: "uk", name: "Indefinite Leave to Remain" },
  { id: "uk-talent",    country: "United Kingdom", countryCode: "uk", name: "Global Talent Visa" },
  { id: "uk-family",    country: "United Kingdom", countryCode: "uk", name: "Family Visa (Spouse / Partner)" },
  { id: "uk-innovator", country: "United Kingdom", countryCode: "uk", name: "Innovator Founder Visa" },
  { id: "uk-visitor",   country: "United Kingdom", countryCode: "uk", name: "Standard Visitor Visa" },
  // Canada
  { id: "ca-fsw",     country: "Canada", countryCode: "ca", name: "Federal Skilled Worker (Express Entry)" },
  { id: "ca-cec",     country: "Canada", countryCode: "ca", name: "Canadian Experience Class (Express Entry)" },
  { id: "ca-pnp",     country: "Canada", countryCode: "ca", name: "Provincial Nominee Program (PNP)" },
  { id: "ca-study",   country: "Canada", countryCode: "ca", name: "Study Permit" },
  { id: "ca-pgwp",    country: "Canada", countryCode: "ca", name: "Post-Graduation Work Permit (PGWP)" },
  { id: "ca-lmia",    country: "Canada", countryCode: "ca", name: "Employer Work Permit (LMIA)" },
  { id: "ca-spousal", country: "Canada", countryCode: "ca", name: "Spousal / Partner Sponsorship" },
  { id: "ca-startup", country: "Canada", countryCode: "ca", name: "Start-Up Visa Program" },
  { id: "ca-visitor", country: "Canada", countryCode: "ca", name: "Visitor Visa / eTA" },
  // Japan
  { id: "jp-whv",       country: "Japan", countryCode: "jp", name: "Working Holiday Visa" },
  { id: "jp-student",   country: "Japan", countryCode: "jp", name: "Student Visa" },
  { id: "jp-engineer",  country: "Japan", countryCode: "jp", name: "Engineer / Specialist in Humanities" },
  { id: "jp-hsp",       country: "Japan", countryCode: "jp", name: "Highly Skilled Professional (HSP)" },
  { id: "jp-pr",        country: "Japan", countryCode: "jp", name: "Permanent Resident" },
  { id: "jp-biz",       country: "Japan", countryCode: "jp", name: "Business Manager Visa" },
  { id: "jp-dependent", country: "Japan", countryCode: "jp", name: "Dependent Visa (Spouse / Family)" },
  { id: "jp-visitor",   country: "Japan", countryCode: "jp", name: "Short-Stay / Visa Exemption" },
];

const UPDATE_PREFS: UpdatePref[] = [
  { id: "processing",  icon: Clock,             label: "Processing time changes",  desc: "When median wait times shift significantly" },
  { id: "fees",        icon: DollarSign,        label: "Fee updates",              desc: "When government application fees are revised" },
  { id: "policy",      icon: FileText,          label: "Policy & rule changes",    desc: "When eligibility criteria or conditions update" },
  { id: "points",      icon: TrendingUp,        label: "Points cut-off movements", desc: "When invitation round cut-offs move (AU/CA)" },
  { id: "occupation",  icon: SlidersHorizontal, label: "Occupation list updates",  desc: "When your occupation is added or removed" },
  { id: "refusal",     icon: ShieldAlert,       label: "Refusal recovery tips",    desc: "Guidance if your status is marked as refused" },
];

const BENEFITS = [
  { icon: Zap,             color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", title: "First to know",      desc: "Get notified the moment rules shift for visas you watch." },
  { icon: SlidersHorizontal, color: "bg-blue-500/15 text-blue-700 dark:text-blue-400",       title: "Only what matters",  desc: "No spam — just the updates you chose to follow." },
  { icon: Clock,           color: "bg-amber-500/15 text-amber-700 dark:text-amber-400",      title: "Beat deadlines",     desc: "Points cut-offs and fee changes happen on specific dates." },
  { icon: ShieldAlert,     color: "bg-violet-500/15 text-violet-700 dark:text-violet-400",   title: "Full control",       desc: "Change or disable your preferences any time." },
];

const STEPS = [
  { icon: Share, label: "Tap the Share button",     desc: "Tap ↑ at the bottom of Safari." },
  { icon: Plus,  label: 'Tap "Add to Home Screen"', desc: 'Scroll down and tap ⊕ Add to Home Screen.' },
  { icon: Home,  label: "Open from Home Screen",    desc: "Launch VisaSwitch from your home screen icon." },
];

// ── Main component ────────────────────────────────────────────────────────────

export function NotificationsClient() {
  const [permission, setPermission] = useState<NotifPerm>("default");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [watchedVisas, setWatchedVisas] = useState<Set<string>>(new Set());
  const [updatePrefs, setUpdatePrefs] = useState<Set<string>>(new Set(["processing", "policy", "points"]));
  const [saved, setSaved] = useState(false);
  const [showDisableInfo, setShowDisableInfo] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [clearing, setClearing] = useState(false);
  // Which country groups are expanded in visa watchlist
  const countries = [...new Set(VISAS.map((v) => v.country))];
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());

  useEffect(() => {
    if ("Notification" in window) {
      setPermission((window as Window & { Notification: { permission: string } }).Notification.permission as NotifPerm);
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    try {
      const s = JSON.parse(localStorage.getItem("vs_notif_prefs") ?? "{}");
      if (s.visas) setWatchedVisas(new Set(s.visas));
      if (s.updates) setUpdatePrefs(new Set(s.updates));
    } catch { /* ignore */ }

    // Show confirmation if this page load was triggered by clearCache()
    if (sessionStorage.getItem("vs_just_cleared") === "1") {
      sessionStorage.removeItem("vs_just_cleared");
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 4000);
    }
  }, []);

  async function requestPermission() {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as NotifPerm);
  }

  function toggleVisa(id: string) {
    setWatchedVisas((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function togglePref(id: string) {
    setUpdatePrefs((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleCountryExpand(country: string) {
    setExpandedCountries((prev) => { const n = new Set(prev); n.has(country) ? n.delete(country) : n.add(country); return n; });
  }

  function savePrefs() {
    localStorage.setItem("vs_notif_prefs", JSON.stringify({ visas: [...watchedVisas], updates: [...updatePrefs] }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  async function clearCache() {
    setClearing(true);
    try {
      // 1. Clear all SW caches
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // 2. Unregister all service workers
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      // 3. Wipe only notification preferences
      localStorage.removeItem("vs_notif_prefs");
      // 4. Set a flag so the page knows it just cleared (survives reload via sessionStorage)
      sessionStorage.setItem("vs_just_cleared", "1");
    } catch (e) {
      console.error("clearCache error:", e);
    }
    setCacheCleared(true);
    // Auto-reload after 1.5 s so everything takes effect fresh
    setTimeout(() => window.location.reload(), 1500);
  }

  function turnOffAll() {
    setUpdatePrefs(new Set());
    setWatchedVisas(new Set());
    localStorage.removeItem("vs_notif_prefs");
    setShowDisableInfo(true);
  }

  const allVisaIds = VISAS.map((v) => v.id);
  const allPrefIds = UPDATE_PREFS.map((p) => p.id);
  const allVisasSelected = allVisaIds.every((id) => watchedVisas.has(id));
  const allPrefsSelected = allPrefIds.every((id) => updatePrefs.has(id));

  const groupedVisas = VISAS.reduce<Record<string, VisaWatch[]>>((acc, v) => {
    (acc[v.country] ??= []).push(v);
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="hero-gradient border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border"
            style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <Bell className="w-6 h-6" style={{ color: "var(--foreground)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "var(--foreground)" }}>
            Visa change alerts
          </h1>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "var(--muted-foreground)" }}>
            Get notified when processing times, fees, or requirements change for the visas you&apos;re watching.
          </p>

          {permission !== "granted" && (
            <div className="mt-6">
              {isIOS && !isStandalone ? (
                <p className="text-xs rounded-xl px-4 py-2.5 inline-block border"
                  style={{ color: "var(--muted-foreground)", background: "var(--muted)", borderColor: "var(--border)" }}>
                  Add VisaSwitch to your Home Screen first to enable notifications on iPhone
                </p>
              ) : (
                <button onClick={requestPermission} disabled={permission === "denied"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                  <Bell className="w-4 h-4" />
                  {permission === "denied" ? "Blocked in browser settings" : "Enable notifications"}
                </button>
              )}
            </div>
          )}
          {permission === "granted" && (
            <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 border rounded-full text-xs font-semibold"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Notifications enabled
            </div>
          )}
        </div>
      </section>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── iOS install steps ──────────────────────────────────────── */}
        {isIOS && !isStandalone && (
          <section>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>
              3 steps to get started
            </p>
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className={cn("flex items-center gap-3.5 px-4 py-3", i < STEPS.length - 1 && "border-b")}
                    style={{ borderColor: "var(--border)" }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/25">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{step.label}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Why enable — 2×2 grid (always visible) ───────────────── */}
        <section>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>
            Why turn on notifications?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-xl border p-3.5" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2.5", b.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: "var(--foreground)" }}>{b.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Prefs — hidden on iOS until added to Home Screen ─────── */}
        {(!isIOS || isStandalone) && <>

        {/* ── Notify me about ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              Notify me about
            </p>
            <button onClick={() => setUpdatePrefs(allPrefsSelected ? new Set() : new Set(allPrefIds))}
              className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--foreground)" }}>
              {allPrefsSelected ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            {UPDATE_PREFS.map((pref, i) => {
              const Icon = pref.icon;
              const active = updatePrefs.has(pref.id);
              return (
                <label key={pref.id}
                  className={cn("flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-opacity hover:opacity-80", i < UPDATE_PREFS.length - 1 && "border-b")}
                  style={{ borderColor: "var(--border)" }}>
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    active ? "bg-teal-500/15 text-teal-700 dark:text-teal-400" : "")}
                    style={active ? undefined : { background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold", active ? "text-teal-700 dark:text-teal-400" : "")}
                      style={active ? undefined : { color: "var(--foreground)" }}>{pref.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{pref.desc}</p>
                  </div>
                  <div className={cn("relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0",
                    active ? "bg-teal-600" : "bg-zinc-300 dark:bg-zinc-600")}>
                    <div className={cn("absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform",
                      active ? "translate-x-[20px]" : "translate-x-[2px]")} />
                    <input type="checkbox" checked={active} onChange={() => togglePref(pref.id)} className="sr-only" />
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* ── Visa watchlist ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                Visas you&apos;re watching
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {watchedVisas.size} of {VISAS.length} selected
              </p>
            </div>
            <button onClick={() => setWatchedVisas(allVisasSelected ? new Set() : new Set(allVisaIds))}
              className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--foreground)" }}>
              {allVisasSelected ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="space-y-2.5">
            {Object.entries(groupedVisas).map(([country, visas]) => {
              const code = visas[0].countryCode;
              const expanded = expandedCountries.has(country);
              const countryAllSelected = visas.every((v) => watchedVisas.has(v.id));
              const selectedCount = visas.filter((v) => watchedVisas.has(v.id)).length;

              return (
                <div key={country} className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                  {/* Country header — tap to expand/collapse */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
                    <button onClick={() => toggleCountryExpand(country)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0", COUNTRY_COLOR[code])}>
                        {code.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold flex-1" style={{ color: "var(--foreground)" }}>{country}</span>
                      {selectedCount > 0 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 flex-shrink-0">
                          {selectedCount}
                        </span>
                      )}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform flex-shrink-0", expanded && "rotate-180")}
                        style={{ color: "var(--muted-foreground)" }} />
                    </button>
                    <button
                      onClick={() => {
                        const ids = visas.map((v) => v.id);
                        setWatchedVisas((prev) => {
                          const n = new Set(prev);
                          if (countryAllSelected) ids.forEach((id) => n.delete(id));
                          else ids.forEach((id) => n.add(id));
                          return n;
                        });
                      }}
                      className="text-[11px] font-semibold flex-shrink-0 hover:opacity-70 transition-opacity ml-1"
                      style={{ color: "var(--muted-foreground)" }}>
                      {countryAllSelected ? "None" : "All"}
                    </button>
                  </div>

                  {/* Visa rows — collapsible */}
                  {expanded && visas.map((v, i) => {
                    const checked = watchedVisas.has(v.id);
                    return (
                      <label key={v.id}
                        className={cn("flex items-center gap-3 px-4 py-3 cursor-pointer transition-opacity hover:opacity-80", i < visas.length - 1 && "border-b")}
                        style={{ borderColor: "var(--border)" }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleVisa(v.id)}
                          className="w-4 h-4 rounded accent-teal-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm" style={{ color: "var(--foreground)" }}>
                            {v.subclass && (
                              <span className="text-[11px] font-mono mr-1.5" style={{ color: "var(--muted-foreground)" }}>
                                {v.subclass}
                              </span>
                            )}
                            <span className={checked ? "font-semibold" : ""}>{v.name}</span>
                          </span>
                        </div>
                        {checked && <Globe className="w-3.5 h-3.5 flex-shrink-0 text-teal-600 dark:text-teal-400" />}
                      </label>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Save / Turn off ────────────────────────────────────────── */}
        <section className="pb-8 space-y-3">
          <button onClick={savePrefs}
            disabled={watchedVisas.size === 0 || updatePrefs.size === 0}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90",
              saved ? "bg-emerald-600 text-white" : ""
            )}
            style={saved ? undefined : { background: "var(--primary)", color: "var(--primary-foreground)" }}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved</> : <><Bell className="w-4 h-4" /> Save preferences</>}
          </button>

          <button onClick={turnOffAll}
            className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", background: "var(--muted)" }}>
            <BellOff className="w-3.5 h-3.5" /> Turn off all notifications
          </button>

          {showDisableInfo && (
            <div className="rounded-xl border px-4 py-3.5 flex gap-3" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>Preferences cleared</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  To fully block notifications, go to your browser or phone settings and revoke permission for this site. Browsers don&apos;t allow websites to revoke their own permission.
                </p>
                <button onClick={() => setShowDisableInfo(false)} className="text-xs font-semibold mt-2 hover:opacity-70"
                  style={{ color: "var(--foreground)" }}>
                  Got it
                </button>
              </div>
            </div>
          )}

          {permission === "denied" && (
            <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
              ⚠️ Notifications are blocked. Enable them in your browser settings to receive alerts.
            </p>
          )}

          {/* Divider */}
          <div className="pt-1 border-t" style={{ borderColor: "var(--border)" }} />

          {/* Clear cache */}
          <button onClick={clearCache} disabled={clearing}
            className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", background: "var(--muted)" }}>
            <Trash2 className={cn("w-3.5 h-3.5", clearing && "animate-pulse")} />
            {cacheCleared ? "Cleared — reloading…" : clearing ? "Clearing…" : "Clear cache & reset"}
          </button>

          {cacheCleared && !clearing && (
            <div className="rounded-xl border px-4 py-3.5 flex gap-3" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                All done — cache, service worker, and preferences have been reset. To fully block notifications, revoke permission in your browser or phone settings.
              </p>
            </div>
          )}
        </section>

        </>}

      </div>
    </div>
  );
}
