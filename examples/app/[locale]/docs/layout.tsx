// Docs shell: sidebar (DocsNav) + reading-order pager (DocsPager). Nav
// items are locale-free hrefs — Link prepends the locale segment.

import type { ReactNode } from "react";
import { t, type Locale } from "../../../lib/i18n";
import { DocsNav } from "../../../components/DocsNav";
import { DocsPager } from "../../../components/DocsPager";

export default async function DocsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  // Reading order: setup first, then the locale pattern the whole site
  // uses, then the API reference.
  const NAV = [
    ["/docs", t(locale, "nav.docs")],
    ["/docs/setup", t(locale, "nav.setup")],
    ["/docs/i18n", t(locale, "nav.i18n")],
    ["/docs/components", t(locale, "nav.components")],
    ["/docs/hooks", t(locale, "nav.hooks")],
    ["/docs/utils", t(locale, "nav.utils")],
  ] as const;

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside>
        <DocsNav items={NAV} />
      </aside>
      <div className="docs-body min-w-0">
        {children}
        <DocsPager items={NAV.slice(1)} />
      </div>
    </div>
  );
}
