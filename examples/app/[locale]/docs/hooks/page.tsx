import { t, type Locale } from "../../../../lib/i18n";
import { HooksDemo } from "./_demo";

export default async function HooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  return (
    <>
      <h1>{t(locale, "docs.hooks.title")}</h1>
      <HooksDemo locale={locale} />
    </>
  );
}
