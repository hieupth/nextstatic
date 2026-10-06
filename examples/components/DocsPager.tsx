"use client";

// Prev/Next pager for the docs reading order — dogfoods usePathname() +
// useLocale(). Hidden on the docs overview (not part of the sequence).
import { Link, usePathname, useLocale } from "@hieupth/nextstatic";
import { t, type Locale } from "../lib/i18n";
import { ArrowRight } from "./icons";

/**
 * Prev/Next pager over the docs reading order. Returns null on the
 * overview (it is the index, not a step in the sequence).
 */
export function DocsPager({
  items,
}: {
  items: readonly (readonly [href: string, label: string])[];
}) {
  const pathname = usePathname();
  const { locale } = useLocale();

  // trailingSlash:true gives pathnames a trailing slash — normalize before
  // exact matching.
  const path = pathname.replace(/\/+$/, "") || "/";
  const idx = items.findIndex(
    ([href]) => `/${locale}${href}`.replace(/\/{2,}/g, "/") === path
  );
  if (idx === -1) return null;

  const prev = idx > 0 ? items[idx - 1] : null;
  const next = idx < items.length - 1 ? items[idx + 1] : null;

  const cls =
    "inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400";

  return (
    <nav
      aria-label={t(locale as Locale, "nav.pagination")}
      className="mt-12 flex items-center justify-between gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800"
    >
      {prev ? (
        <Link href={prev[0]} className={cls}>
          <ArrowRight className="size-4 rotate-180" />
          {prev[1]}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next[0]} className={cls}>
          {next[1]}
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
