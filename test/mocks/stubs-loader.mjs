// resolve-hook: map next/* bare specifiers to data: URL stub modules —
// node loads data: URLs natively, so no load hook is needed.
const enc = (src) => `data:text/javascript;base64,${Buffer.from(src, "utf8").toString("base64")}`;

const STUBS = {
  "next/link": `
const { createElement } = globalThis.React;
export default function Link(props) {
  const { href, prefetch, replace, scroll, shallow, passHref, locale, ...rest } = props;
  return createElement("a", { ...rest, href: typeof href === "object" ? href.pathname : href });
}
`,
  "next/image": `
const { createElement } = globalThis.React;
export default function Image(props) {
  const { src, alt, width, height, priority, placeholder, loader, fill, ...rest } = props;
  return createElement("img", { src: typeof src === "object" ? (src.src ?? JSON.stringify(src)) : src, alt, width, height, ...rest });
}
`,
  "next/script": `
const { createElement } = globalThis.React;
export default function Script(props) {
  const { src, strategy, onReady, onError, ...rest } = props;
  return createElement("script", { ...rest, src });
}
`,
  "next/navigation": `
export function useRouter() {
  return {
    push: (href) => { globalThis.__pushed = String(href); },
    replace: (href) => {},
    prefetch: (href) => {},
  };
}
export function usePathname() {
  return globalThis.__pathname ?? "/en/mock";
}
`,
};

export async function resolve(specifier, context, nextResolve) {
  if (STUBS[specifier]) {
    return { url: enc(STUBS[specifier]), shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
