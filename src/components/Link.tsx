// Locale-aware wrapper over next/link. Adds ONLY the locale segment —
// Next itself applies basePath, so adding it here would double the prefix
// (a bug this lib fixed; see getLocaleRoute).
"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { getLocaleRoute } from "../utils/basepath.js";
import { useLocale } from "../hooks/useLocale.js";

// Props extending NextLink for type safety
type Props = ComponentProps<typeof NextLink>;

/**
 * Process href with basePath and locale prefixing.
 * @param {Props["href"]} href - Link destination.
 * @param {string} locale - Current locale.
 * @returns {Props["href"]} Processed href.
 */
// Locale-segment only — see the header for why basePath is NOT added here.
function withBase(
  href: Props["href"],
  locale: string,
  availableLocales: string[]
): Props["href"] {
  if (typeof href === "string") {
    if (/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) return href;
    return getLocaleRoute(href, locale, availableLocales);
  }

  if (typeof href === "object" && href !== null && typeof href.pathname === "string") {
    if (locale && href.pathname.startsWith("/") && !href.pathname.startsWith("/_next/")) {
      return {
        ...href,
        pathname: getLocaleRoute(href.pathname, locale, availableLocales),
      };
    }
  }

  return href;
}

/**
 * Enhanced Next.js Link with automatic basePath and locale support.
 * Drop-in replacement for next/link with subdirectory deployment and i18n.
 *
 * Features:
 * - Automatic basePath prefixing
 * - Automatic locale prefixing
 * - Preserves external URLs unchanged
 * - Full Next.js Link compatibility
 * - SEO-friendly for static exports
 *
 * @param {ComponentProps<typeof NextLink>} props - Standard Link props.
 * @returns {React.ReactElement} Enhanced Link component.
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  const { locale, availableLocales } = useLocale();
  return (
    <NextLink
      {...props}
      href={withBase(props.href, locale, availableLocales)}
    />
  );
}