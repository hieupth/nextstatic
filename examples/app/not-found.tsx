// Root not-found renders WITHOUT any layout (multi-root structure), so it
// carries its own <html>/<head>/<body> and stylesheet — this is what
// becomes the static 404.html hosts serve for unknown URLs.

import { getPrefixPath } from "@hieupth/nextstatic";
import "./globals.css";

export default function NotFound() {
  const link =
    "inline-flex items-center rounded-lg border border-zinc-300 px-3.5 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400";

  return (
    <html lang="en">
      <head>
        <title>404 — nextstatic</title>
      </head>
      <body className="grid min-h-dvh place-items-center bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex flex-col items-center px-4 py-16 text-center">
          <p className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">404</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            Page not found · Không tìm thấy trang
          </h1>
          <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            This page does not exist under the current basePath. · Trang không
            tồn tại dưới basePath hiện tại.
          </p>
          <div className="mt-6 flex gap-2">
            {/* Raw <a> via getPrefixPath — no LocaleProvider is mounted here. */}
            <a href={getPrefixPath("/en/")} className={link}>Home</a>
            <a href={getPrefixPath("/en/docs/")} className={link}>Docs</a>
            <a href={getPrefixPath("/vi/")} className={link}>Tiếng Việt</a>
          </div>
        </div>
      </body>
    </html>
  );
}
