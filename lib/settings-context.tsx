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
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    async function load() {
      // 1. Try Supabase first
      if (isConfigured()) {
        try {
          const { data, error } = await supabase
            .from("site_settings")
            .select("data")
            .eq("id", 1)
            .single();

          if (!error && data?.data && Object.keys(data.data).length > 0) {
            setSettings({ ...defaultSiteSettings, ...data.data });
            // keep localStorage in sync as cache
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
            return;
          }
        } catch {
          // Supabase unavailable — fall through
        }
      }

      // 2. Fall back to localStorage cache
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setSettings({ ...defaultSiteSettings, ...JSON.parse(raw) });
      } catch {
        // use defaults
      }
    }

    load();
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
