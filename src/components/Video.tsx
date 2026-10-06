// basePath-aware <video>. Prefixes BOTH src and poster — a poster that
// misses the prefix shows a broken frame even when the video itself plays.
"use client";

import type { ComponentProps } from "react";
import { getPrefixPath } from "../utils/basepath.js";


/**
 * Process video source URLs to apply basePath.
 * - Apply prefixPath for string URLs starting with "/".
 * - Keep external URLs, data URLs, and blob URLs unchanged.
 * @param src - Video source URL.
 * @returns Processed src with basePath applied if applicable.
 */
function withBaseSrc(src?: string): string | undefined {
  if (!src || typeof src !== "string") return src;
  if (/^(https?:\/\/|data:|blob:)/i.test(src)) return src;
  return getPrefixPath(src);
}

/**
 * Process poster image URL to apply basePath.
 * - Apply prefixPath for string URLs starting with "/".
 * - Keep external URLs, data URLs, and blob URLs unchanged.
 * @param poster - Poster image URL.
 * @returns Processed poster with basePath applied if applicable.
 */
function withBasePoster(poster?: string): string | undefined {
  if (!poster || typeof poster !== "string") return poster;
  if (/^(https?:\/\/|data:|blob:)/i.test(poster)) return poster;
  return getPrefixPath(poster);
}

/**
 * Drop-in replacement for HTML5 video element that automatically handles basePath for sub-path hosting.
 * Processes both src and poster attributes while preserving all video functionality.
 */
export default function Video(props: ComponentProps<"video">) {
  return (
    <video
      {...props}
      src={withBaseSrc(props.src)}
      poster={withBasePoster(props.poster)}
    />
  );
}