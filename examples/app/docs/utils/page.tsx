import { getBasePath, getPrefixPath, getPrefixCssUrl, getLocalePath, getLocaleRoute, parseLocaleFromPath, getCurrentLocale } from "@hieupth/nextstatic";

export default function UtilsDocs() {
  return (
    <>
      <h1>Utils</h1>
      <p>
        Plain functions for raw surfaces — plain <code>&lt;a&gt;</code>,
        <code>&lt;img&gt;</code>, <code>&lt;script&gt;</code>, CSS-in-JS urls —
        anywhere Next does not apply basePath itself.
      </p>
      <table>
        <thead><tr><th>Call (this build)</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td><code>getBasePath()</code></td><td><code>{getBasePath() || '""'}</code></td></tr>
          <tr><td><code>getPrefixPath(&quot;/docs&quot;)</code></td><td><code>{getPrefixPath("/docs")}</code></td></tr>
          <tr><td><code>getPrefixCssUrl(&quot;img/a.png&quot;)</code></td><td><code>{getPrefixCssUrl("img/a.png")}</code></td></tr>
          <tr><td><code>getLocalePath(&quot;/about&quot;, &quot;vi&quot;)</code></td><td><code>{getLocalePath("/about", "vi")}</code></td></tr>
          <tr><td><code>getLocaleRoute(&quot;/about&quot;, &quot;vi&quot;)</code></td><td><code>{getLocaleRoute("/about", "vi")}</code></td></tr>
          <tr><td><code>parseLocaleFromPath(&quot;/demo/vi/about&quot;)</code></td><td><code>{JSON.stringify(parseLocaleFromPath("/demo/vi/about"))}</code></td></tr>
          <tr><td><code>getCurrentLocale()</code></td><td><code>{getCurrentLocale() || '""'}</code></td></tr>
        </tbody>
      </table>
      <h2>The prefixing contract</h2>
      <ul>
        <li><strong>Next primitives</strong> (<code>Link</code>, <code>useRouter</code>) add <em>only the locale segment</em> — <code>getLocaleRoute</code>. Next itself applies basePath; prefixing it there doubles it.</li>
        <li><strong>Raw surfaces</strong> use the basePath-aware utils (<code>getPrefixPath</code>, <code>getLocalePath</code>).</li>
      </ul>
    </>
  );
}
