// Property-based fuzz for the path utils — deterministic (seeded PRNG), so a
// failure is always reproducible. The properties are the oracle: no reference
// implementation to drift against.
import { test } from "node:test";
import assert from "node:assert/strict";

// Mulberry32 seeded PRNG — deterministic across runs.
function prng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = prng(0x5eed);
const pick = (xs) => xs[Math.floor(rand() * xs.length)];

const ALPHABET = [..."abx1./:?#=&%+-_ ~'\"[]()@,"];
function randString(maxLen = 20) {
  const n = Math.floor(rand() * maxLen) + 1;
  let s = "";
  for (let i = 0; i < n; i++) s += pick(ALPHABET);
  return s;
}

// Curated nasty inputs — every class of input that ever bit us.
const NASTY = [
  "", "/", "//", "///", "/a", "/a/", "/a//b", "/en/vi/x", "/vi/vi/x",
  "/a?b=https://x//y", "/a#frag//x", "?only-query", "#only-hash",
  "https://x/y", "http://X/Y", "//cdn/x", "/_next/static/x", "/_next/x",
  "data:image/png;base64,AAAA", "blob:https://x/y", "mailto:a@b", "tel:+1",
  "/%2F%2Fevil", "/..%2F..%2Fetc", "/a b", "/a+b", "/A/B", "/EN/x",
  "/\ta", "/a\n", "/é/ü", "/✓", "/x".repeat(80), "HTTPS://X/Y",
  "/demo/x", "/proxy/4173/demo/x", "/demo//vi/x", "/vi//about", "/img/a.png", "/logo.svg 1x, /p.svg 2x",
  "url(/a.png)", "URL('/a.png')", "url(//c/x)", "url(/_next/a)", "a,b,c",
];

function genInputs(count) {
  const out = [...NASTY];
  for (let i = 0; i < count; i++) {
    const shape = Math.floor(rand() * 4);
    if (shape === 0) out.push(randString());
    else if (shape === 1) out.push("/" + randString());
    else if (shape === 2) out.push("/" + randString(8) + "?" + randString(8));
    else out.push("/vi/" + randString());
  }
  return out;
}

const ENV_BASE_PATHS = ["", "/d", "/demo", "/proxy/4173/demo", "/a/b/c/d/e"];

// Inputs the CONTRACT passes through untouched — excluded from
// round-trip/shape properties (they never gain a prefix by design).
const isSkipped = (p) =>
  typeof p !== "string" ||
  !p.startsWith("/") ||
  p.startsWith("//") ||
  /^https?:/i.test(p) ||
  /^\/?_next\//.test(p) || /^(data:|blob:|mailto:|tel:|#|\?)/.test(p);

const {
  getBasePath,
  getPrefixPath,
  getPrefixCssUrl,
  resetPathCache,
  parseLocaleFromPath,
  getLocaleRoute,
  getLocalePath,
} = await import("../dist/utils/basepath.js");

function withBasePath(bp, fn) {
  process.env.BASE_PATH = bp;
  resetPathCache();
  try {
    fn(bp);
  } finally {
    process.env.BASE_PATH = "/demo";
    resetPathCache();
  }
}

const LOCALES = ["en", "vi"];
const stripLeadingAny = (r) => {
  const flat = "/" + r.replace(/^\/+/, ""); // normalize leading slashes first
  const seg = flat.replace(/^\/+/, "").split("/")[0];
  return LOCALES.includes(seg) ? flat.slice(seg.length + 1) || "/" : flat;
};

test("P1 prefix idempotence + P5 no double-prefix, across basePaths", () => {
  const inputs = genInputs(400);
  for (const bp of ENV_BASE_PATHS) {
    withBasePath(bp, () => {
      for (const p of inputs) {
        const once = getPrefixPath(p);
        const twice = getPrefixPath(once);
        assert.equal(twice, once, `not idempotent under bp=${bp}: ${JSON.stringify(p)}`);
        if (bp && once.startsWith(bp)) {
          // True stacking means the output begins with bp twice — a mere
          // "/d/d" substring (bp="/d", input "/demo/x") is legit content.
          assert.ok(
            !once.startsWith(bp + bp + "/") && once !== bp + bp,
            `stacked basePath under bp=${bp}: ${JSON.stringify(once)}`
          );
        }
      }
    });
  }
});

