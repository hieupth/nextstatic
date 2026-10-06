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
  // 301 hop. Locale ROOTS included ("/vi" → "/vi/"): every other internal
  // URL on the site is slash-terminated; the switcher must not be the
  // exception.
  const target = pagePath === "/" ? "/" : `${pagePath.replace(/\/+$/, "")}/`;
  // getLocalePath canonicalizes locale roots WITHOUT a trailing slash —
  // re-terminate so the raw anchor never costs a redirect hop.
  const terminate = (href: string) => {
    const i = href.search(/[?#]/);
    const base = (i === -1 ? href : href.slice(0, i)).replace(/\/+$/, "");
    const rest = i === -1 ? "" : href.slice(i);
    return `${base}/${rest}`;
  };

  return (
    <a
      href={terminate(getLocalePath(target, other))}
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
    >
      <Globe className="size-3.5" />
      {other === "en" ? "English" : "Tiếng Việt"}
    </a>
  );
}
