import type { ReactNode } from "react";
import { Link } from "@hieupth/nextstatic";
import { t, type Locale } from "../../../lib/i18n";

export default async function DocsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  const NAV = [
    [`/${locale}/docs`, t(locale, "nav.docsOverview")],
    [`/${locale}/docs/setup`, t(locale, "nav.setup")],
    [`/${locale}/docs/components`, t(locale, "nav.components")],
    [`/${locale}/docs/hooks`, t(locale, "nav.hooks")],
    [`/${locale}/docs/utils`, t(locale, "nav.utils")],
    [`/${locale}/docs/i18n`, t(locale, "nav.i18n")],
  ] as const;

  return (
    <div className="docs">
      <nav className="docs-nav">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
      <div className="docs-main">{children}</div>
    </div>
  );
}
