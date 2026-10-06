// Root layout for the pre-locale group: / IS the English home (same content
// as /en/), so it carries the full site chrome with a fixed "en" locale and
// persist={false} (a stored locale must never retarget its links).

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteChrome } from "../../components/SiteChrome";
import { SITE_URL, sitePath, siteUrl } from "../../lib/site";
import "../globals.css";

const DESCRIPTION =
  "The path & asset layer for Next.js static exports — one BASE_PATH feeds " +
  "both Next and the lib; every link, image and CSS url carries the prefix.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "nextstatic", template: "%s — nextstatic" },
  description: DESCRIPTION,
  icons: { icon: [{ url: sitePath("/img/logo.svg"), type: "image/svg+xml" }] },
  openGraph: {
    type: "website",
    siteName: "nextstatic",
    title: "nextstatic",
    description: DESCRIPTION,
    url: siteUrl("/en/"),
  },
  twitter: { card: "summary" },
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <SiteChrome locale="en" persist={false}>{children}</SiteChrome>
      </body>
    </html>
  );
}
