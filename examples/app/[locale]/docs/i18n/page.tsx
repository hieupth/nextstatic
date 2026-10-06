// i18n patterns: what locale-in-route means, the two easily-confused
// helpers (getLocaleRoute vs getLocalePath, compared live), static-first
// params, and the raw-anchor switcher.

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../../../lib/site";
import { Link, getLocalePath, getLocaleRoute } from "@hieupth/nextstatic";
import { t, type Locale } from "../../../../lib/i18n";
import { Callout, Card, CodeBlock, PageHeader, Readout } from "../../../../components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return {
    title: t(locale, "nav.i18n"),
    alternates: pageAlternates(locale, "/docs/i18n"),
    openGraph: { url: pageOgUrl(locale, "/docs/i18n") },
  };
}

export default async function I18nDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const other = locale === "en" ? "vi" : "en";

  return (
    <>
      <PageHeader title={t(locale, "docs.i18n.title")} />

      <div className="flex flex-col gap-6">
        <Card title={t(locale, "docs.i18n.whatTitle")}>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.i18n.whatDesc")}
          </p>
        </Card>

        <Card title={t(locale, "docs.i18n.helpersTitle")}>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.i18n.helpersDesc")}
          </p>
          <Readout
            columns={[t(locale, "demos.call"), t(locale, "demos.returns")]}
            rows={[
              ['getLocaleRoute("/about", "vi")', getLocaleRoute("/about", "vi")],
              ['getLocalePath("/about", "vi")', getLocalePath("/about", "vi")],
            ]}
          />
        </Card>

        <Card title={t(locale, "docs.i18n.staticFirst")}>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.i18n.staticFirstDesc")}
          </p>
          <CodeBlock
            title="app/[locale]/layout.tsx"
            code={`// app/[locale]/layout.tsx
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}`}
          />
        </Card>

        <Card title={t(locale, "docs.i18n.switching")}>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.i18n.switchingDesc")}
          </p>
          <CodeBlock
            title="client"
            code={`// same-locale navigation — the lib router adds the locale segment
router.push("/about");

// switching locale — full URL (basePath + locale), on a raw anchor:
<a href={getLocalePath("/docs/", otherLocale)}>…</a>`}
          />
          <div className="mt-4 flex flex-col gap-3">
            {/* Locale-free path — getLocalePath rebuilds it under basePath +
                the target locale. An already-locale-prefixed href keeps its own
                locale (leading locale wins), so nothing doubles. */}
            <a
              href={getLocalePath("/docs/", other)}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-zinc-300 px-3.5 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            >
              {other === "vi"
                ? "Chuyển sang tiếng Việt (raw anchor)"
                : "Switch to English (raw anchor)"}
            </a>
            <Callout>
              <span>{t(locale, "docs.i18n.rawAnchorNote")}</span>
            </Callout>
          </div>
        </Card>

        <Card title={t(locale, "docs.i18n.noProviderTitle")}>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.i18n.noProvider")}
          </p>
          <p className="mt-4">
            <Link
              href="/"
              className="text-sm font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-700"
            >
              ← {t(locale, "nav.home")}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
