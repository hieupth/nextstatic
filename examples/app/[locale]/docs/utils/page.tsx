import {
  getBasePath,
  getPrefixPath,
  getPrefixCssUrl,
  getLocalePath,
  getLocaleRoute,
  parseLocaleFromPath,
} from "@hieupth/nextstatic";
import { t, type Locale } from "../../../../lib/i18n";

export default async function UtilsDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <h1>{t(locale, "docs.utils.title")}</h1>
      <p>{t(locale, "docs.utils.intro")}</p>
      <table>
        <thead><tr><th>{locale === "vi" ? "Gọi" : "Call"}</th><th>{locale === "vi" ? "Kết quả" : "Result"}</th></tr></thead>
        <tbody>
          <tr><td><code>getBasePath()</code></td><td><code>{getBasePath() || '""'}</code></td></tr>
          <tr><td><code>getPrefixPath(&quot;/docs&quot;)</code></td><td><code>{getPrefixPath("/docs")}</code></td></tr>
          <tr><td><code>getPrefixCssUrl(&quot;img/a.png&quot;)</code></td><td><code>{getPrefixCssUrl("img/a.png")}</code></td></tr>
          <tr><td><code>getLocalePath(&quot;/about&quot;, &quot;vi&quot;)</code></td><td><code>{getLocalePath("/about", "vi")}</code></td></tr>
          <tr><td><code>getLocaleRoute(&quot;/about&quot;, &quot;vi&quot;)</code></td><td><code>{getLocaleRoute("/about", "vi")}</code></td></tr>
          <tr><td><code>parseLocaleFromPath(...)</code></td><td><code>{JSON.stringify(parseLocaleFromPath("/demo/vi/about"))}</code></td></tr>
        </tbody>
      </table>

      <h2>{t(locale, "docs.utils.contract")}</h2>
      <ul>
        <li>{t(locale, "docs.utils.nextPrimitives")}</li>
        <li>{t(locale, "docs.utils.rawSurfaces")}</li>
      </ul>
    </>
  );
}
