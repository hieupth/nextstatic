// Utils reference: pure functions for raw surfaces, re-computed at build
// time so every row shows real output under the current BASE_PATH.

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../../../lib/site";
import { Link } from "@hieupth/nextstatic";
import {
  getBasePath,
  getPrefixPath,
  getPrefixUrlObject,
  getPrefixCssUrl,
  getLocalePath,
  getLocaleRoute,
  parseLocaleFromPath,
} from "@hieupth/nextstatic";
import { t, type Locale } from "../../../../lib/i18n";
import { Card, PageHeader, Readout } from "../../../../components/ui";
import { ClientUtilsDemo } from "./_client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return {
    title: t(locale, "nav.utils"),
    alternates: pageAlternates(locale, "/docs/utils"),
    openGraph: { url: pageOgUrl(locale, "/docs/utils") },
  };
}

export default async function UtilsDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  const cols = [t(locale, "demos.call"), t(locale, "demos.result")] as const;

  return (
    <>
      <PageHeader title={t(locale, "docs.utils.title")} description={t(locale, "docs.utils.intro")} />

      <p className="mb-8">
        <Link
          href="/docs"
          className="text-sm font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-700"
        >
          {t(locale, "docs.utils.contractLink")}
        </Link>
      </p>

      <div className="flex flex-col gap-6">
        <Card>
          <Readout
            columns={cols}
            rows={[
              ["getBasePath()", getBasePath() || '""'],
              ['getPrefixPath("/docs")', getPrefixPath("/docs")],
              [
                'getPrefixUrlObject({ pathname: "/docs", query: { q: "1" } })',
                JSON.stringify(getPrefixUrlObject({ pathname: "/docs", query: { q: "1" } })),
              ],
              ['getPrefixCssUrl("url(/img/a.png)")', getPrefixCssUrl("url(/img/a.png)")],
              ['getLocalePath("/about", "vi")', getLocalePath("/about", "vi")],
              ['getLocaleRoute("/about", "vi")', getLocaleRoute("/about", "vi")],
              ...getBasePath()
                ? ([
                    [
                      `parseLocaleFromPath("${getBasePath()}/vi/about")`,
                      JSON.stringify(parseLocaleFromPath(`${getBasePath()}/vi/about`)),
                    ],
                    [
                      'parseLocaleFromPath("/vi/about")',
                      JSON.stringify(parseLocaleFromPath("/vi/about")),
                    ],
                  ] as const)
                : ([
                    [
                      'parseLocaleFromPath("/vi/about")',
                      JSON.stringify(parseLocaleFromPath("/vi/about")),
                    ],
                    [
                      'parseLocaleFromPath("/demo/vi/about")',
                      JSON.stringify(parseLocaleFromPath("/demo/vi/about")),
                    ],
                  ] as const),
            ]}
          />
        </Card>

        <Card title={t(locale, "docs.utils.clientTitle")}>
          <ClientUtilsDemo locale={locale} />
        </Card>
      </div>
    </>
  );
}
