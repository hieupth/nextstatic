"use client";

import {
  useAssetPath,
  useAsset,
  useAssets,
  useRouter,
  usePathname,
  useLocale,
} from "@hieupth/nextstatic";

export function HooksDemo({ locale }: { locale: string }) {
  const { basePath, getPath, getCssUrl } = useAssetPath();
  const logo = useAsset("/img/logo.svg");
  const [hero] = useAssets(["/img/pattern.svg"]);
  const router = useRouter();
  const pathname = usePathname();
  const { locale: ctxLocale } = useLocale();
  const L = locale === "vi";

  return (
    <>
      <h2>useAssetPath()</h2>
      <p>{L ? "Trả về object chứa các hàm xử lý đường dẫn:" : "Returns an object of path helpers:"}</p>
      <table>
        <tbody>
          <tr><td>basePath</td><td><code>{basePath}</code></td></tr>
          <tr><td>getPath(&quot;/img/logo.svg&quot;)</td><td><code>{getPath("/img/logo.svg")}</code></td></tr>
          <tr><td>getCssUrl(&quot;/img/pattern.svg&quot;)</td><td><code>{getCssUrl("/img/pattern.svg")}</code></td></tr>
        </tbody>
      </table>

      <h2>useAsset / useAssets</h2>
      <table>
        <tbody>
          <tr><td>useAsset(&quot;/img/logo.svg&quot;)</td><td><code>{logo}</code></td></tr>
          <tr><td>useAssets([...])</td><td><code>{hero}</code></td></tr>
        </tbody>
      </table>

      <h2>useRouter / usePathname</h2>
      <table>
        <tbody>
          <tr><td>usePathname()</td><td><code>{pathname}</code></td></tr>
        </tbody>
      </table>
      <button onClick={() => router.push(`/${locale}/about`)}>
        router.push("/{locale}/about")
      </button>

      <h2>useLocale / LocaleProvider</h2>
      <table>
        <tbody>
          <tr><td>locale (context)</td><td><code>{ctxLocale}</code></td></tr>
        </tbody>
      </table>
    </>
  );
}
