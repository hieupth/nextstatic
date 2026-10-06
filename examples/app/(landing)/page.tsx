// The / route: renders the shared EN home. /en/ is the canonical URL —
// this alias exists so the root serves content instead of a language gate.

import type { Metadata } from "next";
import { Home } from "../home";
import { siteUrl } from "../../lib/site";

// / is the English home — the same content as /en/, no language gate.
// /en/ is the canonical URL for this content (absolute, basePath included).
export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl("/en/"),
    languages: { en: siteUrl("/en/"), vi: siteUrl("/vi/") },
  },
};

export default function LandingHome() {
  return <Home locale="en" />;
}
