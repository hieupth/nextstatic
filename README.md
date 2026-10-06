# Nextstatic

[![License: AGPL v3 + Commercial](https://img.shields.io/badge/License-AGPL%20v3%20%2B%20Commercial-blue.svg)](#license)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3%2B-black.svg)](https://nextjs.org/)

**`@hieupth/nextstatic`** — the path & asset layer for Next.js static exports
hosted under a sub-directory (GitHub Pages project sites, `/repo` URLs).
One `BASE_PATH` feeds both Next and the lib; links, images, scripts and
media components carry the prefix automatically, as do `url()` values in
inline styles and component code. (Absolute `url(/…)` inside hand-written
`.css` files is not rewritten — process those with `getPrefixCssUrl`.) Locale lives in the route:
links gain the right locale segment at build time, so every language ships
as plain static HTML — no client-side flash, no redirect.

## Install

```bash
npm install @hieupth/nextstatic
```

The lib reads `BASE_PATH` (falling back to `NEXT_PUBLIC_BASE_PATH`). For the
client bundle to see it, inline both via the `env` block in `next.config.ts`
— see the example's [`examples/next.config.ts`](examples/next.config.ts).

## Docs & examples

The living documentation **is** the example app at [`examples/`](examples/) —
setup, every component and hook running live, and the i18n patterns.
Browse it deployed (under its own sub-directory, as intended; the
deployment may lag `main` until the next push):

**https://hieupth.github.io/nextstatic/**

Or run it locally:

```bash
npm install && npm run build     # build the lib first — examples consumes dist/
cd examples && npm install && npm run dev          # browse the docs
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

To request a commercial license, contact [Hieu Pham](https://github.com/hieupth).

Copyright © 2026 [Hieu Pham](https://github.com/hieupth). All rights reserved.


