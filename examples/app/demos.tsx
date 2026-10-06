// Home teaser readout — the FULL hook surface lives on the Hooks page; this
// shows the handful of rows that sell the idea plus a link onward.
"use client";

import { useEffect, useState } from "react";
import { Link, useAssetPath, useAsset, usePathname, useLocale } from "@hieupth/nextstatic";
import { Readout } from "../components/ui";
import { ArrowRight } from "../components/icons";
import { t, type Locale } from "../lib/i18n";

export function Demos({ locale }: { locale: string }) {
  const loc = locale as Locale;
  const { basePath, getPath, resolvePath } = useAssetPath();
  const logo = useAsset("/img/logo.svg");
  const pathname = usePathname();
  const { locale: ctxLocale } = useLocale();

  // resolvePath() is origin-absolute on the client but relative on the
  // server — gate it behind mounted so hydration matches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const rows: readonly (readonly [string, string])[] = [
    ["basePath", basePath || '""'],
    ['getPath("/img/logo.svg")', getPath("/img/logo.svg")],
    ['useAsset("/img/logo.svg")', logo],
    ['resolvePath("/embed.html")', mounted ? resolvePath("/embed.html") : t(loc, "demos.mounted")],
    ["usePathname()", pathname],
    ["useLocale()", ctxLocale],
  ];

  return (
    <div className="flex flex-col gap-3">
      <Readout
        rows={rows}
        columns={[t(loc, "demos.call"), t(loc, "demos.result")]}
      />
      <Link
        href="/docs/hooks"
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        {t(loc, "home.readoutMore")}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
