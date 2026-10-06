// basePath-aware <source> for <picture>/<video>/<audio>. Prefixes src and
// every srcSet candidate; descriptors (1x/2x/100w) survive verbatim and
// commas inside data: URIs are not mistaken for candidate separators.
"use client";

import type { ComponentProps } from "react";
import { getPrefixPath } from "../utils/basepath.js";


/**
 * Process source URL to apply basePath.
 * - Apply getPrefixPath for string URLs starting with "/".
 * - Keep external URLs, data URLs, and blob URLs unchanged.
 * - Handle both src and srcSet attributes for responsive media.
 * @param src - Source URL.
 * @returns Processed src with basePath applied if applicable.
 */
function withBase(src?: string): string | undefined {
  if (!src || typeof src !== "string") return src;
  if (/^(https?:\/\/|data:|blob:)/i.test(src)) return src;
  return getPrefixPath(src);
}

/**
 * Process srcSet attribute to apply basePath to multiple source URLs.
 * Handles responsive image srcSet format: "url1 1x, url2 2x" or "url1 100w, url2 200w".
 * A comma inside a data: URI (e.g. base64 payloads) is NOT a candidate
 * separator — candidates always end with an optional descriptor, so we only
 * split on commas followed by a new URL+descriptor shape.
 * @param srcSet - Source set string with multiple URLs and descriptors.
 * @returns Processed srcSet with basePath applied to internal URLs.
 */
function withBaseSrcSet(srcSet?: string): string | undefined {
  if (!srcSet || typeof srcSet !== "string") return srcSet;

  return srcSet
    // Split ONLY before a root-relative candidate (", /…"): commas inside
    // data: URIs and external URLs are never treated as separators.
    .split(/,(?=\s*\/)/)
    .map(src => {
      const trimmed = src.trim();
      const parts = trimmed.split(/\s+/);

      if (parts.length >= 1) {
        const url = parts[0];
        const descriptor = parts.slice(1).join(" ");

        // Process the URL part
        const processedUrl = withBase(url);

        // Reconstruct with descriptor if present
        return descriptor ? `${processedUrl} ${descriptor}` : processedUrl;
      }

      return trimmed;
    })
    .join(", ");
}

/**
 * Drop-in replacement for HTML source element that automatically handles basePath for sub-path hosting.
 * Processes both src and srcSet attributes for responsive media sources.
 * Used within video, audio, and picture elements for multiple format support.
 */
export default function Source(props: ComponentProps<"source">) {
  return (
    <source
      {...props}
      src={withBase(props.src)}
      srcSet={withBaseSrcSet(props.srcSet)}
    />
  );
}