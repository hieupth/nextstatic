// Shared home page — rendered at / (English, pre-locale) and /[locale].
import { Image, Link } from "@hieupth/nextstatic";
import { t, type Locale } from "../lib/i18n";
import { Demos } from "./demos";
import { Card } from "../components/ui";
import { ArrowRight, Terminal } from "../components/icons";

export function Home({ locale }: { locale: Locale }) {
  const FEATURES = [
    ["home.feature1.title", "home.feature1.desc"],
    ["home.feature2.title", "home.feature2.desc"],
    ["home.feature3.title", "home.feature3.desc"],
  ] as const;

  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-64 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-16 size-72 rounded-full bg-indigo-400/25 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-5">
          <Image
            src="/img/logo.svg"
            alt="nextstatic logo"
            width={64}
            height={64}
            className="rounded-2xl shadow-lg"
            priority
          />
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            {t(locale, "home.title")}
          </h1>
          <p className="max-w-2xl text-base/relaxed text-indigo-100 sm:text-lg">
            {t(locale, "home.description")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
            >
              {t(locale, "home.ctaDocs")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs/components"
              className="inline-flex items-center rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t(locale, "home.ctaComponents")}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map(([titleKey, descKey]) => (
          <Card key={titleKey}>
            <h2 className="mb-1.5 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {t(locale, titleKey)}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t(locale, descKey)}
            </p>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          <Terminal className="size-5 text-indigo-500" />
          {t(locale, "home.hooksDemo")}
        </h2>
        <Demos locale={locale} />
      </section>
    </div>
  );
}
