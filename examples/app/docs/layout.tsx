import type { ReactNode } from "react";
import { Link } from "@hieupth/nextstatic";
import "../globals.css";

const NAV = [
  ["/docs", "Overview"],
  ["/docs/setup", "Setup"],
  ["/docs/components", "Components"],
  ["/docs/hooks", "Hooks"],
  ["/docs/utils", "Utils"],
  ["/docs/i18n", "i18n patterns"],
] as const;

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="docs">
      <nav className="docs-nav">
        <Link href="/">← example home</Link>
        {NAV.map(([href, label]) => (
          <Link key={href} href={href}>{label}</Link>
        ))}
      </nav>
      <main className="docs-main">{children}</main>
    </div>
  );
}
