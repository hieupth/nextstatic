// Docs overview: explains the problem (broken URLs under a sub-directory),
// the prefixing contract, and the numbered reading order.

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../../lib/site";
import { Link } from "@hieupth/nextstatic";
import { t, type Locale } from "../../../lib/i18n";
import { Callout, Card, CodeBlock, PageHeader } from "../../../components/ui";
import { ArrowRight } from "../../../components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    title: t(locale, "nav.docs"),
    alternates: pageAlternates(locale, "/docs"),
    openGraph: { url: pageOgUrl(locale, "/docs") },
  };
}

export default async function DocsOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  // Reading order: setup → the locale pattern → API reference.
  const PAGES = [
    ["/docs/setup", "docs.overview.setupLink", "docs.overview.setupDesc"],
    ["/docs/i18n", "docs.overview.i18nLink", "docs.overview.i18nDesc"],
    ["/docs/components", "docs.overview.componentsLink", "docs.overview.componentsDesc"],
    ["/docs/hooks", "docs.overview.hooksLink", "docs.overview.hooksDesc"],
    ["/docs/utils", "docs.overview.utilsLink", "docs.overview.utilsDesc"],
  ] as const;

  return (
    <>
      <PageHeader title={t(locale, "docs.overview.title")} description={t(locale, "docs.overview.intro")} />

      <p className="mb-4 max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t(locale, "docs.overview.lead")}
      </p>

      <div className="mb-4">
        <CodeBlock
          title={t(locale, "docs.overview.example")}
          code={`✗ <img src="/logo.svg">      →  https://user.github.io/logo.svg          → 404
✓ <Image src="/logo.svg" /> →  https://user.github.io/your-repo/logo.svg → 200`}
        />
      </div>

      <p className="mb-8 max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t(locale, "docs.overview.lead2")}
      </p>

      <Card title={t(locale, "docs.utils.contract")} className="mb-8">
        <div className="flex flex-col gap-3">
          <Callout>
            <span>{t(locale, "docs.utils.nextPrimitives")}</span>
          </Callout>
          <Callout>
            <span>{t(locale, "docs.utils.rawSurfaces")}</span>
          </Callout>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {PAGES.map(([href, titleKey, descKey], i) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-indigo-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500"
          >
            <span className="mb-3 inline-flex size-7 items-center justify-center rounded-lg bg-indigo-50 font-mono text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex items-center justify-between gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {t(locale, titleKey)}
              <ArrowRight className="size-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </span>
            <span className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t(locale, descKey)}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
