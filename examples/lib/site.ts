import { getBasePath } from "@hieupth/nextstatic";

// Canonical deployment ORIGIN only (no path) — override with
// NEXT_PUBLIC_SITE_URL when the site moves. siteUrl() appends the basePath,
// so the same build stays correct under any sub-directory.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hieupth.github.io";

/** Path with the deployment basePath applied (still origin-relative). */
export const sitePath = (p: string) => `${getBasePath()}${p}`;

/** Fully absolute URL for metadata surfaces (origin + basePath + path). */
export const siteUrl = (p: string) => `${SITE_URL}${getBasePath()}${p}`;

/** Per-page alternates (canonical + hreflang) for a locale-free app path
 *  like "/docs/hooks" or "/". One source for every generateMetadata so the
 *  surfaces can never diverge from sitemap.ts again. */
export function pageAlternates(locale: string, pagePath: string) {
  const full = (l: string) => `/${l}${pagePath === "/" ? "" : pagePath}`;
  return {
    canonical: siteUrl(`${full(locale)}/`),
    languages: { en: siteUrl(`${full("en")}/`), vi: siteUrl(`${full("vi")}/`) },
  };
}

/** Absolute og:url for the same page shape. */
export function pageOgUrl(locale: string, pagePath: string) {
  return siteUrl(`/${locale}${pagePath === "/" ? "" : pagePath}/`);
}
