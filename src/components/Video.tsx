"use client";

import type { VideoHTMLAttributes } from "react";
import { getPrefixPath } from "../utils/basepath";


/**
 * Process video source URLs to apply basePath.
 * - Apply prefixPath for string URLs starting with "/".
 * - Keep external URLs, data URLs, and blob URLs unchanged.
 * @param src - Video source URL.
 * @returns Processed src with basePath applied if applicable.
 */
function withBaseSrc(src?: any): any {
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
export default function Video(props: VideoHTMLAttributes<HTMLVideoElement>) {
  return (
    <video
      {...props}
      src={withBaseSrc(props.src)}
      poster={withBasePoster(props.poster)}
    />
  );
}