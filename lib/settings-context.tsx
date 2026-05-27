"use client";

/**
 * settings-context.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Puente entre el admin y la landing.
 *
 * - El admin guarda en localStorage con persistSettings()
 * - SettingsProvider lee localStorage al montar y provee los valores
 * - useSettings() devuelve los settings activos en cualquier componente
 *
 * Cuando se conecte Supabase: reemplazar localStorage por fetch a la tabla
 * site_settings — la interfaz de useSettings() no cambia.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultSiteSettings } from "./data";
import type { SiteSettings } from "./types";

const STORAGE_KEY = "ploc:site_settings";

const SettingsContext = createContext<SiteSettings>(defaultSiteSettings);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSettings({ ...defaultSiteSettings, ...JSON.parse(raw) });
      }
    } catch {
      // localStorage no disponible o JSON inválido — usar defaults
    }
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

/** Hook para leer settings en cualquier componente cliente */
export function useSettings(): SiteSettings {
  return useContext(SettingsContext);
}

/** Llamar desde el admin al guardar */
export function persistSettings(data: Record<string, string | boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silencioso
  }
}
