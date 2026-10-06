// Server-safe UI primitives shared by every page of the demo.
import type { ReactNode } from "react";

/** h1 + optional lede — the standard page opener. */
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </header>
  );
}

/** Section container used by every content block. */
export function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      {title ? (
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {icon ? <span className="text-indigo-500">{icon}</span> : null}
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

/** Terminal-style code card; title renders as the filename strip. */
export function CodeBlock({
  title,
  code,
}: {
  title?: string;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      {title ? (
        <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-100 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-800/60">
          <span aria-hidden className="size-2.5 rounded-full bg-red-300 dark:bg-red-900" />
          <span aria-hidden className="size-2.5 rounded-full bg-amber-300 dark:bg-amber-900" />
          <span aria-hidden className="size-2.5 rounded-full bg-emerald-300 dark:bg-emerald-900" />
          <span className="ml-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">{title}</span>
        </div>
      ) : null}
      <pre className="overflow-x-auto bg-zinc-950 p-4 font-mono text-[13px] leading-relaxed text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** Inline code chip (call names, values). */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[0.85em] text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
      {children}
    </code>
  );
}

// Live-call → live-result table used on the home, hooks and utils pages.
/** Live call→result table for the demo pages (console look). */
export function Readout({
  rows,
  columns,
}: {
  rows: readonly (readonly [string, ReactNode])[];
  columns?: readonly [string, string];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        {columns ? (
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40">
              <th scope="col" className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                {columns[0]}
              </th>
              <th scope="col" className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {columns[1]}
              </th>
            </tr>
          </thead>
        ) : null}
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {rows.map(([call, value], i) => (
            <tr key={`${call}-${i}`}>
              <th scope="row" className="w-1/2 px-4 py-2 align-top text-left font-mono text-xs font-normal text-zinc-500 dark:text-zinc-400">
                {call}
              </th>
              <td className="px-4 py-2 align-top font-mono text-xs break-all text-indigo-600 dark:text-indigo-400">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Highlighted note (indigo) for contract/warning callouts. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm leading-relaxed text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
      {children}
    </div>
  );
}
