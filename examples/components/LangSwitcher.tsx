"use client";

// Locale switcher that PRESERVES the current page: it reads the locale
// segment straight off the pathname (dogfooding parseLocaleFromPath) and
// rebuilds the same page under the other locale via getLocalePath.
import { getLocalePath, parseLocaleFromPath, usePathname } from "@hieupth/nextstatic";
import { locales } from "../lib/i18n";
import { Globe } from "./icons";

/**
 * Locale switcher that PRESERVES the current page: reads the locale off
 * the pathname (dogfooding parseLocaleFromPath) and rebuilds the same
 * page under the other locale via getLocalePath — trailing-slash
 * terminated to avoid a redirect hop.
 */
export function LangSwitcher() {
  const pathname = usePathname();
  const { locale: urlLocale, path: pagePath } = parseLocaleFromPath(pathname, [...locales]);
  const other = urlLocale === "vi" ? "en" : "vi";
  // trailingSlash:true — keep the raw anchor slash-terminated to avoid a
  // 301 hop.
  const target = pagePath === "/" ? "/" : `${pagePath}/`;

  return (
    <a
      href={getLocalePath(target, other)}
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
    >
      <Globe className="size-3.5" />
      {other === "en" ? "English" : "Tiếng Việt"}
    </a>
  );
}
