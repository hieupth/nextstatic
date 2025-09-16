"use client";

import type { AudioHTMLAttributes } from "react";
import { getPrefixPath } from "../utils/basepath";


/**
 * Process audio source URL to apply basePath.
 * - Apply prefixPath for string URLs starting with "/".
 * - Keep external URLs, data URLs, and blob URLs unchanged.
 * @param src - Audio source URL.
 * @returns Processed src with basePath applied if applicable.
 */
function withBase(src?: any): any {
  if (!src || typeof src !== "string") return src;
  if (/^(https?:\/\/|data:|blob:)/i.test(src)) return src;
  return getPrefixPath(src);
}

/**
 * Drop-in replacement for HTML5 audio element that automatically handles basePath for sub-path hosting.
 * Processes src attribute while preserving all audio functionality and controls.
 */
export default function Audio(props: AudioHTMLAttributes<HTMLAudioElement>) {
  return <audio {...props} src={withBase(props.src)} />;
}