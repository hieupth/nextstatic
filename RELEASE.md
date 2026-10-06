# Release runbook

Every step, in order, from a green `main` to a published release.

## 1. Pre-flight (on main, all green)

```bash
npm test && npm run test:components && npm run redteam   # 44/44, 12/12, 10/11 + documented survivor
cd examples && npm ci && BASE_PATH=/demo npx next build --webpack && node tools/verify-export.mjs out /demo
cd .. && npm audit --audit-level=high                    # 0 at both roots
```

## 2. Tag the release commit

The tag MUST point at the commit that carries the workflow state you want
(an orphaned tag on an amended-away commit publishes a stale tree):

```bash
git tag -d v0.0.2 && git push origin :refs/tags/v0.0.2   # remove any stale tag
git tag v0.0.2 "$(git rev-parse HEAD)"                   # tag the CURRENT main
git push origin v0.0.2
```

Pushing the tag triggers `Publish` (pack → test gate → upload →
approval-gated publish via OIDC trusted publishing).

## 3. Approve the publish

Actions → **Publish** → the run for the tag → *Publish to npm (approval
required)* → **Approve and deploy** (environment `npm_publish_approval`).
The npm Trusted Publisher registration must match repo `hieupth/nextstatic`,
workflow `publish.yml`, environment `npm_publish_approval` exactly.

If OIDC is still misconfigured, publish the same tarball locally:

```bash
npm publish   # asks for the 2FA OTP; provenance is CI-only, everything else identical
```

## 4. Post-publish

```bash
# retire the broken first release
npm deprecate @hieupth/nextstatic@0.0.1 "broken ESM dist and locale parsing — upgrade to ^0.0.2"

npm view @hieupth/nextstatic versions dist-tags          # 0.0.2 under latest
```

- **GitHub Pages**: repo Settings → Pages → Source *Deploy from a branch*
  → `gh-pages` /(root). CI already pushes the branch on every green build;
  the site only serves once Pages is enabled.
- **Super-repo**: commit the submodule pointer bump
  (`src/next-static-path` @ the release commit) plus any CLAUDE.md rows.

## Known deployment limitation

A `BASE_PATH` that equals a locale segment (e.g. `BASE_PATH=/vi` with locale
`vi`) is ambiguous at the URL level (`/vi/vi/x`) and is not supported; pick
a basePath that does not collide with any locale.
