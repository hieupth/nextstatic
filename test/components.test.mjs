// Render-level oracle for the lib components: server-render every wrapper
// with a hostile prop matrix under several basePaths and assert URL
// invariants on the emitted markup. Deterministic — no browser, no network.
//
// Run via: npm run test:components  (uses --import to register next-stubs)
import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import "./mocks/next-stubs.mjs"; // register next/* stubs before the dist imports below

process.env.BASE_PATH = "/demo";
const { LocaleProvider } = await import("../dist/hooks/index.js");
const {
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
} = await import("../dist/components/index.js");
const { getPrefixPath } = await import("../dist/utils/basepath.js");

const HOSTILE = [
  "/img/a.png",
  "/a/b/c.svg?v=2#frag",
  "/redirect?to=https://ex.com/x",
  "/data-not-a-scheme/x",
  "https://cdn.ex/x.png",
  "//proto.rel/x",
  "data:image/png;base64,AAA,BBB",
  "blob:https://x/y",
  "#anchor",
  "/demo/already.png",
];

function attrOf(html, attr) {
  const m = html.match(new RegExp(`${attr}="([^"]*)"`));
  return m ? m[1] : null;
}

test("P-C1: every prefixable root-relative prop gains basePath exactly once", () => {
  for (const src of HOSTILE) {
    const cases = [
      ["img-src", renderToString(React.createElement(Image, { src, alt: "x", width: 1, height: 1 }))],
      ["anchor-href", renderToString(React.createElement(Anchor, { href: src }))],
      ["script-src", renderToString(React.createElement(Script, { src }))],
      ["iframe-src", renderToString(React.createElement(Iframe, { src }))],
      ["audio-src", renderToString(React.createElement(Audio, { src }))],
      ["video-src", renderToString(React.createElement(Video, { src }))],
      ["form-action", renderToString(React.createElement(Form, { action: src }))],
    ];
    for (const [name, html] of cases) {
      const url = attrOf(html, name.split("-")[1] === "href" ? "href" : name.endsWith("action") ? "action" : "src");
      const expected = getPrefixPath(src);
      assert.equal(url, expected, `${name} for ${JSON.stringify(src)}`);
      if (src.startsWith("/") && !src.startsWith("//") && !/^https?:/.test(src) && !src.startsWith("/demo/")) {
        assert.ok(url.startsWith("/demo/"), `${name} not prefixed: ${url}`);
      }
    }
  }
});

test("P-C2: skip-set is byte-identical through the component layer", () => {
  const skip = ["https://x/y", "//x/y", "data:a,b", "blob:x", "#f"];
  for (const s of skip) {
    assert.equal(attrOf(renderToString(React.createElement(Image, { src: s, alt: "x" })), "src"), s);
    assert.equal(attrOf(renderToString(React.createElement(Anchor, { href: s })), "href"), s);
    assert.equal(attrOf(renderToString(React.createElement(Form, { action: s })), "action"), s);
  }
});

test("P-C3: Link adds the locale segment only (Next adds basePath) — provider vs none", () => {
  const bare = renderToString(React.createElement(Link, { href: "/about" }));
  assert.equal(attrOf(bare, "href"), "/about", "no provider → no locale");

  const vi = renderToString(
    React.createElement(LocaleProvider, { defaultLocale: "vi" }, React.createElement(Link, { href: "/about" }))
  );
  assert.equal(attrOf(vi, "href"), "/vi/about");

  const stacked = renderToString(
    React.createElement(LocaleProvider, { defaultLocale: "vi" }, React.createElement(Link, { href: "/vi/about" }))
  );
  assert.equal(attrOf(stacked, "href"), "/vi/about", "no locale stacking via Link");
});

test("P-C4: Bg prefixes url() in the backgroundImage prop and inline style, case-insensitively", () => {
  const a = renderToString(React.createElement(Bg, { backgroundImage: "/img/p.svg" }));
  assert.ok(a.includes("/demo/img/p.svg"), a);
  const b = renderToString(
    React.createElement(Bg, { style: { background: "url(/x/a.png) no-repeat" } })
  );
  assert.ok(b.includes("url(/demo/x/a.png)"), b);
  const c = renderToString(
    React.createElement(Bg, { style: { background: "URL(/x/a.png)" } })
  );
  assert.ok(c.includes("/demo/x/a.png"), `case-insensitive: ${c}`);
  const d = renderToString(React.createElement(Bg, { backgroundImage: "//cdn/x" }));
  assert.ok(!d.includes("/demo//cdn"), `protocol-relative destroyed: ${d}`);
});

test("P-C5: Source srcSet — root-relative candidates prefixed, descriptors kept, data: URIs intact", () => {
  const html = renderToString(
    React.createElement(Source, { srcSet: "/img/logo.svg 1x, /img/pattern.svg 2x" })
  );
  const set = attrOf(html, "srcSet");
  assert.equal(set, "/demo/img/logo.svg 1x, /demo/img/pattern.svg 2x");

  const data = renderToString(
    React.createElement(Source, { srcSet: "data:image/png;base64,AAAA,BBBB 1x" })
  );
  assert.equal(attrOf(data, "srcSet"), "data:image/png;base64,AAAA,BBBB 1x", "data URI must survive verbatim");

  const mixed = renderToString(
    React.createElement(Source, { srcSet: "/a.png 1x, data:image/png;base64,AA,AA 2x" })
  );
  const m = attrOf(mixed, "srcSet");
  assert.ok(m.startsWith("/demo/a.png 1x,"), m);
  assert.ok(m.includes("data:image/png;base64,AA,AA 2x"), m);
});

test("P-C6: rendering is pure — double render is byte-identical, no window access", () => {
  for (const src of HOSTILE) {
    const el = React.createElement(Video, { src, poster: "/img/p.svg" });
    assert.equal(renderToString(el), renderToString(el));
  }
});

test("P-C7: already-prefixed props pass through components unchanged (idempotence)", () => {
  const html = renderToString(React.createElement(Image, { src: "/demo/x.png", alt: "x" }));
  assert.equal(attrOf(html, "src"), "/demo/x.png");
});

test("P-C8: Link honors the provider's locale list (non-default locales)", () => {
  const html = renderToString(
    React.createElement(
      LocaleProvider,
      { defaultLocale: "en", availableLocales: ["en", "ja"] },
      React.createElement(Link, { href: "/ja/about", id: "l1" }),
      React.createElement(Link, { href: "/en/x", id: "l2" })
    )
  );
  const l1 = html.match(/id="l1"[^>]*href="([^"]+)"/) || html.match(/href="([^"]+)"[^>]*id="l1"/);
  const l2 = html.match(/id="l2"[^>]*href="([^"]+)"/) || html.match(/href="([^"]+)"[^>]*id="l2"/);
  assert.equal(l1[1], "/ja/about", "cross-locale ja must not stack");
  assert.equal(l2[1], "/en/x");
});
