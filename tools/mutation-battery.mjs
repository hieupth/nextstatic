// Property battery for the mutation harness — run as a CHILD process with a
// timeout so a non-terminating mutant dies instead of hanging the harness.
process.env.BASE_PATH = "/demo";
const assert = (await import("node:assert/strict")).default;
const m = await import("/tmp/nextstatic-mutation/basepath.mjs");
const eq = assert.equal;
eq(m.getPrefixPath("/i/a.png"), "/demo/i/a.png");
eq(m.getPrefixPath("https://x/y"), "https://x/y");
eq(m.getPrefixPath("//x/y"), "//x/y");
eq(m.getPrefixPath("/demo/x"), "/demo/x");
eq(m.getPrefixPath("/r?to=https://e/x"), "/demo/r?to=https://e/x");
eq(m.getPrefixCssUrl("url(/i/a.png)"), "url(/demo/i/a.png)");
eq(m.getPrefixCssUrl("URL(/i/a.png)").slice(0, 3), "URL");
eq(m.getPrefixCssUrl("url(//c/x)"), "url(//c/x)");
eq(m.getPrefixCssUrl(m.getPrefixCssUrl("url(/i/a.png)")), "url(/demo/i/a.png)");
eq(JSON.stringify(m.parseLocaleFromPath("/demo/vi/a")), JSON.stringify({ path: "/a", locale: "vi" }));
eq(JSON.stringify(m.parseLocaleFromPath("/vi?x=1")), JSON.stringify({ path: "/?x=1", locale: "vi" }));
eq(JSON.stringify(m.parseLocaleFromPath("/demo//vi/a")), JSON.stringify({ path: "/a", locale: "vi" }));
eq(m.getLocaleRoute("/a", "vi"), "/vi/a");
eq(m.getLocaleRoute("/vi/a", "vi"), "/vi/a");
eq(m.getLocaleRoute("/about?next=/x", "vi"), "/vi/about?next=/x"); // query survives route
eq(m.getLocaleRoute("/en/a", "vi"), "/en/a"); // leading locale wins
eq(m.getLocalePath("/a", "vi"), "/demo/vi/a");
eq(m.getLocalePath("/en/a", "vi"), "/demo/en/a"); // leading locale wins
eq(m.getLocaleRoute("/demo/vi/a", "vi"), "/vi/a"); // bp-prefixed normalizes
eq(m.getLocalePath("/demo?x=1", ""), "/demo?x=1"); // locale-empty delegates
eq(m.getLocalePath("/vi/a?k=https://x//y", "vi"), "/demo/vi/a?k=https://x//y");
