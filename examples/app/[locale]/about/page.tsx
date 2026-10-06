// About: a demo TARGET for locale-in-route navigation (Link demo, the hooks
// router.push button, the i18n cross-locale anchor) — deliberately kept out
// of the header nav so its role stays clear.

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../../lib/site";
import { Link } from "@hieupth/nextstatic";
import { t, type Locale } from "../../../lib/i18n";
import { Card, PageHeader } from "../../../components/ui";
import { ArrowRight, Check } from "../../../components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return {
    title: t(locale, "about.title"),
    alternates: pageAlternates(locale, "/about"),
    openGraph: { url: pageOgUrl(locale, "/about") },
  };
}

export default async function LocaleAbout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  const VERIFIES = ["about.verify1", "about.verify2", "about.verify3"] as const;

  return (
    <>
      <PageHeader title={t(locale, "about.title")} description={t(locale, "about.description")} />

      <Card className="max-w-xl">
        <ul className="flex flex-col gap-3">
          {VERIFIES.map((key) => (
            <li key={key} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <Check className="mt-0.5 size-4 shrink-0 text-indigo-500" />
              {t(locale, key)}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3.5 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            ← {t(locale, "nav.home")}
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {t(locale, "nav.docs")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Card>
    </>
  );
}
