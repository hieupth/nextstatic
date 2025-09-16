"use client";

import type { AnchorHTMLAttributes } from "react";
import { getPrefixPath } from "../utils/basepath";


/**
 * Process href prop to apply basePath for internal navigation.
 * - Apply prefixPath for string hrefs starting with "/".
 * - Keep external URLs, anchors, and special protocols unchanged.
 * @param href - Anchor destination URL.
 * @returns Processed href with basePath applied if applicable.
 */
function withBase(href?: string): string | undefined {
  if (!href || typeof href !== "string") return href;
  if (/^(https?:\/\/|mailto:|tel:|#|\/\/)/i.test(href)) return href;
  return getPrefixPath(href);
}

/**
 * Drop-in replacement for HTML anchor tag that automatically handles basePath for sub-path hosting.
 * Ensures internal navigation works correctly while preserving external links and special protocols.
 */
export default function Anchor(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} href={withBase(props.href)} />;
}