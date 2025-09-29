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

// React context for internationalization
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// LocaleProvider props
interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
  availableLocales?: Locale[];
}

/**
 * Provider for internationalization with URL detection and localStorage persistence.
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

/**
 * Hook for accessing locale context in components.
 * @returns {LocaleContextType} Locale context.
 * @throws {Error} If used outside LocaleProvider.
 */
export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}