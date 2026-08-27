import { Link, getLocalePath } from "@hieupth/nextstatic";
import { t, type Locale } from "../../../../lib/i18n";

export default async function I18nDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const L = locale === "vi";

  return (
    <>
      <h1>{t(locale, "docs.i18n.title")}</h1>

      <h2>{t(locale, "docs.i18n.staticFirst")}</h2>
      <p>{t(locale, "docs.i18n.staticFirstDesc")}</p>
      <pre>{`// app/[locale]/page.tsx
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}`}</pre>

      <h2>{t(locale, "docs.i18n.switching")}</h2>
      <p>{t(locale, "docs.i18n.switchingDesc")}</p>
      <pre>{`router.push(getLocaleRoute("/about", otherLocale));`}</pre>
      <p>
        <a href={getLocalePath(`/${locale}/about`, locale === "en" ? "vi" : "en")}>
          {L ? "Chuyển sang tiếng Anh (raw anchor)" : "Switch to Vietnamese (raw anchor)"}
        </a>
      </p>

      <h2>{L ? "Không cần provider" : "No provider needed"}</h2>
      <p>{t(locale, "docs.i18n.noProvider")}</p>
    </>
  );
}
