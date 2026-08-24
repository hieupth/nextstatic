"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { getLocaleRoute } from "../utils/basepath";
import { useLocale } from "../hooks/useLocale";

// Props extending NextLink for type safety
type Props = ComponentProps<typeof NextLink>;

/**
 * Process href with basePath and locale prefixing.
 * @param {Props["href"]} href - Link destination.
 * @param {string} locale - Current locale.
 * @returns {Props["href"]} Processed href.
 */
// Locale-segment only: Next's Link applies basePath itself, so prefixing
// it here would double it (BASE_PATH was baked twice before this fix).
function withBase(href: Props["href"], locale: string): Props["href"] {
  if (typeof href === "string") {
    if (/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) return href;
    return getLocaleRoute(href, locale);
  }

  if (typeof href === "object" && href !== null && typeof href.pathname === "string") {
    if (locale && href.pathname.startsWith("/") && !href.pathname.startsWith("/_next/")) {
      return { ...href, pathname: getLocaleRoute(href.pathname, locale) };
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
  const { locale } = useLocale();
  return <NextLink {...props} href={withBase(props.href, locale)} />;
}