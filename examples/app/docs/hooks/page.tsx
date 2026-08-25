"use client";

import {
  useAssetPath,
  useAsset,
  useAssets,
  useRouter,
  usePathname,
  LocaleProvider,
  useLocale,
} from "@hieupth/nextstatic";

function Readouts() {
  const { basePath, getPath, getCssUrl, isExternal } = useAssetPath();
  const logo = useAsset("/img/logo.svg");
  const [hero, pattern] = useAssets(["/img/pattern.svg", "/img/logo.svg"]);
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();

  return (
    <>
      <h2>useAssetPath()</h2>
      <p>Returns an object of path helpers (no arguments):</p>
      <table>
        <tbody>
          <tr><td><code>basePath</code></td><td><code>{basePath || '""'}</code></td></tr>
          <tr><td><code>getPath(&quot;/img/logo.svg&quot;)</code></td><td><code>{getPath("/img/logo.svg")}</code></td></tr>
          <tr><td><code>getCssUrl(&quot;/img/pattern.svg&quot;)</code></td><td><code>{getCssUrl("/img/pattern.svg")}</code></td></tr>
          <tr><td><code>isExternal(&quot;https://x.dev&quot;)</code></td><td><code>{String(isExternal("https://x.dev"))}</code></td></tr>
        </tbody>
      </table>

      <h2>useAsset / useAssets</h2>
      <table>
        <tbody>
          <tr><td><code>useAsset(&quot;/img/logo.svg&quot;)</code></td><td><code>{logo}</code></td></tr>
          <tr><td><code>useAssets([pattern, logo])</code></td><td><code>{hero}</code>, <code>{pattern}</code></td></tr>
        </tbody>
      </table>

      <h2>useRouter / usePathname</h2>
      <p>
        basePath-aware navigation — push/replace/prefetch add the locale
        segment; Next adds basePath.
      </p>
      <table>
        <tbody>
          <tr><td><code>usePathname()</code></td><td><code>{pathname}</code></td></tr>
        </tbody>
      </table>
      <button onClick={() => router.push("/about")}>router.push(&quot;/about&quot;)</button>

      <h2>useLocale / LocaleProvider</h2>
      <p>
        This section is wrapped in a provider. Outside one, <code>useLocale</code>
        returns a safe default (locale <code>""</code>) — <code>Link</code> then
        prefixes basePath only.
      </p>
      <table>
        <tbody>
          <tr><td><code>locale</code></td><td><code>{locale || '""'}</code></td></tr>
        </tbody>
      </table>
      <button onClick={() => setLocale(locale === "en" ? "vi" : "en")}>
        setLocale → {locale === "en" ? "vi" : "en"}
      </button>
    </>
  );
}

export default function HooksDocs() {
  return (
    <LocaleProvider defaultLocale="en" availableLocales={["en", "vi"]}>
      <h1>Hooks — live</h1>
      <Readouts />
    </LocaleProvider>
  );
}
