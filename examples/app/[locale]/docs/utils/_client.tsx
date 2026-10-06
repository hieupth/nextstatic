// Client-only utils: getCurrentLocale reads window.location (undefined at
// SSR — mounted-gated) and resetPathCache is interactive on purpose.
"use client";

import { useEffect, useState } from "react";
import { getCurrentLocale, getBasePath, resetPathCache } from "@hieupth/nextstatic";
import { Readout } from "../../../../components/ui";
import { t, type Locale } from "../../../../lib/i18n";

export function ClientUtilsDemo({ locale }: { locale: string }) {
  const loc = locale as Locale;
  const [mounted, setMounted] = useState(false);
  const [basePath, setBasePath] = useState<string | null>(null);

  // getCurrentLocale() reads window.location.pathname — undefined on the
  // server. Gate it so hydration matches.
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-4">
      <Readout
        columns={[t(loc, "demos.call"), t(loc, "demos.result")]}
        rows={[
          [
            "getCurrentLocale()",
            mounted ? String(getCurrentLocale()) : t(loc, "demos.mounted"),
          ],
          ...(basePath !== null ? [["resetPathCache()", basePath] as const] : []),
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            resetPathCache();
            setBasePath(getBasePath() || '""');
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {t(loc, "docs.utils.resetCache")}
        </button>
        {basePath !== null ? (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {t(loc, "docs.utils.cacheCleared")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
