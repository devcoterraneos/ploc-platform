"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultSiteSettings } from "./data";
import type { SiteSettings } from "./types";
import supabase, { isConfigured } from "./supabase";

const STORAGE_KEY = "ploc:site_settings";
const SettingsContext = createContext<SiteSettings>(defaultSiteSettings);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Lazy initializer: reads localStorage synchronously before the first render,
  // so components never paint the hardcoded defaults when cached settings exist.
  // typeof window guard prevents errors during static build / SSR.
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window === "undefined") return defaultSiteSettings;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return { ...defaultSiteSettings, ...parsed };
        }
      }
    } catch { /* no cache yet */ }
    return defaultSiteSettings;
  });

  // Background sync with Supabase — localStorage already loaded above
  useEffect(() => {
    if (!isConfigured()) return;
    supabase
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.data && Object.keys(data.data).length > 0) {
          setSettings({ ...defaultSiteSettings, ...data.data });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        }
      })
      .catch(() => { /* Supabase unavailable — localStorage state is fine */ });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SiteSettings {
  return useContext(SettingsContext);
}

/** Saves to Supabase + localStorage cache */
export async function persistSettings(
  data: Record<string, string | boolean>
): Promise<void> {
  // Always update localStorage immediately (instant UI feedback)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* silent */ }

  // Persist to Supabase if configured
  if (isConfigured()) {
    try {
      await supabase
        .from("site_settings")
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
    } catch { /* silent — localStorage is the fallback */ }
  }
}
