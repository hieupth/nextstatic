// sitemap.xml — every page × every locale with hreflang alternates, all
// absolute under SITE_URL + basePath so they survive sub-directory hosting.

import type { MetadataRoute } from "next";
import { locales } from "../lib/i18n";
import { siteUrl } from "../lib/site";
export const dynamic = "force-static";

const PAGES = ["", "/about", "/docs", "/docs/setup", "/docs/i18n", "/docs/components", "/docs/hooks", "/docs/utils"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    PAGES.map((page) => ({
      url: siteUrl(`/${locale}${page === "" ? "/" : `${page}/`}`),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, siteUrl(`/${l}${page === "" ? "/" : `${page}/`}`)])
        ),
      },
    }))
  );
}
