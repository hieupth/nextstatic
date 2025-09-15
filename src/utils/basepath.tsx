import type { UrlObject } from "url";

// Base path from environment variables with fallback to empty string.
const basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "";

// Cached base path to avoid repeated processing.
let cachedBasePath: string | null = null;

// Pre-compiled regex for CSS URL processing to improve performance.
const CSS_URL_REGEX = /url\(\s*(['"]?)\/(?!_next\/)/g;
// Protocol-relative regex patterns.
const PROTOCOL_RELATIVE_REGEX = /^\/\//;
// Absolute URL regex patterns.
const ABSOLUTE_URL_REGEX = /^https?:\/\//;

/**
 * Read base path consistently on server and client with caching for performance.
 * Removes trailing slashes from the configured base path.
 * @returns The normalized base path string.
 */
export function getBasePath(): string {
  if (cachedBasePath === null) {
    cachedBasePath = basePath.replace(/\/+$/, "");
  }
  return cachedBasePath;
}

/**
 * Prefix a string path that starts with "/" while preserving special paths.
 * Skips Next.js internal paths, protocol-relative URLs, and absolute URLs.
 * @param path - The path string to potentially prefix.
 * @returns The prefixed path or original path if not applicable.
 */
export function getPrefixPath(path: string | null | undefined): string {
  // Handle invalid inputs
  if (!path || typeof path !== 'string') {
    return '';
  }
  // Skip paths that shouldn't be prefixed
  if (!path.startsWith("/") || path.startsWith("/_next/") || PROTOCOL_RELATIVE_REGEX.test(path) || ABSOLUTE_URL_REGEX.test(path)) {
    return path;
  }
  // Get base path
  const basePath = getBasePath();
  if (!basePath) {
    return path;
  }
  // Combine base path with the given path and normalize multiple slashes
  return `${basePath}${path}`.replace(/\/{2,}/g, "/");
}

/**
 * Prefix Next.js UrlObject pathname while preserving query and hash parameters.
 * Only processes the pathname property, leaving other URL components unchanged.
 * @param url - The UrlObject to process.
 * @returns A new UrlObject with prefixed pathname.
 */
export function getPrefixUrlObject(url: UrlObject | null | undefined): UrlObject {
  if (!url || typeof url !== 'object') {
    return url || {};
  }
  const pathname = typeof url.pathname === "string" 
    ? getPrefixPath(url.pathname) 
    : url.pathname;
  return { ...url, pathname };
}

/**
 * Prefix CSS url() values with base path while skipping Next.js internal assets.
 * Processes both quoted and unquoted URL values in CSS strings.
 * @param value - The CSS string containing url() values.
 * @returns The processed CSS string with prefixed URLs.
 */
export function getPrefixCssUrl(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') {
    return value || '';
  }
  try {
    const basePath = getBasePath();
    if (!basePath) {
      return value;
    }
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
 * Reset the cached base path. Useful for testing or when environment changes.
 * Forces the next getBasePath() call to recompute the base path.
 */
export function resetPathCache(): void {
  cachedBasePath = null;
}
