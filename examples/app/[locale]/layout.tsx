import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link, LocaleProvider } from "@hieupth/nextstatic";
import { locales, isLocale, t, type Locale } from "../../lib/i18n";
import { LangSwitcher } from "../../components/LangSwitcher";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: `nextstatic — ${locale === "vi" ? "Tài liệu" : "Docs"}` };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <LocaleProvider defaultLocale={locale} availableLocales={["en", "vi"]}>
      <header className="site-header">
        <Link href="/">←</Link>
        <nav>
          <Link href={`/${locale}/about`}>{t(locale, "nav.about")}</Link>
          <Link href={`/${locale}/docs`}>{t(locale, "nav.docs")}</Link>
        </nav>
        <LangSwitcher locale={locale} />
      </header>
      <main>{children}</main>
    </LocaleProvider>
  );
}
