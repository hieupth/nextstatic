// Locale home: thin wrapper over the shared <Home> (also served at /).

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../lib/site";
import type { Locale } from "../../lib/i18n";
import { Home } from "../home";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    title: "nextstatic",
    alternates: pageAlternates(locale, "/"),
    openGraph: { url: pageOgUrl(locale, "/") },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return <Home locale={locale} />;
}
