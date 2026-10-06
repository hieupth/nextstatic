"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentLocale } from "../utils/basepath.js";

// Locale type for type safety
type Locale = string;

// Locale context interface
interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  availableLocales: Locale[];
}

// LocaleProvider props
interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
  availableLocales?: Locale[];
  /** Persist the locale to localStorage. Set false for fixed-locale trees
   * (e.g. a pre-locale landing page) so a stored value can never retarget
   * their links after mount. */
  persist?: boolean;
}

// Module-level default so the effect dependency identity is stable across
// renders (a default parameter would create a new array every render and
// re-fire the mount effect, silently reverting setLocale calls).
const DEFAULT_LOCALES: Locale[] = ["en", "vi"];
const STORAGE_KEY = "nextstatic:locale";
const LEGACY_STORAGE_KEY = "preferred-locale";

// localStorage can THROW on access (blocked site data, some webviews) —
// never let storage crash the tree.
const readStorage = (k: string): string | null => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const writeStorage = (k: string, v: string) => {
  try { localStorage.setItem(k, v); } catch { /* blocked */ }
};
const removeStorage = (k: string) => {
  try { localStorage.removeItem(k); } catch { /* blocked */ }
};

/**
 * Provider for internationalization with URL detection and localStorage persistence.
 *
 * Static-first (recommended — zero flicker): with locale-in-route
 * (`app/[locale]/...` + generateStaticParams) pass the route param in —
 * `defaultLocale={params.locale}` — so prerendered HTML already carries the
 * right locale and every Link prefix is correct in the frozen output.
 * Dynamic single-tree apps fall back to client-side URL detection in the
 * mount effect (brief default-locale first paint before correction).
 *
 * @param {LocaleProviderProps} props - Configuration props.
 * @returns {React.ReactElement} Context provider.
 */
export function LocaleProvider({
  children,
  defaultLocale = "en",
  availableLocales = DEFAULT_LOCALES,
  persist = true,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  // Stable dependency: compare by content, not array identity.
  const localesKey = availableLocales.join(",");

  // Detect locale from URL on mount (basePath-aware, incl. multi-segment
  // base paths — see parseLocaleFromPath).
  useEffect(() => {
    if (typeof window !== "undefined") {
      const locales = localesKey.split(",").filter(Boolean);
      const detected = getCurrentLocale(locales);
      if (detected) {
        setLocaleState(detected);
      } else if (persist) {
        let savedLocale = readStorage(STORAGE_KEY);
        // One-time migration from the pre-namespaced key.
        if (!savedLocale) {
          savedLocale = readStorage(LEGACY_STORAGE_KEY);
          if (savedLocale) {
            removeStorage(LEGACY_STORAGE_KEY);
          }
        }
        if (savedLocale && locales.includes(savedLocale)) {
          setLocaleState(savedLocale);
          if (readStorage(STORAGE_KEY) !== savedLocale) {
            writeStorage(STORAGE_KEY, savedLocale);
          }
        }
      }
    }
  }, [localesKey, persist]);

  // Set locale and persist to localStorage (only valid locales are stored)
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (
      persist &&
      typeof window !== "undefined" &&
      localesKey.split(",").includes(newLocale)
    ) {
      writeStorage(STORAGE_KEY, newLocale);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, availableLocales }}>
      {children}
    </LocaleContext.Provider>
  );
}

// Default context consumed when no LocaleProvider is mounted. An empty
// locale means "no locale prefixing": Link degrades to a basePath-only
// Link — the behavior a single-locale static site expects — instead of
// crashing at prerender. setLocale outside a provider is a programming
// error surface: warn once, keep the no-op honest.
const disconnectedWarning = { warned: false };
const DEFAULT_LOCALE_CONTEXT: LocaleContextType = {
  locale: "",
  setLocale: () => {
    if (!disconnectedWarning.warned) {
      disconnectedWarning.warned = true;
      console.warn(
        "[nextstatic] useLocale().setLocale was called without a LocaleProvider — the update is ignored. Wrap the tree in <LocaleProvider> to manage locale."
      );
    }
  },
  availableLocales: [],
};

const LocaleContext = createContext<LocaleContextType>(DEFAULT_LOCALE_CONTEXT);

/**
 * Hook for accessing locale context in components.
 * Without a LocaleProvider it returns a safe default: locale "" (Link
 * prefixes basePath only), no-op setLocale (warns once), empty
 * availableLocales.
 * @returns {LocaleContextType} Locale context.
 */
export function useLocale() {
  return useContext(LocaleContext);
}