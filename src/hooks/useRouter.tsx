// Locale-aware navigation: wraps the App Router instance so push/replace/
// prefetch route through getLocaleRoute with the PROVIDER's locale list —
// cross-locale hrefs keep their locale, locale-free hrefs gain the current one.
"use client";
import { useRouter as useNextRouter, usePathname as useNextPathname } from "next/navigation";

type NextRouter = ReturnType<typeof useNextRouter>;
type PushOptions = Parameters<NextRouter["push"]>[1];
type PrefetchOptions = Parameters<NextRouter["prefetch"]>[1];
import { getLocaleRoute } from "../utils/basepath.js";
import { useLocale } from "./useLocale.js";

/**
 * Enhanced router with automatic basePath and locale handling.
 * Wraps Next.js useRouter for seamless internationalized routing.
 *
 * Features:
 * - Automatic basePath prefixing
 * - Automatic locale prefixing
 * - Full Next.js compatibility
 * - Locale-aware navigation for string hrefs
 *
 * @returns {object} Enhanced router object.
 */
export function useRouter() {
  const router = useNextRouter();
  const { locale, availableLocales } = useLocale();

  return {
    ...router,

    /**
     * Navigate with automatic basePath and locale prefixing.
     * @param {string} href - Destination route.
     * @param {any} [options] - Navigation options.
     * @returns {void}
     */
    push: (href: string, options?: PushOptions) => {
      return router.push(getLocaleRoute(href, locale, availableLocales), options);
    },

    /**
     * Replace current route with automatic path handling.
     * @param {string} href - Destination route.
     * @param {any} [options] - Navigation options.
     * @returns {void} (Next's App Router replace returns void).
     */
    replace: (href: string, options?: PushOptions) => {
      return router.replace(getLocaleRoute(href, locale, availableLocales), options);
    },

    /**
     * Prefetch route with automatic path handling.
     * @param {string} href - Route to prefetch.
     * @param {PrefetchOptions} [options] - Prefetch options.
     * @returns {void}
     */
    prefetch: (href: string, options?: PrefetchOptions) => {
      return router.prefetch(getLocaleRoute(href, locale, availableLocales), options);
    }
  };
}

/**
 * Pass-through of next/navigation's usePathname — Next already excludes the
 * basePath; the locale segment IS included (e.g. "/en/docs").
  *
 * @returns {string} Current pathname without basePath prefix.
 */
export function usePathname(): string {
  const pathname = useNextPathname();
  return pathname;
}