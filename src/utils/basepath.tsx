import type { UrlObject } from "url";

// Cached base path for performance
let cachedBasePath: string | null = null;

const PROTOCOL_RELATIVE_REGEX = /^\/\//;
const ABSOLUTE_URL_REGEX = /^https?:\/\//;

/**
 * Get normalized base path with caching. The env value is re-read on every
 * cache reset (resetPathCache), not frozen at module import.
 * @returns {string} Base path (e.g., "/my-app" or "").
 */
export function getBasePath(): string {
  if (cachedBasePath === null) {
    const raw =
      process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";
    cachedBasePath = raw.replace(/\/+$/, "");
  }
  return cachedBasePath;
}

// Join basePath and path by collapsing slashes ONLY at the join point —
// a global // collapse would corrupt query strings and hashes
// (e.g. "?to=https://x" must keep its double slash).
// NOTE: a basePath that EQUALS a locale segment (e.g. "/vi" with locale "vi")
// is ambiguous at the URL level ("/vi/vi/x") and is not supported — see
// RELEASE.md "Known deployment limitation".
function joinPrefix(basePath: string, path: string): string {
  return `${basePath.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

const DEFAULT_LOCALE_SEGMENTS = ["en", "vi"];

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

  // Idempotent: an already-prefixed path passes through unchanged —
  // compare the route part only, so "/base?x=1" counts as prefixed too.
  const [route, search] = splitSearch(path);
  if (route === basePath || route.startsWith(`${basePath}/`)) return path;
  void search;

  return joinPrefix(basePath, path);
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

    // Idempotent: don't re-prefix a url() that already carries basePath
    // (followed by a slash, query, hash, or end — so url(/demo) and
    // url(/demo?v=2) pass through, while url(/demoX) still prefixes).
    const esc = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escNoLead = esc.replace(/^\//, "");
    const re = new RegExp(
      `url\\(\\s*(['"]?)\\/(?!\\/)(?!_next\\/)(?!${escNoLead}(?:\\/|\\?|#|\\s|\\)|['"]|$))`,
      "gi"
    );
    return value.replace(
      re,
      (match, quote) => `${match.slice(0, 3)}(${quote}${basePath}/`
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

/** Split path into [pathname, search+hash] so slash handling never touches
 * query strings or hashes. */
function splitSearch(path: string): [string, string] {
  const m = path.match(/[?#]/);
  if (!m || m.index === undefined) return [path, ""];
  return [path.slice(0, m.index), path.slice(m.index)];
}

/**
 * Parse locale from URL path and return clean path.
 * Handles both basePath and locale in URL structure — the basePath may be
 * multi-segment (e.g. "/proxy/4173/demo"), so the whole prefix is stripped
 * before reading the locale segment.
 * @param {string} path - URL path to parse.
 * @param {string[]} availableLocales - Locales recognized as a leading
 *   segment; defaults to ["en", "vi"] — pass your app's list to change it.
 * @returns {{path: string, locale?: string}} Clean path and detected locale.
 */
export function parseLocaleFromPath(path: string, availableLocales: string[] = ["en", "vi"]): { path: string; locale?: string } {
  if (!path || typeof path !== 'string') return { path: "", locale: undefined };

  // Queries/hashes are not path segments — "/vi?x=1" still detects "vi".
  // Collapse LEADING duplicate slashes first — "//demo/vi" must not smuggle
  // the basePath past the strip check below.
  const [rawRoute, search] = splitSearch(path);
  let rest = rawRoute.replace(/^\/+/, "/") || "/";
  const basePath = getBasePath();
  if (basePath) {
    if (rest === basePath) {
      rest = "/";
    } else if (rest.startsWith(`${basePath}/`)) {
      rest = rest.slice(basePath.length);
    }
  }

  // Collapse repeated internal slashes ("/a//b" → "/a/b") before splitting.
  rest = rest.replace(/\/{2,}/g, "/");
  const pathParts = rest.replace(/^\/|\/$/g, "").split("/");
  let detectedLocale: string | undefined;

  if (pathParts[0] && availableLocales.includes(pathParts[0])) {
    detectedLocale = pathParts[0];
    rest = "/" + pathParts.slice(1).join("/");
  }

  let cleanPath = rest === "" ? "" : rest.startsWith("/") ? rest : `/${rest}`;
  return { path: cleanPath + search, locale: detectedLocale };
}

/**
 * Locale-prefix a route path WITHOUT the basePath — for hrefs handed to
 * Next primitives (next/link, router.push): Next applies basePath itself,
 * so including it here would double the prefix.
 * @param path - Route path (e.g. "/about"). External/anchor/_next paths pass through.
 * @param locale - Locale segment (e.g. "vi"). Empty string returns the path unchanged.
 * @param {string[]} availableLocales - Locales recognized as a leading
 *   segment; defaults to ["en", "vi"] — pass your app's list to change it.
 * @returns Path with locale segment only (e.g. "/vi/about").
 */
export function getLocaleRoute(path: string, locale: string, availableLocales: string[] = DEFAULT_LOCALE_SEGMENTS): string {
  if (!path || typeof path !== 'string') return '';
  if (!path.startsWith("/") || path.startsWith("/_next/") || PROTOCOL_RELATIVE_REGEX.test(path) || ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }
  const [route0, search] = splitSearch(path);
  // Normalize inputs that already carry the basePath (locale-only output —
  // Next adds basePath itself). Runs even for locale "" so bp-prefixed
  // hrefs never double-prefix through Next.
  const bp = getBasePath();
  let route = route0;
  if (bp && (route === bp || route.startsWith(`${bp}/`))) {
    route = route.slice(bp.length) || "/";
  }
  route = route.replace(/\/{2,}/g, "/");
  if (!locale) {
    return route === "/" ? "/" : `${route}${search}`;
  }
  // A leading KNOWN locale means the href is already locale-addressed:
  // keep it (idempotent, and preserves intent — "/ja/about" under an en
  // page must not become "/en/about" nor stack). Only locale-free paths
  // gain the context locale.
  const seg = route.replace(/^\/+/, "").split("/")[0];
  if (seg && (seg === locale || availableLocales.includes(seg))) {
    // Already locale-addressed — return the normalized (bp-stripped) route.
    // Canonical locale-root: "/vi" and "/vi/" both yield "/vi" (no trailing
    // slash), matching getLocalePath's composition exactly.
    if (route === `/${seg}` || route === `/${seg}/`) return `/${seg}${search}`;
    return `${route}${search}`;
  }
  if (route === "/" || route === "") return `/${locale}${search}`;
  return `/${locale}/${route.replace(/^\/+/, "")}${search}`;
}

/**
 * Create a path with basePath AND locale prefix — the full URL-usable form
 * for raw surfaces (plain <a>, img src) where neither Next nor a provider
 * adds anything.
 * @param path - Application path (e.g. "/about"). External/anchor paths pass through.
 * @param locale - Locale segment (e.g. "vi"). Empty string adds basePath only.
 * @param {string[]} availableLocales - Locales recognized as a leading
 *   segment; defaults to ["en", "vi"] — pass your app's list to change it.
 * @returns Full path (e.g. "/my-app/vi/about").
 */
export function getLocalePath(path: string | null | undefined, locale: string, availableLocales: string[] = DEFAULT_LOCALE_SEGMENTS): string {
  if (!path || typeof path !== 'string') return '';

  if (!path.startsWith("/") || path.startsWith("/_next/") || PROTOCOL_RELATIVE_REGEX.test(path) || ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }

  // locale "" is EXACTLY getPrefixPath — delegate so it inherits the
  // pass-through guard (already-prefixed inputs and queries unchanged).
  if (!locale) return getPrefixPath(path);

  const [route0, search] = splitSearch(path);
  // Normalize: strip a leading basePath (idempotence with getPrefixPath —
  // "base?x=1" and already-prefixed inputs pass through unchanged).
  const bp = getBasePath();
  let route = route0;
  if (bp && (route === bp || route.startsWith(`${bp}/`))) {
    route = route.slice(bp.length) || "/";
  }
  route = route.replace(/\/{2,}/g, "/");
  // A leading KNOWN locale wins: the path is already locale-addressed, so
  // rebuild under THAT locale (intent preserved). Locale-free paths use
  // the requested locale; "" stays exactly equivalent to getPrefixPath.
  const seg = route.replace(/^\/+/, "").split("/")[0];
  const effective =
    seg && (seg === locale || availableLocales.includes(seg)) ? seg : locale;
  if (seg === effective) {
    route = route.slice(seg.length + 1) || "/";
  }
  const localePrefix = effective ? `/${effective}` : "";
  // Canonical locale-root: "/vi" + "" must NOT become "/vi/" — match the
  // getPrefixPath(getLocaleRoute(...)) composition exactly.
  if (route === "/") return `${bp}${localePrefix}${search}`;
  return joinPrefix(`${bp}${localePrefix}`, `${route}${search}`);
}

/**
 * Detect current locale from browser URL path.
 * Works client-side for consistent locale detection.
 * @param {string[]} availableLocales - Locales recognized as a leading
 *   segment; defaults to ["en", "vi"] — pass your app's list to change it.
 * @returns {string | undefined} Detected locale or undefined.
 */
export function getCurrentLocale(availableLocales: string[] = ["en", "vi"]): string | undefined {
  if (typeof window !== "undefined") {
    const { locale } = parseLocaleFromPath(window.location.pathname, availableLocales);
    return locale;
  }

  return undefined;
}
