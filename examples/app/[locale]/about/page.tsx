import { Link, LocaleProvider } from "@hieupth/nextstatic";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

export default async function LocaleAbout({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <LocaleProvider defaultLocale={locale} availableLocales={["en", "vi"]}>
      <main>
        <h1>About ({locale})</h1>
        <Link href="/">← Home</Link>
      </main>
    </LocaleProvider>
  );
}
