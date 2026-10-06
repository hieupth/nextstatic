// Setup: the 4-step beginner path — install, pick BASE_PATH (table), wire
// next.config.ts (annotated), build & verify.

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../../../lib/site";
import { t, type Locale } from "../../../../lib/i18n";
import { Callout, CodeBlock, PageHeader } from "../../../../components/ui";
import { Check } from "../../../../components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return {
    title: t(locale, "nav.setup"),
    alternates: pageAlternates(locale, "/docs/setup"),
    openGraph: { url: pageOgUrl(locale, "/docs/setup") },
  };
}

export default async function SetupDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  const CASES = [
    ["docs.setup.rowDomain", "https://my-site.com/", '""'],
    ["docs.setup.rowPages", "https://user.github.io/repo/", '"/repo"'],
    ["docs.setup.rowFolder", "https://host/demo/", '"/demo"'],
  ] as const;

  return (
    <>
      <PageHeader title={t(locale, "docs.setup.title")} description={t(locale, "docs.setup.intro")} />

      <h2>{t(locale, "docs.setup.step1")}</h2>
      <CodeBlock title="terminal" code={`npm install @hieupth/nextstatic`} />
      <p>
        {t(locale, "docs.setup.req1")} · {t(locale, "docs.setup.req2")} ·{" "}
        {t(locale, "docs.setup.req3")}
      </p>

      <h2>{t(locale, "docs.setup.step2")}</h2>
      <p>{t(locale, "docs.setup.step2Desc")}</p>
      <div className="mb-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40">
              <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t(locale, "docs.setup.colCase")}
              </th>
              <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t(locale, "docs.setup.colUrl")}
              </th>
              <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t(locale, "docs.setup.colBp")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {CASES.map(([caseKey, url, bp]) => (
              <tr key={caseKey}>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{t(locale, caseKey)}</td>
                <td className="px-4 py-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">{url}</td>
                <td className="px-4 py-2 font-mono text-xs text-indigo-600 dark:text-indigo-400">{bp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{t(locale, "docs.setup.ciNote")}</p>

      <h2>{t(locale, "docs.setup.step3")}</h2>
      <p>{t(locale, "docs.setup.step3Desc")}</p>
      <CodeBlock
        title={t(locale, "docs.setup.configComment")}
        code={`const basePath = process.env.BASE_PATH ?? "";

const nextConfig = {
  // static files only — no Node server needed
  output: "export",
  // /about/ style URLs → about/index.html on disk
  trailingSlash: true,
  // Next prefixes its own chunks & routes…
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  // …and the env block inlines the value so the lib
  // reads the SAME prefix at runtime
  env: {
    BASE_PATH: basePath,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};`}
      />

      <h2>{t(locale, "docs.setup.step4")}</h2>
      <CodeBlock title={t(locale, "docs.setup.buildCommand")} code={`BASE_PATH=/demo npm run build`} />
      <p>{t(locale, "docs.setup.verify")}</p>

      <div className="mt-8">
        <Callout>
          <Check className="mt-0.5 size-4 shrink-0" />
          <span>{t(locale, "docs.setup.thatIsAll")}</span>
        </Callout>
      </div>
    </>
  );
}
