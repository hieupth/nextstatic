import {
  Link,
  Image,
  Script,
  Bg,
  Anchor,
  Iframe,
  Audio,
  Video,
  Form,
} from "@hieupth/nextstatic";
import { t, type Locale } from "../../../../lib/i18n";

export default async function ComponentsDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <h1>{t(locale, "docs.components.title")}</h1>
      <p>{t(locale, "docs.components.intro")}</p>

      <h2>{t(locale, "docs.components.link")}</h2>
      <p>{t(locale, "docs.components.linkDesc")}</p>
      <p><Link href={`/${locale}/about`}>{t(locale, "nav.about")}</Link> · <Anchor href="https://example.com/">example.com</Anchor></p>

      <h2>{t(locale, "docs.components.imageBg")}</h2>
      <p><Image src="/img/logo.svg" alt="logo" width={120} height={120} /></p>
      <Bg backgroundImage="/img/pattern.svg" className="hero">
        <span>Bg — backgroundImage</span>
      </Bg>

      <h2>{t(locale, "docs.components.script")}</h2>
      <Script src="/js/demo.js" strategy="afterInteractive" />

      <h2>{t(locale, "docs.components.media")}</h2>
      <p><Video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls width={480} /></p>
      <p><Audio src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" controls /></p>
      <Iframe src="/embed.html" className="resp-embed" title="embed" />

      <h2>{t(locale, "docs.components.form")}</h2>
      <Form action="/search">
        <input name="q" placeholder={locale === "vi" ? "Tìm kiếm..." : "Search..."} />
        <button type="submit">{locale === "vi" ? "Tìm" : "Search"}</button>
      </Form>
      <p>{t(locale, "docs.components.source")}</p>
    </>
  );
}
