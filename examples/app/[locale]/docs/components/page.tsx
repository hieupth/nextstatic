// Component gallery: each card pairs a copy-paste snippet with the LIVE
// element it describes — code on top, running result below.

import type { Metadata } from "next";
import { pageAlternates, pageOgUrl } from "../../../../lib/site";
import {
  Link,
  Anchor,
  Image,
  Script,
  Bg,
  Iframe,
  Audio,
  Video,
  Form,
  Source,
  getPrefixPath,
} from "@hieupth/nextstatic";
import { t, type Locale } from "../../../../lib/i18n";
import { Callout, Card, Code, CodeBlock, PageHeader } from "../../../../components/ui";
import { ArrowRight, ExternalLink } from "../../../../components/icons";

const MEDIA_LABEL = "text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500";
const MEDIA_CAPTION = "text-xs text-zinc-500 dark:text-zinc-400";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return {
    title: t(locale, "nav.components"),
    alternates: pageAlternates(locale, "/docs/components"),
    openGraph: { url: pageOgUrl(locale, "/docs/components") },
  };
}

export default async function ComponentsDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <PageHeader title={t(locale, "docs.components.title")} description={t(locale, "docs.components.intro")} />

      <div className="flex flex-col gap-6">
        <Card title={t(locale, "docs.components.link")}>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.components.linkDesc")}
          </p>
          <div className="mb-4">
            <CodeBlock code={`<Link href="/about">About</Link>\n<Anchor href={\`/${locale}/docs/\`}>Docs (internal)</Anchor>`} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              {t(locale, "nav.about")}
              <ArrowRight className="size-4" />
            </Link>
            <Anchor
              href={`/${locale}/docs/`}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-700"
            >
              {t(locale, "docs.components.internalAnchor")}
            </Anchor>
            <Anchor
              href="https://example.com/"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-700"
            >
              example.com
              <ExternalLink className="size-3.5" />
            </Anchor>
          </div>
        </Card>

        <Card title={t(locale, "docs.components.imageBg")}>
          <div className="mb-4">
            <CodeBlock code={`<Image src="/img/logo.svg" width={120} height={120} />\n<Bg backgroundImage="/img/pattern.svg">…</Bg>`} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Image
              src="/img/logo.svg"
              alt="logo"
              width={120}
              height={120}
              className="rounded-2xl shadow-sm"
            />
            <Bg
              backgroundImage="/img/pattern.svg"
              className="grid h-32 flex-1 place-items-center rounded-xl sm:min-w-72"
            >
              <span className="rounded-lg bg-white/80 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur">
                Bg — backgroundImage
              </span>
            </Bg>
          </div>
        </Card>

        <Card title={t(locale, "docs.components.script")}>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.components.scriptDesc")}
          </p>
          <div className="mb-4">
            <CodeBlock code={`<Script src="/js/demo.js" strategy="afterInteractive" />`} />
          </div>
          <Callout>
            <span>
              {t(locale, "docs.components.scriptNote")} <Code>console.log("demo.js loaded from prefixed path")</Code>
            </span>
          </Callout>
          <Script src="/js/demo.js" strategy="afterInteractive" />
        </Card>

        <Card title={t(locale, "docs.components.media")}>
          <div className="mb-4">
            <CodeBlock code={`<Video src="/media/flower.mp4" poster="/img/pattern.svg" controls />\n<Audio src="/media/t-rex-roar.mp3" controls />`} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className={MEDIA_LABEL}>Video</h3>
              <p className={MEDIA_CAPTION}>
                {t(locale, "docs.components.local")} — <Code>/media/flower.mp4</Code>.{" "}
                {t(locale, "docs.components.posterNote")}
              </p>
              <Video
                src="/media/flower.mp4"
                poster="/img/pattern.svg"
                controls
                preload="metadata"
                className="aspect-video w-full max-w-md rounded-xl"
              />
              <p className={MEDIA_CAPTION}>{t(locale, "docs.components.external")}</p>
              <Video
                src="https://mdn.github.io/shared-assets/videos/flower.mp4"
                controls
                preload="metadata"
                className="aspect-video w-full max-w-md rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className={MEDIA_LABEL}>Audio</h3>
              <p className={MEDIA_CAPTION}>
                {t(locale, "docs.components.local")} — <Code>/media/t-rex-roar.mp3</Code>
              </p>
              <Audio src="/media/t-rex-roar.mp3" controls className="w-full max-w-md" />
              <p className={MEDIA_CAPTION}>{t(locale, "docs.components.external")}</p>
              <Audio src="https://mdn.github.io/shared-assets/audio/t-rex-roar.mp3" controls className="w-full max-w-md" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className={MEDIA_LABEL}>Iframe</h3>
              <Iframe
                src="/embed.html"
                title="embed"
                loading="lazy"
                className="h-48 w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>
        </Card>

        <Card title={t(locale, "docs.components.picture")}>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t(locale, "docs.components.sourceDesc")}
          </p>
          <div className="mb-4">
            <CodeBlock code={`<picture>\n  <Source srcSet="/img/logo.svg 1x, /img/pattern.svg 2x" />\n  <img src={getPrefixPath("/img/logo.svg")} alt="logo" />\n</picture>`} />
          </div>
          <picture>
            <Source srcSet="/img/logo.svg 1x, /img/pattern.svg 2x" />
            {/* Raw <img> fallback — prefixed with the getPrefixPath util. */}
            <img
              src={getPrefixPath("/img/logo.svg")}
              alt={t(locale, "docs.components.pictureAlt")}
              width={96}
              height={96}
              className="rounded-xl"
            />
          </picture>
        </Card>

        <Card title={t(locale, "docs.components.form")}>
          <div className="mb-4">
            <CodeBlock code={`<Form action={\`/${locale}/docs/\`}>\n  <input name="q" />\n  <button type="submit">Search</button>\n</Form>`} />
          </div>
          <Form action={`/${locale}/docs/`} className="flex max-w-md flex-wrap items-center gap-2">
            <input
              name="q"
              placeholder={t(locale, "docs.components.searchPlaceholder")}
              aria-label={t(locale, "docs.components.searchPlaceholder")}
              className="w-full min-w-40 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-indigo-900"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              {t(locale, "docs.components.searchButton")}
            </button>
          </Form>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {t(locale, "docs.components.formNote")}
          </p>
        </Card>
      </div>
    </>
  );
}
