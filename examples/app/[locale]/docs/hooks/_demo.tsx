// Client demo for the hooks page ("use client"): live readouts + the
// router.push button. resolvePath is mounted-gated (server renders a
// relative path, the client an absolute URL — hydration must match).
"use client";

import { useEffect, useState } from "react";
import {
  Link,
  useAssetPath,
  useAsset,
  useAssets,
  useRouter,
  usePathname,
  useLocale,
} from "@hieupth/nextstatic";
import { Callout, Card, Readout } from "../../../../components/ui";
import { t, type Locale } from "../../../../lib/i18n";

export function HooksDemo({ locale }: { locale: string }) {
  const loc = locale as Locale;
  const {
    basePath,
    getPath,
    getPaths,
    getCssUrl,
    isExternal,
    getConditionalPath,
    resolvePath,
  } = useAssetPath();
  const logo = useAsset("/img/logo.svg");
  const [patternPath, logoPath] = useAssets(["/img/pattern.svg", "/img/logo.svg"]);
  const router = useRouter();
  const pathname = usePathname();
  const { locale: ctxLocale, availableLocales } = useLocale();

  // resolvePath() is origin-absolute on the client but relative on the
  // server — gate it so hydration matches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cols = [t(loc, "demos.call"), t(loc, "demos.result")] as const;

  return (
    <div className="flex flex-col gap-6">
      <Card title="useAssetPath()">
        <Readout
          columns={cols}
          rows={[
            ["basePath", basePath || '""'],
            ['getPath("/img/logo.svg")', getPath("/img/logo.svg")],
            [
              'getPaths(["/img/pattern.svg", "/img/logo.svg"])',
              JSON.stringify(getPaths(["/img/pattern.svg", "/img/logo.svg"])),
            ],
            ['getCssUrl("/img/pattern.svg")', getCssUrl("/img/pattern.svg")],
            ['isExternal("/img/logo.svg")', String(isExternal("/img/logo.svg"))],
            [
              'isExternal("https://example.com/x.png")',
              String(isExternal("https://example.com/x.png")),
            ],
            [
              'getConditionalPath("/img/logo.svg", true)',
              getConditionalPath("/img/logo.svg", true),
            ],
            [
              'getConditionalPath("/img/logo.svg", false)',
              getConditionalPath("/img/logo.svg", false),
            ],
            [
              'resolvePath("/embed.html")',
              mounted ? resolvePath("/embed.html") : t(loc, "demos.mounted"),
            ],
          ]}
        />
      </Card>

      <Card title="useAsset / useAssets">
        <Readout
          columns={cols}
          rows={[
            ['useAsset("/img/logo.svg")', logo],
            [
              'useAssets(["/img/pattern.svg", "/img/logo.svg"])',
              JSON.stringify([patternPath, logoPath]),
            ],
          ]}
        />
      </Card>

      <Card title="useRouter / usePathname">
        <Readout columns={cols} rows={[["usePathname()", pathname]]} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/about")}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-mono text-sm text-white transition-colors hover:bg-indigo-500"
          >
            router.push("/about")
          </button>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {t(loc, "docs.hooks.pushNote")}
          </span>
        </div>
      </Card>

      <Card title="useLocale / LocaleProvider">
        <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t(loc, "docs.hooks.locale")}
        </p>
        <Readout
          columns={cols}
          rows={[
            ["locale", ctxLocale],
            ["availableLocales", availableLocales.join(", ")],
          ]}
        />
        <div className="mt-4">
          <Callout>
            <span>
              {t(loc, "docs.hooks.setLocaleNote")}{" "}
              <Link
                href="/docs/i18n"
                className="font-medium underline underline-offset-2"
              >
                {t(loc, "nav.i18n")}
              </Link>
            </span>
          </Callout>
        </div>
      </Card>
    </div>
  );
}
