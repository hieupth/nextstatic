# Changelog

## 0.0.2

Path-utility correctness release. **Read before upgrading from 0.0.1** — two
behavioral changes are deliberate:

### Breaking / behavioral changes

- **Peer requirement**: `next >= 16.3` (was `^15.5.3`). On Next 15 projects
  the install now hard-fails — upgrade Next first, or stay on 0.0.1.
- **Leading locale wins**: an href that already starts with a known locale
  segment keeps it. `Link href="/ja/about"` under an `en` page renders
  `/ja/about` — it no longer stacks (`/en/ja/about`, the 0.0.1 behavior that
  404'd) and is not silently retargeted. Locale-free hrefs still gain the
  current locale. Pass your app's list via `availableLocales` (new optional
  parameter on `getLocaleRoute`/`getLocalePath`, threaded through `Link` and
  `useRouter` from the provider) for locales beyond the default `["en","vi"]`.

### Fixes

- Query strings and hashes survive every prefixing helper verbatim
  (`?to=https://x` no longer collapses to `https:/x`).
- All prefixing helpers are idempotent (already-prefixed inputs,
  basePath-root-with-query, cross-locale inputs).
- `parseLocaleFromPath` handles multi-segment base paths, queries and
  repeated slashes.
- `LocaleProvider` survives blocked `localStorage` (private mode / webviews),
  persists under the namespaced key `nextstatic:locale` and migrates the old
  `preferred-locale` once; new `persist={false}` opts fixed-locale trees out
  of storage entirely.
- Internal dist imports now carry explicit `.js` specifiers (0.0.1's
  extensionless form broke every consumer). Note: importing the package in
  raw Node ESM still requires a bundler — the `next/*` subpath imports are
  resolved by webpack/Turbopack, not by Node's specifier rules.
- `srcSet` candidates keep descriptors; commas inside `data:` URIs are no
  longer treated as separators; `CSS url()` rewriting is case-insensitive
  and protocol-relative-safe.
- Component prop types now include `ref` (`ComponentProps<"tag">`).
- `useRouter().push/replace/prefetch` no longer accept `URL` objects —
  pass string hrefs (matches Next 16's own App Router signatures).

### Verification

37 unit/fuzz tests, an 8-property render oracle and a mutation harness ship
in the repo (`npm test`, `npm run test:components`, `npm run redteam`).
