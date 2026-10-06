// basePath-aware <audio>. Prefixes internal src; streaming URLs untouched.
"use client";

import type { ComponentProps } from "react";
import { getPrefixPath } from "../utils/basepath.js";


/**
 * Process audio source URL to apply basePath.
 * - Apply prefixPath for string URLs starting with "/".
 * - Keep external URLs, data URLs, and blob URLs unchanged.
 * @param src - Audio source URL.
 * @returns Processed src with basePath applied if applicable.
 */
function withBase(src?: string): string | undefined {
  if (!src || typeof src !== "string") return src;
  if (/^(https?:\/\/|data:|blob:)/i.test(src)) return src;
  return getPrefixPath(src);
}

/**
 * Drop-in replacement for HTML5 audio element that automatically handles basePath for sub-path hosting.
 * Processes src attribute while preserving all audio functionality and controls.
 */
export default function Audio(props: ComponentProps<"audio">) {
  return <audio {...props} src={withBase(props.src)} />;
}