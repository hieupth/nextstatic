"use client";

import {
  useAssetPath,
  useAsset,
  useAssets,
  useRouter,
  usePathname,
  LocaleProvider,
  useLocale,
  getPrefixPath,
  getBasePath,
} from "@hieupth/nextstatic";

function HookReadouts() {
  const { basePath, getPath, getCssUrl } = useAssetPath();
  const logo = useAsset("/img/logo.svg");
  const [hero, pattern] = useAssets(["/img/pattern.svg", "/img/logo.svg"]);
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();

  return (
    <ul>
      <li><code>useAssetPath().basePath</code> → <code>{basePath}</code></li>
      <li><code>useAssetPath().getPath(&quot;/img/logo.svg&quot;)</code> → <code>{getPath("/img/logo.svg")}</code></li>
      <li><code>useAssetPath().getCssUrl(&quot;/img/pattern.svg&quot;)</code> → <code>{getCssUrl("/img/pattern.svg")}</code></li>
      <li><code>useAsset(&quot;/img/logo.svg&quot;)</code> → <code>{logo}</code></li>
      <li><code>useAssets([...])</code> → <code>{hero}</code>, <code>{pattern}</code></li>
      <li><code>usePathname()</code> → <code>{pathname}</code></li>
      <li><code>getPrefixPath(&quot;/about&quot;)</code> → <code>{getPrefixPath("/about")}</code></li>
      <li><code>getBasePath()</code> → <code>{getBasePath()}</code></li>
      <li>
        locale: <code>{locale}</code>{" "}
        <button onClick={() => setLocale(locale === "en" ? "vi" : "en")}>switch</button>{" "}
        <button onClick={() => router.push("/about")}>router.push(/about)</button>
      </li>
    </ul>
  );
}

export function Demos() {
  return (
    <LocaleProvider defaultLocale="en" availableLocales={["en", "vi"]}>
      <section>
        <h2>Hooks &amp; utils</h2>
        <HookReadouts />
      </section>
    </LocaleProvider>
  );
}