test("P2 query/hash survive prefixing untouched", () => {
  const inputs = genInputs(300).filter((p) => /[?#]/.test(p));
  for (const bp of ENV_BASE_PATHS) {
    withBasePath(bp, () => {
      for (const p of inputs) {
        const out = getPrefixPath(p);
        const inQ = p.slice(Math.min(...["?", "#"].map((c) => (p.indexOf(c) === -1 ? Infinity : p.indexOf(c)))));
        const outQ = out.slice(Math.min(...["?", "#"].map((c) => (out.indexOf(c) === -1 ? Infinity : out.indexOf(c)))));
        if (typeof getPrefixPath(p) === "string" && p.startsWith("/") && !/^(https?:|\/\/|data:|blob:|_next)/.test(p.slice(0, 8))) {
          assert.equal(outQ, inQ, `search/hash mutated under bp=${bp}: ${JSON.stringify(p)} -> ${JSON.stringify(out)}`);
        }
      }
    });
  }
});

test("P3 round-trip: parse(getLocalePath(p, l)) recovers the app path and locale", () => {
  const inputs = genInputs(300).filter((p) => !isSkipped(p) && !/[?#]/.test(p));
  for (const bp of ENV_BASE_PATHS) {
    withBasePath(bp, () => {
      for (const p of inputs) {
        for (const l of LOCALES) {
          const full = getLocalePath(p, l);
          const parsed = parseLocaleFromPath(full, LOCALES);
          // Spec: a bp-prefixed input normalizes (bp stripped then rebuilt).
          let base = p;
          if (bp && (base === bp || base.startsWith(`${bp}/`))) base = base.slice(bp.length) || "/";
          // Effective locale: a leading known locale in the (bp-stripped)
          // input wins (intent preservation), else the requested one.
          const inSeg = base.replace(/^\/+/g, "").split("/")[0];
          const eff = LOCALES.includes(inSeg) ? inSeg : l;
          assert.equal(parsed.locale, eff, `locale lost under bp=${bp}: ${JSON.stringify(p)} -> ${JSON.stringify(full)} -> ${JSON.stringify(parsed)}`);
          const want = stripLeadingAny(base).replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
          assert.equal(parsed.path, want, `path lost under bp=${bp}: ${JSON.stringify(p)} -> ${JSON.stringify(full)} -> ${JSON.stringify(parsed)}`);
        }
      }
    });
  }
});

test("P4 skip-set: pass-through inputs are byte-identical everywhere", () => {
  const skip = ["https://x/y", "http://X/Y", "//cdn/x", "data:a,b", "blob:x", "mailto:a@b", "tel:+1", "#frag", "not/a/path", ""];
  for (const bp of ENV_BASE_PATHS) {
    withBasePath(bp, () => {
      for (const p of skip) {
        assert.equal(getPrefixPath(p), p, `getPrefixPath mutated skip input: ${p}`);
        assert.equal(getLocaleRoute(p, "vi"), p, `getLocaleRoute mutated skip input: ${p}`);
        assert.equal(getLocalePath(p, "vi"), p, `getLocalePath mutated skip input: ${p}`);
      }
      assert.equal(getPrefixPath("/_next/a"), "/_next/a");
    });
  }
});

test("P6 getLocalePath shape: basePath + locale + path prefix, always", () => {
  const inputs = genInputs(200).filter((p) => !isSkipped(p) && !/[?#]/.test(p));
  for (const bp of ENV_BASE_PATHS) {
    withBasePath(bp, () => {
      for (const p of inputs) {
        for (const l of LOCALES) {
          const out = getLocalePath(p, l);
          assert.ok(
            LOCALES.some(
              (x) => out.startsWith(`${bp}/${x}/`) || out === `${bp}/${x}` || (bp === "" && out.startsWith(`/${x}`))
            ),
            `bad shape under bp=${bp}: ${JSON.stringify(p)} -> ${JSON.stringify(out)}`
          );
          if (!p.includes(`/${l}/${l}`) && !stripLeadingAny(p).replace(/^\/+/, "").startsWith(`${l}/`)) {
            assert.ok(!out.includes(`/${l}/${l}`), `stacked locale: ${JSON.stringify(out)}`);
          }
        }
      }
    });
  }
});

test("P7 parseLocaleFromPath never invents locales and is slash-stable", () => {
  const inputs = genInputs(400).filter((p) => p.startsWith("/"));
  const KNOWN = new Set(LOCALES);
  for (const bp of ENV_BASE_PATHS) {
    withBasePath(bp, () => {
      for (const p of inputs) {
        const first = parseLocaleFromPath(p, LOCALES);
        const again = parseLocaleFromPath(p, LOCALES);
        assert.deepEqual(again, first, `non-deterministic parse: ${JSON.stringify(p)}`);
        assert.ok(first.locale === undefined || KNOWN.has(first.locale), `invented locale from ${JSON.stringify(p)}: ${first.locale}`);
      }
    });
  }
});

test("P8 css url: every root-relative url() gains the prefix exactly once; // and _next untouched", () => {
  const cases = [
    "url(/a.png)", "url(/a.png), url(/b.png)", "background:url('/a.png');url(\"/c.png\")",
    "url(//cdn/x)", "url(/_next/a)", "URL(/A.png)", "none", "url(data:a,b)",
  ];
  for (const bp of ENV_BASE_PATHS) {
    withBasePath(bp, () => {
      for (const c of cases) {
        const out = getPrefixCssUrl(c);
        if (!bp) { assert.equal(out, c); continue; }
        const count = (s) => (s.match(new RegExp(`${bp.replace(/\//g, "\\/")}\\/`, "g")) || []).length;
        if (c.startsWith("url(/a") || c.includes("url('/a") || c.includes('url("/c') || c === "URL(/A.png)") {
          assert.ok(out.includes(`${bp}/`), `no prefix: ${c} -> ${out}`);
          assert.ok(count(out) >= 1, `prefix vanished: ${c} -> ${out}`);
        }
        assert.ok(!out.includes(`${bp}//cdn`), `protocol-relative destroyed: ${c} -> ${out}`);
        assert.ok(!out.includes(`${bp}/_next`), `_next prefixed: ${c} -> ${out}`);
      }
    });
  }
});

test("P9 getLocaleRoute idempotence + query preservation", () => {
  const inputs = genInputs(300).filter((p) => p.startsWith("/"));
  for (const p of inputs) {
    for (const l of LOCALES) {
      const once = getLocaleRoute(p, l);
      const twice = getLocaleRoute(once, l);
      assert.equal(twice, once, `getLocaleRoute not idempotent: ${JSON.stringify(p)} -> ${once} -> ${twice}`);
      const inQ = p.indexOf("?") === -1 ? "" : p.slice(p.indexOf("?"));
      if (inQ) {
        // The query must survive VERBATIM — a mutant that drops it must
        // fail here, not slip through an includes() check.
        assert.ok(once.includes("?"), `query dropped: ${JSON.stringify(p)} -> ${once}`);
        assert.equal(once.slice(once.indexOf("?")), inQ, `query mutated: ${JSON.stringify(p)} -> ${once}`);
      }
    }
  }
});
