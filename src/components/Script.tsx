"use client";
import NextScript from "next/script";
import type { ComponentProps } from "react";
import { getPrefixPath } from "../utils/basepath";


/**
 * Process src prop to apply basePath for script loading.
 * - Apply prefixPath for string src starting with "/".
 * - Keep external URLs and inline scripts unchanged.
 * @param src - Script source URL.
 * @returns Processed src with basePath applied if applicable.
 */
function withBase(src?: string): string | undefined {
  if (!src || typeof src !== "string") return src;
  if (/^https?:\/\//i.test(src)) return src;
  return getPrefixPath(src);
}

/**
 * Drop-in replacement for `next/script` that automatically handles basePath for sub-path hosting.
 * Ensures script resources load correctly from the proper base path while preserving external scripts.
 */
export default function Script(props: ComponentProps<typeof NextScript>) {
  return <NextScript {...props} src={withBase(props.src)} />;
}