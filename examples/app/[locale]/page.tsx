import { Link } from "@hieupth/nextstatic";
import { t, type Locale } from "../../lib/i18n";
import { Demos } from "./demos";

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <h1>{t(locale, "home.title")}</h1>
      <p>{t(locale, "home.description")}</p>
      <nav>
        <Link href={`/${locale}/docs`}>📚 {t(locale, "nav.docs")}</Link>
        {" · "}
        <Link href={`/${locale}/about`}>{t(locale, "nav.about")}</Link>
      </nav>
      <Demos locale={locale} />
    </>
  );
}
