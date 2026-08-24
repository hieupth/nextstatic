"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

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
}

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
  availableLocales = ["en", "vi"],
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Detect locale from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const pathParts = path.split("/").filter(Boolean);

      const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";
      const basePathParts = basePath.split("/").filter(Boolean);
      let potentialLocale = "";

      if (basePathParts.length > 0) {
        const basePathIndex = pathParts.findIndex(part => part === basePathParts[0]);
        if (basePathIndex !== -1 && pathParts[basePathIndex + 1]) {
          potentialLocale = pathParts[basePathIndex + 1];
        }
      } else {
        potentialLocale = pathParts[0];
      }

      if (potentialLocale && availableLocales.includes(potentialLocale)) {
        setLocaleState(potentialLocale);
      } else {
        const savedLocale = localStorage.getItem("preferred-locale");
        if (savedLocale && availableLocales.includes(savedLocale)) {
          setLocaleState(savedLocale);
        }
      }
    }
  }, [availableLocales]);

  // Set locale and persist to localStorage
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-locale", newLocale);
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