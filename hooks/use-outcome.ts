"use client";
import { useState, useEffect, useCallback } from "react";

export type ApplicationOutcome =
  | "preparing"
  | "applied"
  | "approved"
  | "refused"
  | "rfi";

interface StoredOutcome {
  outcome: ApplicationOutcome;
  pathwayId: string;
  countryCode: string;
  updatedAt: string; // ISO date
}

const KEY = "vs_application_outcome";

export function useOutcome(countryCode: string, pathwayId: string) {
  const [outcome, setOutcome] = useState<ApplicationOutcome | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOutcome;
        if (parsed.countryCode === countryCode && parsed.pathwayId === pathwayId) {
          setOutcome(parsed.outcome);
        }
      }
    } catch {}
    setLoaded(true);
  }, [countryCode, pathwayId]);

  const save = useCallback((o: ApplicationOutcome) => {
    const stored: StoredOutcome = {
      outcome: o,
      pathwayId,
      countryCode,
      updatedAt: new Date().toISOString(),
    };
    try { localStorage.setItem(KEY, JSON.stringify(stored)); } catch {}
    setOutcome(o);
  }, [countryCode, pathwayId]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    setOutcome(null);
  }, []);

  return { outcome, save, reset, loaded };
}
