// Edge-matrix tests for the pure path utils, run against the BUILT dist
// (node --test test/ after npm run build).
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.BASE_PATH = "/proxy/4173/demo";
const {
  getBasePath,
  getPrefixPath,
  getPrefixUrlObject,
  getPrefixCssUrl,
  resetPathCache,
  parseLocaleFromPath,
  getLocaleRoute,
  getLocalePath,
} = await import("../dist/utils/basepath.js");

test("getBasePath strips trailing slashes", () => {
  assert.equal(getBasePath(), "/proxy/4173/demo");
});

test("getPrefixPath basics + skips", () => {
  assert.equal(getPrefixPath("/img/a.png"), "/proxy/4173/demo/img/a.png");
  assert.equal(getPrefixPath("relative.png"), "relative.png");
  assert.equal(getPrefixPath(""), "");
  assert.equal(getPrefixPath("https://x.com/a"), "https://x.com/a");
  assert.equal(getPrefixPath("//cdn.x/a"), "//cdn.x/a");
  assert.equal(getPrefixPath("/_next/static/a.js"), "/_next/static/a.js");
  assert.equal(getPrefixPath("#anchor"), "#anchor");
});

test("getPrefixPath preserves query strings and hashes (no // collapse)", () => {
  assert.equal(
    getPrefixPath("/redirect?to=https://ex.com/x"),
    "/proxy/4173/demo/redirect?to=https://ex.com/x"
  );
  assert.equal(getPrefixPath("/a#//b"), "/proxy/4173/demo/a#//b");
});

test("getPrefixPath is idempotent (already-prefixed passes through)", () => {
  assert.equal(getPrefixPath("/proxy/4173/demo/x"), "/proxy/4173/demo/x");
  assert.equal(getPrefixPath("/demo/page"), "/proxy/4173/demo/demo/page"); // not a prefix of basePath
});

test("getPrefixCssUrl rewrites url(/…), case-insensitive, skips // and _next", () => {
  assert.equal(getPrefixCssUrl("url(/img/a.png)"), "url(/proxy/4173/demo/img/a.png)");
  assert.equal(getPrefixCssUrl("URL(/img/a.png)"), "URL(/proxy/4173/demo/img/a.png)");
  assert.equal(getPrefixCssUrl("url('/img/a.png')"), "url('/proxy/4173/demo/img/a.png')");
  assert.equal(getPrefixCssUrl("url(//cdn.com/x.png)"), "url(//cdn.com/x.png)");
  assert.equal(getPrefixCssUrl("url(/_next/x.png)"), "url(/_next/x.png)");
  assert.equal(getPrefixCssUrl("no url here"), "no url here");
});

test("parseLocaleFromPath strips multi-segment basePath", () => {
  assert.deepEqual(parseLocaleFromPath("/proxy/4173/demo/vi/about"), {
    path: "/about",
    locale: "vi",
  });
  assert.deepEqual(parseLocaleFromPath("/vi/about"), { path: "/about", locale: "vi" });
  assert.deepEqual(parseLocaleFromPath("/proxy/4173/demo"), { path: "/", locale: undefined });
  assert.deepEqual(parseLocaleFromPath("/proxy/4173/demo/docs"), { path: "/docs", locale: undefined });
});

test("parseLocaleFromPath collapses internal double slashes", () => {
  assert.deepEqual(parseLocaleFromPath("/proxy/4173/demo//vi/about"), {
    path: "/about",
    locale: "vi",
  });
});

test("getLocaleRoute adds the locale segment only, idempotently, preserving query", () => {
  assert.equal(getLocaleRoute("/about", "vi"), "/vi/about");
  assert.equal(getLocaleRoute("/vi/about", "vi"), "/vi/about"); // no stacking
  assert.equal(getLocaleRoute("/about?next=https://x//y", "vi"), "/vi/about?next=https://x//y");
  assert.equal(getLocaleRoute("/about", ""), "/about");
  assert.equal(getLocaleRoute("https://x/a", "vi"), "https://x/a");
});

test("getLocalePath = basePath + locale + path, preserving query", () => {
  assert.equal(getLocalePath("/about", "vi"), "/proxy/4173/demo/vi/about");
  assert.equal(getLocalePath("/about/", "vi"), "/proxy/4173/demo/vi/about/");
  assert.equal(getLocalePath("/a?to=https://x//y", "vi"), "/proxy/4173/demo/vi/a?to=https://x//y");
  assert.equal(getLocalePath("/about", ""), "/proxy/4173/demo/about");
});

test("getPrefixUrlObject prefixes pathname only", () => {
  assert.deepEqual(getPrefixUrlObject({ pathname: "/docs", query: { q: "1" } }), {
    pathname: "/proxy/4173/demo/docs",
    query: { q: "1" },
  });
});

test("resetPathCache re-reads the environment", () => {
  const before = getBasePath();
  process.env.BASE_PATH = "/other";
  resetPathCache();
  assert.equal(getBasePath(), "/other");
  process.env.BASE_PATH = "/proxy/4173/demo";
  resetPathCache();
  assert.equal(getBasePath(), before);
});

test("r3: getPrefixPath idempotent at basePath root WITH query", () => {
  const bp = getBasePath();
  assert.equal(getPrefixPath(`${bp}?x=1`), `${bp}?x=1`);
});

test("r3: cross-locale inputs never stack locale segments", () => {
  assert.equal(getLocalePath("/en/about", "vi"), "/proxy/4173/demo/en/about"); // leading en wins
  assert.equal(getLocaleRoute("/en/about", "vi"), "/en/about"); // leading en wins
  assert.equal(getLocalePath("/vi/about", "vi"), "/proxy/4173/demo/vi/about");
  assert.equal(getLocalePath("/english/x", "vi"), "/proxy/4173/demo/vi/english/x"); // non-locale word is content
});

