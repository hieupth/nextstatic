import { Link, getLocalePath } from "@hieupth/nextstatic";

export default function I18nDocs() {
  return (
    <>
      <h1>i18n patterns</h1>

      <h2>Static-first: locale-in-route (zero flicker)</h2>
      <p>
        With <code>app/[locale]/…</code> + <code>generateStaticParams</code>,
        each locale is prerendered as its own HTML; the provider receives the
        route param <strong>at build time</strong>, so every Link prefix is
        correct in the frozen output. This app ships <Link href="/en">/en</Link>{" "}
        and <Link href="/vi">/vi</Link> exactly this way — <code>CI path-contract gate</code>{" "}
        asserts the locale prefixes exist in the static HTML itself.
      </p>
      <pre>{`// app/[locale]/page.tsx
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}
export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <LocaleProvider defaultLocale={locale} availableLocales={["en", "vi"]}>
      …
    </LocaleProvider>
  );
}`}</pre>

      <h2>Fallback: single-tree + client detection</h2>
      <p>
        A single page tree can mount <code>LocaleProvider</code> alone; it
        detects the locale from the URL on mount (then localStorage), so the
        first paint uses <code>defaultLocale</code> until correction — a brief
        flash. Prefer locale-in-route for static hosting.
      </p>

      <h2>Switching locale</h2>
      <p>
        <code>setLocale</code> updates state + localStorage but does not
        navigate — push the localized URL yourself:
      </p>
      <pre>{`const { locale } = useLocale();
router.push(getLocaleRoute("/about", locale === "en" ? "vi" : "en"));`}</pre>
      <p>
        Plain <code>&lt;a&gt;</code> (raw surface) uses the basePath-aware
        form: <code>href={getLocalePath("/about", "vi")}</code> →{" "}
        <a href={getLocalePath("/about", "vi")}>/vi/about as raw anchor</a>.
      </p>

      <h2>No provider needed</h2>
      <p>
        <code>Link</code> works standalone: without a provider, locale is{" "}
        <code>""</code> and it prefixes basePath only — right for
        single-locale sites.
      </p>
    </>
  );
}
