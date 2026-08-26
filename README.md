# Nextstatic

[![License: AGPL v3 + Commercial](https://img.shields.io/badge/License-AGPL%20v3%20%2B%20Commercial-blue.svg)](#license)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black.svg)](https://nextjs.org/)

**`@hieupth/nextstatic`** — the path & asset layer for Next.js static exports
hosted under a sub-directory (GitHub Pages project sites, `/repo` URLs).
One `BASE_PATH` feeds both Next and the lib; links, images, scripts, media
and CSS urls all carry the prefix automatically.

## Install

```bash
npm install @hieupth/nextstatic
# or pin a GitHub ref
npm install github:hieupth/nextstatic#v0.0.1
```

## Docs & examples

The living documentation **is** the example app at [`examples/`](examples/) —
setup, every component and hook running live, the i18n patterns, and the
path-contract verifier:

```bash
cd examples && npm install && npm run dev          # browse the docs
```

Quality gates (static HTML + browser audit) run in CI via
[`.github/workflows/publish.yml`](.github/workflows/publish.yml).

## License

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

Copyright © 2025 [Hieu Pham](https://github.com/hieupth). All rights reserved.

