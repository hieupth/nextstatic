// Shared site chrome (header + footer) used by both root layouts — the
// pre-locale EN home at / and the [locale] tree. Server component.
import type { ReactNode } from "react";
import { Anchor, Image, Link, LocaleProvider, getBasePath } from "@hieupth/nextstatic";
import { t, type Locale } from "../lib/i18n";
import { LangSwitcher } from "./LangSwitcher";
import { HeaderNav } from "./HeaderNav";
import { ExternalLink } from "./icons";
import { Code } from "./ui";

/**
 * Shared page chrome (header + footer + provider) used by BOTH root
 * layouts — the pre-locale EN home at / and the [locale] tree.
 * persist=false keeps a stored locale from retargeting links on /.
 */
export function SiteChrome({
  locale,
  persist = true,
  children,
}: {
  locale: Locale;
  /** false = fixed-locale tree: never read/write the stored locale. */
  persist?: boolean;
  children: ReactNode;
}) {
  return (
    <LocaleProvider defaultLocale={locale} availableLocales={["en", "vi"]} persist={persist}>
      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
            {/* Link adds the locale segment — logo goes to the locale home. */}
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <Image src="/img/logo.svg" alt="nextstatic" width={28} height={28} priority />
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                nextstatic
              </span>
            </Link>
            <HeaderNav
              labels={[t(locale, "nav.home"), t(locale, "nav.docs")]}
            />
            <div className="flex shrink-0 items-center gap-2">
              <LangSwitcher />
              <Anchor
                href="https://github.com/hieupth/nextstatic"
                aria-label="GitHub"
                className="hidden size-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400 sm:inline-flex"
              >
                <ExternalLink className="size-4" />
              </Anchor>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-zinc-500 sm:px-6 dark:text-zinc-400">
            <span>{t(locale, "footer.tagline")}</span>
            <span className="flex flex-wrap items-center gap-2">
              <Code>BASE_PATH={getBasePath() || '""'}</Code>
              <span>{t(locale, "footer.deployed")}</span>
            </span>
          </div>
        </footer>
      </div>
    </LocaleProvider>
  );
}
