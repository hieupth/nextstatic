// Root layout for the locale tree — owns <html lang> so it carries the real
// locale, plus the site chrome, per-locale metadata defaults, and the
// LocaleProvider seeded from the route param (static-first, zero flicker).

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, isLocale, t, type Locale } from "../../lib/i18n";
import { SiteChrome } from "../../components/SiteChrome";
import { SITE_URL, sitePath, siteUrl } from "../../lib/site";
import "../globals.css";

const DESCRIPTION =
  "The path & asset layer for Next.js static exports — one BASE_PATH feeds " +
  "both Next and the lib; every link, image and CSS url carries the prefix.";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `nextstatic — ${t(locale, "nav.docs")}`,
      template: "%s — nextstatic",
    },
    description: locale === "vi" ? t(locale, "footer.tagline") : DESCRIPTION,
    icons: { icon: [{ url: sitePath("/img/logo.svg"), type: "image/svg+xml" }] },
    openGraph: {
      type: "website",
      siteName: "nextstatic",
      description: DESCRIPTION,
      url: siteUrl(`/${locale}/`),
    },
    twitter: { card: "summary" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <html lang={locale}>
      <body className="min-h-dvh bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <SiteChrome locale={locale}>{children}</SiteChrome>
      </body>
    </html>
  );
}
