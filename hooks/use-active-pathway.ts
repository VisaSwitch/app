"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vs_active_pathway";

export interface StoredPathway {
  pathwayId: string;
  pathwayName: string;
  subclass?: string | null;
  countryCode: string;
  countryName: string;
}

export function useActivePathway(countryCode: string) {
  const [active, setActive] = useState<StoredPathway | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredPathway;
        if (parsed.countryCode === countryCode) setActive(parsed);
      }
    } catch {}
    setLoaded(true);
  }, [countryCode]);

  const save = useCallback((pathway: StoredPathway) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pathway)); } catch {}
    setActive(pathway);
  }, []);

  const clear = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setActive(null);
  }, []);

  return { active, save, clear, loaded };
}