test("r3-fix: parseLocaleFromPath detects locale before a query/hash", () => {
  assert.deepEqual(parseLocaleFromPath("/vi?x=1"), { path: "/?x=1", locale: "vi" });
  assert.deepEqual(parseLocaleFromPath(`${getBasePath()}/en/docs?a=1`), { path: "/docs?a=1", locale: "en" });
});

test("r3-fix: getPrefixCssUrl is idempotent (no double prefix)", () => {
  const once = getPrefixCssUrl("url(/img/a.png)");
  assert.equal(getPrefixCssUrl(once), once);
});

test("r4: same-locale idempotence for locales beyond the default list", () => {
  assert.equal(getLocalePath("/ja/about", "ja"), "/proxy/4173/demo/ja/about");
  assert.equal(getLocaleRoute("/fr/x", "fr"), "/fr/x");
});

test("r5: cross-locale no-stack works for ANY locale via availableLocales", () => {
  assert.equal(getLocalePath("/ja/about", "vi", ["en", "vi", "ja"]), "/proxy/4173/demo/ja/about"); // leading ja wins
  assert.equal(getLocaleRoute("/fr/x", "ja", ["ja", "fr"]), "/fr/x"); // leading fr wins
  assert.equal(getLocaleRoute("/ja/about", "ja"), "/ja/about"); // already locale-addressed
});

test("r6: locale helpers normalize already-bp-prefixed input (idempotent, no double-bake)", () => {
  const bp = getBasePath();
  assert.equal(getLocalePath(`${bp}/vi/about`, "vi"), `${bp}/vi/about`);
  assert.equal(getLocalePath(`${bp}?x=1`, ""), `${bp}?x=1`);
  assert.equal(getLocalePath(`${bp}/vi/about?q=1`, "en"), `${bp}/vi/about?q=1`); // vi wins
  assert.equal(getLocaleRoute(`${bp}/vi/about`, "vi"), "/vi/about");
  // documented equivalence: locale "" === getPrefixPath
  assert.equal(getLocalePath("/x/y", ""), getPrefixPath("/x/y"));
  assert.equal(getLocalePath(`${bp}/x/y`, ""), getPrefixPath(`${bp}/x/y`));
});

test("r10: double slash after basePath normalizes (no malformed output)", () => {
  const bp = getBasePath();
  assert.equal(getLocaleRoute(`${bp}//vi/about`, "vi"), "/vi/about");
  assert.equal(getLocalePath(`${bp}//vi/about`, "vi"), `${bp}/vi/about`);
  assert.equal(getLocalePath(`/demo//vi/x`, "vi"), `${bp}/vi/demo/vi/x`); // "/demo" is content here, not this bp
});

test("r11: locale-root canonical — no trailing-slash divergence between code paths", () => {
  const bp = getBasePath();
  for (const l of ["en", "vi"]) {
    assert.equal(getLocalePath(`/${l}`, l), getPrefixPath(getLocaleRoute(`/${l}`, l)));
    assert.equal(getLocalePath(`/${l}`, l), `${bp}/${l}`);
    assert.equal(getLocalePath(`/${l}?x=1`, l), `${bp}/${l}?x=1`);
  }
});

test("r11: getPrefixCssUrl idempotent when the url() target IS the basePath", () => {
  const bp = getBasePath();
  assert.equal(getPrefixCssUrl(`url(${bp})`), `url(${bp})`);
  assert.equal(getPrefixCssUrl(`url(${bp}?v=2)`), `url(${bp}?v=2)`);
  assert.equal(getPrefixCssUrl(`url(${bp}#f)`), `url(${bp}#f)`);
  assert.equal(getPrefixCssUrl(`url(${bp}X)`), `url(${bp}${bp}X)`); // X = content, still prefixes
});

test("r12: locale-root canonical on BOTH code paths (INV1 equality)", () => {
  const bp = getBasePath();
  for (const p of ["/", "/vi", "/vi/", "/vi?x=1", "/vi#f", `${bp}/vi`, `${bp}/vi/`]) {
    for (const l of ["en", "vi"]) {
      assert.equal(getLocalePath(p, l), getPrefixPath(getLocaleRoute(p, l)),
        `INV1 divergence at ${JSON.stringify(p)} + ${l}`);
    }
  }
});

test("r12: css idempotent for QUOTED bp-exact targets", () => {
  const bp = getBasePath();
  assert.equal(getPrefixCssUrl(`url('${bp}')`), `url('${bp}')`);
  assert.equal(getPrefixCssUrl(`url("${bp}")`), `url("${bp}")`);
  assert.equal(getPrefixCssUrl(`URL('${bp}')`), `URL('${bp}')`);
  assert.equal(getPrefixCssUrl(`url('${bp}X')`), `url('${bp}${bp}X')`);
});

test("r13: css whitespace terminator; empty-locale bp-normalization", () => {
  const bp = getBasePath();
  assert.equal(getPrefixCssUrl(`url(${bp} )`), `url(${bp} )`);
  assert.equal(getPrefixCssUrl(`url( ${bp} )`), `url( ${bp} )`);
  // locale "" must strip an already-bp-prefixed input (Next re-adds bp)
  assert.equal(getLocaleRoute(`${bp}/x`, ""), "/x");
  assert.equal(getLocaleRoute(`${bp}`, ""), "/");
});
