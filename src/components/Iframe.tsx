"use client";

import type { IframeHTMLAttributes } from "react";
import { getPrefixPath } from "../utils/basepath";


/**
 * Process iframe src URL to apply basePath for internal content.
 * - Apply getPrefixPath for string URLs starting with "/".
 * - Keep external URLs, data URLs, and about: URLs unchanged.
 * - Preserve cross-origin iframe sources for security.
 * @param src - Iframe source URL.
 * @returns Processed src with basePath applied if applicable.
 */
function withBase(src?: string): string | undefined {
  if (!src || typeof src !== "string") return src;
  if (/^(https?:\/\/|data:|about:|\/\/)/i.test(src)) return src;
  return getPrefixPath(src);
}

/**
 * Drop-in replacement for HTML iframe element that automatically handles basePath for sub-path hosting.
 * Processes src attribute for internal content while preserving external iframe sources.
 * Maintains all iframe security and functionality features.
 */
export default function Iframe(props: IframeHTMLAttributes<HTMLIFrameElement>) {
  return <iframe {...props} src={withBase(props.src)} />;
}