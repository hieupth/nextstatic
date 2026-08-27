import { Link } from "@hieupth/nextstatic";
import { t, type Locale } from "../../../lib/i18n";

export default async function DocsOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <h1>{t(locale, "docs.overview.title")}</h1>
      <p>{t(locale, "docs.overview.intro")}</p>
      <ul>
        <li><Link href={`/${locale}/docs/setup`}>{t(locale, "docs.overview.setupLink")}</Link></li>
        <li><Link href={`/${locale}/docs/components`}>{t(locale, "docs.overview.componentsLink")}</Link></li>
        <li><Link href={`/${locale}/docs/hooks`}>{t(locale, "docs.overview.hooksLink")}</Link></li>
        <li><Link href={`/${locale}/docs/utils`}>{t(locale, "docs.overview.utilsLink")}</Link></li>
        <li><Link href={`/${locale}/docs/i18n`}>{t(locale, "docs.overview.i18nLink")}</Link></li>
      </ul>
    </>
  );
}
