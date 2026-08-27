"use client";

import {
  useAssetPath,
  useAsset,
  useAssets,
  useRouter,
  usePathname,
  useLocale,
} from "@hieupth/nextstatic";

export function Demos({ locale }: { locale: string }) {
  const { basePath, getPath, getCssUrl, isExternal } = useAssetPath();
  const logo = useAsset("/img/logo.svg");
  const [hero, pattern] = useAssets(["/img/pattern.svg", "/img/logo.svg"]);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section>
      <h2>{locale === "vi" ? "Hook & tiện ích — trực tiếp" : "Hooks & utils — live"}</h2>
      <table>
        <tbody>
          <tr><td>basePath</td><td><code>{basePath}</code></td></tr>
          <tr><td>getPath(&quot;/img/logo.svg&quot;)</td><td><code>{getPath("/img/logo.svg")}</code></td></tr>
          <tr><td>getCssUrl(&quot;/img/pattern.svg&quot;)</td><td><code>{getCssUrl("/img/pattern.svg")}</code></td></tr>
          <tr><td>useAsset(&quot;/img/logo.svg&quot;)</td><td><code>{logo}</code></td></tr>
          <tr><td>usePathname()</td><td><code>{pathname}</code></td></tr>
          <tr><td>locale</td><td><code>{locale}</code></td></tr>
        </tbody>
      </table>
    </section>
  );
}
