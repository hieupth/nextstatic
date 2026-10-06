"use client";

import { Link, usePathname, useLocale } from "@hieupth/nextstatic";

/**
 * Header nav with active state — dogfoods usePathname() + useLocale().
 * Home also matches the bare EN root at / (the /-is-EN-home alias).
 */
export function HeaderNav({ labels }: { labels: readonly string[] }) {
  const pathname = usePathname();
  const { locale } = useLocale();

  // trailingSlash:true gives pathnames a trailing slash — normalize before
  // comparing.
  const path = pathname.replace(/\/+$/, "") || "/";
  const hrefs = ["/", "/docs"] as const;

  return (
    <nav className="flex items-center gap-0.5 text-sm font-medium sm:gap-1">
      {hrefs.map((href, i) => {
        const route =
          href === "/"
            ? `/${locale}`
            : `/${locale}${href}`.replace(/\/{2,}/g, "/");
        // Home also matches the bare EN root at / (the /-is-EN-home alias).
        const active =
          path === route ||
          (href === "/" && path === "/") ||
          (href !== "/" && path.startsWith(`${route}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-2.5 py-1.5 transition-colors ${
              active
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
          >
            {labels[i]}
          </Link>
        );
      })}
    </nav>
  );
}
