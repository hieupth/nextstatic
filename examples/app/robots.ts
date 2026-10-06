// robots.txt — allows all crawlers and points at the sitemap.

import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteUrl("/sitemap.xml"),
  };
}
