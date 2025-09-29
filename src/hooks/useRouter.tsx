"use client";
import { useRouter as useNextRouter, usePathname as useNextPathname } from "next/navigation";
import { getPrefixPath, getLocalePath } from "../utils/basepath";
import { useLocale } from "./useLocale";

/**
 * Enhanced router with automatic basePath and locale handling.
 * Wraps Next.js useRouter for seamless internationalized routing.
 *
 * Features:
 * - Automatic basePath prefixing
 * - Automatic locale prefixing
 * - Full Next.js compatibility
 * - Support for string and URL navigation
 *
 * @returns {object} Enhanced router object.
 */
export function useRouter() {
  const router = useNextRouter();
  const { locale } = useLocale();

  return {
    ...router,

    /**
     * Navigate with automatic basePath and locale prefixing.
     * @param {string | URL} href - Destination route or URL.
     * @param {any} [options] - Navigation options.
     * @returns {Promise<boolean>} Navigation success promise.
     */
    push: (href: string | URL, options?: any) => {
      const processedHref = typeof href === "string"
        ? getLocalePath(href, locale)
        : href.toString();
      return router.push(processedHref, options);
    },

    /**
     * Replace current route with automatic path handling.
     * @param {string | URL} href - Destination route or URL.
     * @param {any} [options] - Navigation options.
     * @returns {Promise<boolean>} Replacement success promise.
     */
    replace: (href: string | URL, options?: any) => {
      const processedHref = typeof href === "string"
        ? getLocalePath(href, locale)
        : href.toString();
      return router.replace(processedHref, options);
    },

    /**
     * Prefetch route with automatic path handling.
     * @param {string | URL} href - Route to prefetch.
     * @param {any} [options] - Prefetch options.
     * @returns {Promise<void>} Prefetch completion promise.
     */
    prefetch: (href: string | URL, options?: any) => {
      const processedHref = typeof href === "string"
        ? getLocalePath(href, locale)
        : href.toString();
      return router.prefetch(processedHref, options);
    }
  };
}

/**
 * Enhanced pathname hook returning path without basePath prefix.
 * Provides clean application-relative path for routing logic.
 *
 * @returns {string} Current pathname without basePath prefix.
 */
export function usePathname(): string {
  const pathname = useNextPathname();
  return pathname;
}