# Nextstatic

[![License: AGPL v3 + Commercial](https://img.shields.io/badge/License-AGPL%20v3%20%2B%20Commercial-blue.svg)](#license)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black.svg)](https://nextjs.org/)

**`@hieupth/nextstatic`** — the path & asset layer for Next.js static exports
hosted under a sub-directory (GitHub Pages project sites, `/repo` URLs, shared
hosting prefixes).

A Next static export lives under a `basePath` — but every `href`, `src`,
background image, script, and CSS URL in your app still points at the site
root by default. Nextstatic wraps the primitives you already use (`Link`,
`Image`, `Script`, media tags) and prefixes asset paths for you, driven by the
same `BASE_PATH` your `next.config` uses. One source of truth, zero hardcoded
prefixes.

## Install

```bash
npm install @hieupth/nextstatic
# or pin a GitHub ref
npm install github:hieupth/nextstatic#v0.1.0
```

## Setup

Feed one env var to both Next and the lib — they must agree:

```ts
// next.config.ts
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // directory-index static output (host-friendly)
  basePath,            // Next: route URLs
  assetPrefix: basePath,
  images: { unoptimized: true },
};
export default nextConfig;
```

The lib reads `BASE_PATH` (falling back to `NEXT_PUBLIC_BASE_PATH`) at
runtime for asset paths — the same value, no second knob.

## Usage

Drop-in wrappers — same props as the Next originals:

`Link` builds locale-aware hrefs, so it reads locale context — **mount a
`LocaleProvider` above any `Link`** (crisp error if missing):

```tsx
import { LocaleProvider } from "@hieupth/nextstatic";

// app/layout.tsx
<html lang="en">
  <body>
    <LocaleProvider defaultLocale="en" availableLocales={["en", "vi"]}>
      {children}
    </LocaleProvider>
  </body>
</html>
```

```tsx
import { Link, Image, Script, Video, Bg } from "@hieupth/nextstatic";

<Link href="/about">About</Link>                 // → /demo/about under BASE_PATH=/demo
<Image src="/img/logo.svg" alt="Logo" width={120} height={120} />
<Script src="/js/analytics.js" strategy="afterInteractive" />
<Video src="/media/clip.mp4" controls />
<Bg backgroundImage="/img/hero.jpg" className="hero" /> // CSS background-image, prefixed
```

Hooks and utils for anything custom:

```tsx
import { useAssetPath, useAsset, useAssets, useRouter, usePathname,
         LocaleProvider, useLocale,
         getPrefixPath, getPrefixCssUrl } from "@hieupth/nextstatic";

const { basePath, getPath, getCssUrl, isExternal } = useAssetPath();
getPath("/img/logo.svg");            // "/demo/img/logo.svg"
getCssUrl("/img/hero.jpg");          // url("/demo/img/hero.jpg") for CSS-in-JS

const logo = useAsset("/img/logo.svg");          // single path → string
const [hero, og] = useAssets(["/img/hero.jpg", "/img/og.png"]);

const router = useRouter();                      // basePath-aware navigation
const path = usePathname();

getPrefixPath("/docs");                          // "/demo/docs" (plain util)
getPrefixCssUrl("images/a.png");                 // url(".../images/a.png")

<LocaleProvider defaultLocale="en" availableLocales={["en", "vi"]}>
  <App />                                        // useLocale() → { locale, setLocale, ... }
</LocaleProvider>
```

## API

**Components** — `Image`, `Link`, `Script`, `Anchor`, `Audio`, `Bg`, `Form`,
`Iframe`, `Source`, `Video`

**Hooks** — `useAssetPath`, `useAsset`, `useAssets`, `useRouter`,
`usePathname`, `useLocale`, `LocaleProvider`

**Utils** — `getBasePath`, `getPrefixPath`, `getPrefixUrlObject`,
`getPrefixCssUrl`, `parseLocaleFromPath`, `getLocalePath`, `getLocaleRoute`,
`getCurrentLocale`, `resetPathCache`

Prefixing contract: **Next primitives (`Link`, `useRouter`) add only the
locale segment** (`getLocaleRoute`) — Next itself applies `basePath`, so
prefixing it there would double it. **Raw surfaces** (`<a href>`, `<img>`,
`<script>`, CSS urls) use the basePath-aware utils (`getPrefixPath`,
`getLocalePath`).

Resolution model: the dist is consumed through Next's bundler (webpack /
Turbopack) — specifiers are extensionless by decision, Next-first.
`npm run smoke` (esbuild bundle of both entries) is the module-graph gate.

## Examples & verification

[`examples`](examples) is a static-export app that exercises every
export (components, hooks, utils) and **proves the basePath contract**: it
builds with `BASE_PATH=/demo`, then `npm run verify:example` scans the emitted
HTML for prefixed asset/link URLs and fails on any unprefixed root-absolute
reference.

```bash
cd examples && npm install
npm run verify:example    # builds with BASE_PATH=/demo + asserts the output
```

## License

This project is **dual-licensed** to suit different needs:

- **AGPL-3.0** (default, open-source) — Free for students, researchers,
  enthusiasts, and open-source projects. You may use, study, modify, and
  distribute this project under the terms of the [GNU AGPL v3.0](LICENSE).
  Distributing the project, or offering it over a network, requires
  releasing the corresponding source under the same AGPL-3.0 terms.
- **Commercial License** — For proprietary, closed-source, or production
  use that AGPL-3.0 does not permit: internal tools, commercial products,
  or deployments where you cannot meet AGPL's source-disclosure
  obligations. A commercial license grants use without the copyleft
  requirements.

To request a commercial license, contact **Hieu Pham** via
[github.com/hieupth](https://github.com/hieupth).

Copyright © 2025 [Hieu Pham](https://github.com/hieupth). All rights reserved.
