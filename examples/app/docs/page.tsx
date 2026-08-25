import { Link } from "@hieupth/nextstatic";

export default function DocsOverview() {
  return (
    <>
      <h1>nextstatic docs</h1>
      <p>
        The path &amp; asset layer for Next.js static exports hosted under a
        sub-directory (GitHub Pages project sites, <code>/repo</code> URLs).
        One <code>BASE_PATH</code> feeds both Next and the lib; every wrapper
        below prefixes correctly.
      </p>
      <ul>
        <li><Link href="/docs/setup">Setup</Link> — one env var, one config</li>
        <li><Link href="/docs/components">Components</Link> — live, prefixed</li>
        <li><Link href="/docs/hooks">Hooks</Link> — live readouts</li>
        <li><Link href="/docs/utils">Utils</Link> — reference</li>
        <li><Link href="/docs/i18n">i18n patterns</Link> — locale without flicker</li>
      </ul>
      <p>
        This site <em>is</em> the verification app: <code>npm run
        CI path-contract gate</code> builds it with <code>BASE_PATH=/demo</code> and
        asserts every root-absolute URL carries the prefix.
      </p>
    </>
  );
}
