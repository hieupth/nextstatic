import { Link, LocaleProvider, getLocalePath } from "@hieupth/nextstatic";

// Static-first i18n: locale lives in the route, so generateStaticParams
// prerenders /en/ and /vi/ as separate HTML files. The provider gets the
// locale from route params at BUILD time — every Link below carries the
// correct prefix in the frozen static HTML. No client detection, no flash
// of the default locale. Compare with the single-tree pages above, which
// rely on the provider's mount-time URL detection fallback.
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <LocaleProvider defaultLocale={locale} availableLocales={["en", "vi"]}>
      <main>
        <h1>locale-in-route ({locale})</h1>
        <p>
          This page was prerendered for <code>{locale}</code>; the links below
          are correct in the static HTML itself.
        </p>
        <ul>
          <li><Link href="/">Home (locale-prefixed)</Link></li>
          <li>
            <a href={getLocalePath("/about", locale === "en" ? "vi" : "en")}>
              Switch to {locale === "en" ? "vi" : "en"} (plain util, no client state)
            </a>
          </li>
          <li><a href={getLocalePath("/", "en")}>Single-tree home (locale-prefixed)</a></li>
        </ul>
      </main>
    </LocaleProvider>
  );
}
