import { Link } from "@hieupth/nextstatic";
import { Demos } from "./demos";

export default function Home() {
  return (
    <main>
      <h1>nextstatic</h1>
      <p>
        The path &amp; asset layer for Next.js static exports under a
        sub-directory. This app is both the <strong>live documentation</strong>{" "}
        and the <strong>verification harness</strong> — built with{" "}
        <code>BASE_PATH=/demo</code>, every URL below must carry the prefix.
      </p>
      <nav>
        <Link href="/docs">📚 Docs</Link>{" · "}
        <Link href="/docs/components">Components (live)</Link>{" · "}
        <Link href="/docs/hooks">Hooks (live)</Link>{" · "}
        <Link href="/docs/i18n">i18n patterns</Link>{" · "}
        <Link href="/en">/en</Link>/<Link href="/vi">/vi</Link>{" "}
        (locale-in-route) · <Link href="/about">/about</Link>
      </nav>

      <Demos />
    </main>
  );
}
