import { Link, Image, Script, Bg, Anchor, Iframe, Audio, Video, Form } from "@hieupth/nextstatic";
import { Demos } from "./demos";
export default function Home() {
  return (
    <main>
      <h1>nextstatic demo</h1>
      <p>
        Built with <code>BASE_PATH=/demo</code> — every URL below must carry the
        prefix. See <code>verify.mjs</code>.
      </p>

      <nav>
        <Link href="/about">About (Link)</Link>{" · "}
        <Anchor href="https://example.com/">External Anchor</Anchor>
      </nav>

      <section>
        <h2>Assets</h2>
        <Image src="/img/logo.svg" alt="logo" width={120} height={120} />
        <Bg backgroundImage="/img/pattern.svg" className="hero">
          <span>Bg component (backgroundImage prop)</span>
        </Bg>
        <Script src="/js/demo.js" strategy="afterInteractive" />
      </section>

      <section>
        <h2>Media</h2>
        <Video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" controls width={480} />
        <Audio src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" controls />
        <Iframe src="https://example.com/embed" width={480} height={180} title="embed" />
      </section>

      <Form action="https://example.com/search">
        <input name="q" placeholder="Form action carries the prefix?" />
        <button type="submit">Search</button>
      </Form>

      <Demos />
    </main>
  );
}
