import { Link } from "@hieupth/nextstatic";
import { t, type Locale } from "../../../lib/i18n";

export default async function LocaleAbout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <h1>{t(locale, "about.title")}</h1>
      <p>{t(locale, "about.description")}</p>
      <Link href={`/${locale}`}>← {t(locale, "nav.home")}</Link>
    </>
  );
}
