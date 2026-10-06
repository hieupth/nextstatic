// Export verification oracle — crawls a built static export and asserts the
// lib's core contract END TO END: every internal URL carries the basePath
// exactly once and resolves to a real file. Deterministic; replaces the
// ad-hoc curl audits. Run after any build:
//   node tools/verify-export.mjs <outDir> <basePath>
// e.g. node tools/verify-export.mjs out /proxy/4173/demo
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const [outDir, basePathArg] = process.argv.slice(2);
const out = resolve(outDir || "out");
const basePath = (basePathArg ?? "").replace(/\/+$/, "");

if (!existsSync(out)) {
  console.error(`no export at ${out} — build first`);
  process.exit(1);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const htmlFiles = [...walk(out)].filter((f) => f.endsWith(".html"));
const EXTERNAL = /^(https?:|data:|blob:|mailto:|tel:|#|\/\/)/i;
const problems = [];
let checked = 0;

function resolvesTo(fileRel) {
  // trailingSlash convention: /x/y/ → x/y/index.html; assets map directly.
  let rel;
  try {
    rel = decodeURIComponent(fileRel.split(/[?#]/)[0].replace(/^\//, ""));
  } catch {
    return { ok: false, undecodable: true };
  }
  if (rel.endsWith("/")) rel += "index.html";
  if (!rel.endsWith(".html") && !/\.[a-z0-9]+$/i.test(rel)) rel += "/index.html";
  return { ok: existsSync(join(out, rel)) };
}

for (const file of htmlFiles) {
  let html = readFileSync(file, "utf8");
  // Keep <script src="…"> for checking; drop only INLINE script bodies.
  html = html.replace(/(<script[^>]*>)[\s\S]*?(<\/script>)/g, "$1$2");
  const attrs = [
    ...html.matchAll(/(?<![\w-])(?:href|src|action|poster|srcset)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi),
  ].map((m) => m[1] ?? m[2])
  .flatMap((raw) => (EXTERNAL.test(raw) ? [] : raw.split(",").map((x) => x.trim().split(/\s+/)[0])));
  // url(/…) inside inline style attributes must also carry the basePath.
  for (const sm of html.matchAll(/style\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const style = sm[1] ?? sm[2] ?? "";
    for (const um of style.matchAll(/url\(\s*['"]?\/(?!\/)(?!_next\/)[^)'"]*['"]?\)/gi)) {
      attrs.push(um[0].replace(/^url\(\s*['"]?/i, "").replace(/['"]?\)$/i, ""));
    }
  }
  for (const raw of attrs) {
    {
      const url = raw;
      checked++;
      if (!url.startsWith("/")) continue; // relative — fine
      if (basePath && !url.startsWith(`${basePath}/`) && url !== basePath) {
        problems.push(`${file.replace(out, "")}: internal URL missing basePath → ${url}`);
        continue;
      }
      const stripped = basePath ? url.slice(basePath.length) : url;
      const r = resolvesTo(stripped);
      if (r.undecodable) {
        problems.push(`${file.replace(out, "")}: undecodable percent-escape → ${url}`);
      } else if (!r.ok) {
        problems.push(`${file.replace(out, "")}: URL does not resolve under out/ → ${url}`);
      }
      if (basePath && url.includes(`${basePath}${basePath}`)) {
        problems.push(`${file.replace(out, "")}: doubled basePath → ${url}`);
      }
    }
  }
}

if (htmlFiles.length === 0 || checked === 0) {
  console.error(`FAIL — nothing to check (${htmlFiles.length} HTML files, ${checked} URLs) under ${out}; wrong directory or basePath?`);
  process.exit(1);
}
console.log(`checked ${checked} internal URLs across ${htmlFiles.length} HTML files (basePath=${JSON.stringify(basePath)})`);
if (problems.length) {
  console.error(`FAIL — ${problems.length} problems:`);
  for (const p of problems) console.error("  -", p);
  process.exit(1);
}
console.log("OK — every internal URL prefixed exactly once and resolvable");
