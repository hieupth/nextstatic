"use client";

// Docs sidebar with active state — dogfoods the lib's usePathname() and
// useLocale(). Items carry locale-free hrefs: Link prepends the locale.
import { Link, usePathname, useLocale } from "@hieupth/nextstatic";
import { t, type Locale } from "../lib/i18n";

/**
 * Docs sidebar with active state — dogfoods usePathname() and useLocale().
 * Items carry locale-free hrefs: Link prepends the locale segment.
 */
export function DocsNav({
  items,
}: {
  items: readonly (readonly [href: string, label: string])[];
}) {
  const pathname = usePathname();
  const { locale } = useLocale();

  // trailingSlash:true gives pathnames a trailing slash — normalize before
  // comparing.
  const path = pathname.replace(/\/+$/, "") || "/";

  return (
    <nav
      aria-label={t(locale as Locale, "nav.docs")}
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {items.map(([href, label]) => {
        // Rebuild the locale-aware route the same way Link does.
        const route = `/${locale}${href === "/" ? "" : href}`.replace(/\/{2,}/g, "/");
        // Sub-pages (deeper than the docs root) highlight on prefix.
        const isSubpage = href.split("/").length > 2;
        const active =
          route === path || (isSubpage && path.startsWith(`${route}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
