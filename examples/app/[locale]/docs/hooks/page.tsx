// Hooks reference: every card runs live — call column vs result column.

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../../../lib/site";
import { t, type Locale } from "../../../../lib/i18n";
import { PageHeader } from "../../../../components/ui";
import { HooksDemo } from "./_demo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return {
    title: t(locale, "nav.hooks"),
    alternates: pageAlternates(locale, "/docs/hooks"),
    openGraph: { url: pageOgUrl(locale, "/docs/hooks") },
  };
}

export default async function HooksDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <PageHeader title={t(locale, "docs.hooks.title")} description={t(locale, "docs.hooks.intro")} />
      <HooksDemo locale={locale} />
    </>
  );
}
