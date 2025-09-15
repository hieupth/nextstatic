"use client";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { getPrefixPath, getPrefixUrlObject } from "../utils/basepath";


// Extend next link props.
type Props = ComponentProps<typeof NextLink>;

/**
 * Process href prop to apply basePath for internal navigation.
 * - Apply prefixPath for string hrefs starting with "/".
 * - Apply prefixUrlObject for UrlObject hrefs.
 * - Keep external URLs and anchors unchanged.
 * @param href - Link destination URL or UrlObject.
 * @returns Processed href with basePath applied if applicable.
 */
function withBase(href: Props["href"]): Props["href"] {
  if (typeof href === "string") {
    if (/^(https?:\/\/|mailto:|tel:|#)/i.test(href)) return href;
    return getPrefixPath(href);
  }
  if (typeof href === "object" && href !== null) {
    return getPrefixUrlObject(href);
  }
  return href;
}

/**
 * Drop-in replacement for `next/link` that automatically handles basePath for sub-path hosting.
 * Ensures internal navigation works correctly while preserving external links and anchors.
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} href={withBase(props.href)} />;
}