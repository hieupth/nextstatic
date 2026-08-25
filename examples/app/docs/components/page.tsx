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
  Source,
} from "@hieupth/nextstatic";

export default function ComponentsDocs() {
  return (
    <>
      <h1>Components</h1>
      <p>
        Drop-in wrappers with the same props as the originals. Everything
        below is live on this page — view-source: every URL carries the
        prefix, frozen into the static HTML.
      </p>

      <h2>Link / Anchor</h2>
      <p>
        <code>Link</code> wraps <code>next/link</code>: basePath comes from
        Next, the locale segment (if any) from <code>LocaleProvider</code>.
        <code>Anchor</code> is the raw <code>&lt;a&gt;</code> form with
        basePath applied by the lib.
      </p>
      <pre>{`<Link href="/about">About</Link>
<Anchor href="https://example.com/">External</Anchor>`}</pre>
      <p><Link href="/about">About (Link)</Link> · <Anchor href="https://example.com/">External Anchor</Anchor></p>

      <h2>Image / Bg</h2>
      <pre>{`<Image src="/img/logo.svg" alt="Logo" width={120} height={120} />
<Bg backgroundImage="/img/pattern.svg" className="hero" />`}</pre>
      <p><Image src="/img/logo.svg" alt="logo" width={120} height={120} /></p>
      <Bg backgroundImage="/img/pattern.svg" className="hero">
        <span>Bg (backgroundImage, prefixed)</span>
      </Bg>

      <h2>Script</h2>
      <pre>{`<Script src="/js/demo.js" strategy="afterInteractive" />`}</pre>
      <Script src="/js/demo.js" strategy="afterInteractive" />

      <h2>Media: Video / Audio / Iframe / Source</h2>
      <pre>{`<Video src="…" controls />
<Audio src="…" controls />
<Iframe src="…" className="resp-embed" />`}</pre>
      <p><Video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls width={480} /></p>
      <p><Audio src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" controls /></p>
      <Iframe src="/embed.html" className="resp-embed" title="embed" />

      <h2>Form</h2>
      <pre>{`<Form action="https://example.com/search"> … </Form>`}</pre>
      <Form action="https://example.com/search">
        <input name="q" placeholder="action carries the prefix" />
        <button type="submit">Search</button>
      </Form>
      <p><code>Source</code> follows the same pattern inside picture/video elements.</p>
    </>
  );
}
