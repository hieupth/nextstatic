import type { UrlObject } from "url";

// Base path from environment variables with fallbacks
const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";

// Cached base path for performance
let cachedBasePath: string | null = null;

// Regex patterns for URL processing
const CSS_URL_REGEX = /url\(\s*(['"]?)\/(?!_next\/)/g;
const PROTOCOL_RELATIVE_REGEX = /^\/\//;
const ABSOLUTE_URL_REGEX = /^https?:\/\//;

/**
 * Get normalized base path with caching.
 * @returns {string} Base path (e.g., "/my-app" or "").
 */
export function getBasePath(): string {
  if (cachedBasePath === null) {
    cachedBasePath = basePath.replace(/\/+$/, "");
  }
  return cachedBasePath;
}

/**
 * Apply base path prefix to a path string.
 * Skips external URLs and Next.js internal paths.
 * @param {string} path - Path to prefix.
 * @returns {string} Prefixed path.
 */
export function getPrefixPath(path: string | null | undefined): string {
  if (!path || typeof path !== 'string') return '';

  if (!path.startsWith("/") || path.startsWith("/_next/") || PROTOCOL_RELATIVE_REGEX.test(path) || ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }

  const basePath = getBasePath();
  if (!basePath) return path;

  return `${basePath}${path}`.replace(/\/{2,}/g, "/");
}

/**
 * Apply base path prefix to Next.js UrlObject.
 * Preserves query parameters and hash.
 * @param {UrlObject} url - UrlObject to process.
 * @returns {UrlObject} UrlObject with prefixed pathname.
 */
export function getPrefixUrlObject(url: UrlObject | null | undefined): UrlObject {
  if (!url || typeof url !== 'object') return url || {};

  const pathname = typeof url.pathname === "string"
    ? getPrefixPath(url.pathname)
    : url.pathname;

  return { ...url, pathname };
}

/**
 * Process CSS url() values with base path prefix.
 * @param {string} value - CSS string containing url() values.
 * @returns {string} Processed CSS string.
 */
export function getPrefixCssUrl(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') return value || '';

  try {
    const basePath = getBasePath();
    if (!basePath) return value;

    return value.replace(
      CSS_URL_REGEX,
      (_match, quote) => `url(${quote}${basePath}/`
    );
  } catch (error) {
    console.warn('Error processing CSS URL:', error);
    return value;
  }
}

/**
 * Reset cached base path for testing or env changes.
 */
export function resetPathCache(): void {
  cachedBasePath = null;
}

/**
 * Parse locale from URL path and return clean path.
 * Handles both basePath and locale in URL structure.
 * @param {string} path - URL path to parse.
 * @param {string[]} availableLocales - Available locales.
 * @returns {{path: string, locale?: string}} Clean path and detected locale.
 */
export function parseLocaleFromPath(path: string, availableLocales: string[] = ["en", "vi"]): { path: string; locale?: string } {
  if (!path || typeof path !== 'string') return { path: "", locale: undefined };

  const pathParts = path.replace(/^\/|\/$/g, "").split("/");
  const basePath = getBasePath();
  const basePathParts = basePath ? basePath.replace(/^\/|\/$/g, "").split("/") : [];

  let cleanPath = path;
  let detectedLocale: string | undefined;

  if (basePathParts.length > 0) {
    const basePathIndex = pathParts.findIndex(part => part === basePathParts[0]);
    if (basePathIndex !== -1 && pathParts[basePathIndex + 1] && availableLocales.includes(pathParts[basePathIndex + 1])) {
      detectedLocale = pathParts[basePathIndex + 1];
      cleanPath = "/" + pathParts.slice(basePathIndex + 2).join("/");
    }
  } else {
    if (pathParts[0] && availableLocales.includes(pathParts[0])) {
      detectedLocale = pathParts[0];
      cleanPath = "/" + pathParts.slice(1).join("/");
    }
  }

  cleanPath = cleanPath === "" ? "" : cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return { path: cleanPath, locale: detectedLocale };
}

/**
 * Create path with basePath and locale prefix.
 * Core function for i18n routing in static Next.js apps.
 * @param {string} path - Application path to prefix.
 * @param {string} locale - Locale code.
 * @returns {string} Complete path with basePath and locale.
 */
export function getLocalePath(path: string | null | undefined, locale: string): string {
  if (!path || typeof path !== 'string') return '';

  if (!path.startsWith("/") || path.startsWith("/_next/") || PROTOCOL_RELATIVE_REGEX.test(path) || ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }

  const basePath = getBasePath();
  const cleanPath = path.replace(/^\/+/, "");
  const localePrefix = locale ? `/${locale}` : "";

  if (basePath) {
    return `${basePath}${localePrefix}/${cleanPath}`.replace(/\/{2,}/g, "/");
  }

  return `${localePrefix}/${cleanPath}`.replace(/\/{2,}/g, "/");
}

/**
 * Detect current locale from browser URL path.
 * Works client-side for consistent locale detection.
 * @param {string[]} availableLocales - Available locales.
 * @returns {string | undefined} Detected locale or undefined.
 */
export function getCurrentLocale(availableLocales: string[] = ["en", "vi"]): string | undefined {
  if (typeof window !== "undefined") {
    const { locale } = parseLocaleFromPath(window.location.pathname, availableLocales);
    return locale;
  }

  return undefined;
}
