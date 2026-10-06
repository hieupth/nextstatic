// Mutation harness — attacks the ORACLE SUITE, not the lib: inject known
// defects into a copy of src/utils/basepath.tsx, compile it with esbuild,
// and count how many mutants the property battery kills. A surviving mutant
// is a hole in the tests — the reason past audits kept finding "new" bugs.
//
// Run: npm run redteam   (not part of the default test — takes ~30-60s)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const SRC = "src/utils/basepath.tsx";
const TMP = "/tmp/nextstatic-mutation";
const original = readFileSync(SRC, "utf8");

// [name, find, replace] — each is a REAL defect class we fixed in r1–r3.
const MUTANTS = [
  ["drop protocol-relative guard", "|| PROTOCOL_RELATIVE_REGEX.test(path) || ABSOLUTE_URL_REGEX.test(path)) {\n    return path;\n  }\n\n  const basePath = getBasePath();\n  if (!basePath) return path;\n\n  // Idempotent", "|| ABSOLUTE_URL_REGEX.test(path)) {\n    return path;\n  }\n\n  const basePath = getBasePath();\n  if (!basePath) return path;\n\n  // Idempotent"],
  ["drop absolute-url guard", "|| PROTOCOL_RELATIVE_REGEX.test(path) || ABSOLUTE_URL_REGEX.test(path)) {\n    return path;\n  }\n\n  const basePath = getBasePath();\n  if (!basePath) return path;\n\n  // Idempotent", "|| PROTOCOL_RELATIVE_REGEX.test(path)) {\n    return path;\n  }\n\n  const basePath = getBasePath();\n  if (!basePath) return path;\n\n  // Idempotent"],
  ["drop idempotence guard (getPrefixPath)", "if (route === basePath || route.startsWith(`${basePath}/`)) return path;", "if (false) return path;"],
  ["corrupt join (keep leading slashes)", "return `${basePath.replace(/\\/+$/, \"\")}/${path.replace(/^\\/+/, \"\")}`;", "return `${basePath.replace(/\\/+$/, \"\")}/${path}`;"],
  ["parse: don't strip basePath", "rest = rest.slice(basePath.length);", "/* mutant */;"],
  ["query: shift search boundary", "return [path.slice(0, m.index), path.slice(m.index)];", "return [path, \"\"];"],
  ["css: allow protocol-relative", "(?!\\\\/)(?!_next\\\\/)", "(?!_next\\\\/)"],
  ["css: lowercase the fn name", "(match, quote) => `${match.slice(0, 3)}(${quote}${basePath}/`", "(match, quote) => `url(${quote}${basePath}/`"],
  ["localeRoute: rebuild despite leading locale", "return `${route}${search}`;", "return `/${locale}/${route.replace(/^\\/+/, \"\")}${search}`;"],
  ["getLocalePath: leading locale ignored", "? seg : locale;", "? locale : locale;"],
  ["parse: keep double slashes", 'rest = rest.replace(/\\/{2,}/g, "/");', "// mutant"],
];

// The battery runs in a CHILD process with a timeout — a non-terminating
// or import-crashing mutant is dead (killed), never a harness hang.
// See tools/mutation-battery.mjs for the assertions.

mkdirSync(TMP, { recursive: true });
let killed = 0;
const survivors = [];
const drifted = [];
for (const [name, find, replace] of MUTANTS) {
  if (!original.includes(find)) {
    console.log(`DRIFTED ✗  ${name}`);
    drifted.push(name);
    continue;
  }
  const mutated = original.replace(find, replace);
  writeFileSync(`${TMP}/basepath.tsx`, mutated);
  // Local esbuild only — an npx network fetch (or its absence) must NEVER
  // be scored as a kill.
  const esbuildBin = "node_modules/.bin/esbuild";
  if (!existsSync(esbuildBin)) {
    console.error(`INFRA FAIL — ${esbuildBin} missing; run npm install`);
    process.exit(2);
  }
  try {
    execFileSync(esbuildBin, [`${TMP}/basepath.tsx`, "--format=esm", "--outfile=/tmp/nextstatic-mutation/basepath.mjs"], { stdio: "pipe" });
  } catch (e) {
    // Distinguish mutant-compile failure (esbuild ran and rejected the
    // code) from infrastructure failure (spawn crash etc.).
    if (e.code && e.code !== 1 && !(e.stderr && /\u2716|error/i.test(String(e.stderr)))) {
      console.error(`INFRA FAIL — esbuild could not run for ${name}: ${e.message}`);
      process.exit(2);
    }
    killed++;
    console.log(`killed   ✓ ${name} (does not compile)`);
    continue;
  }
  try {
    const r = execFileSync("node", ["tools/mutation-battery.mjs"], { stdio: "pipe", timeout: 8000 });
    if (r) { /* battery exits non-zero on failure via throw */ }
    survivors.push(name);
    console.log(`SURVIVED ✗  ${name}`);
  } catch {
    killed++;
    console.log(`killed   ✓ ${name}`);
  }
}

const total = MUTANTS.length; // drifts count AGAINST the score — no silent skips
const rate = total ? Math.round((killed / total) * 100) : 0;
console.log(`\nmutation score: ${killed}/${total} killed (${rate}%) [killed ${killed}, survived ${survivors.length}, drifted ${drifted.length}]`);
if (survivors.length) {
  console.log("SURVIVORS (holes in the oracle — add tests for these):");
  for (const s of survivors) console.log("  -", s);
}
if (drifted.length) {
  console.log("DRIFTED (mutation anchors no longer match source — fix the anchors):");
  for (const d of drifted) console.log("  -", d);
}
rmSync(TMP, { recursive: true, force: true });
process.exit(survivors.length || drifted.length ? 1 : 0);
