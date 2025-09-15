"use client";
import NextImage from "next/image";
import type { ComponentProps } from "react";
import { getPrefixPath } from "../utils/basepath";


/**
 * Prefix basePath for string src starting with "/".
 * - Keep StaticImport (import logo from "@/public/logo.svg") unchanged for Next.js optimization.
 * - Keep absolute URLs (http/https) unchanged.
 * - Keep data URLs and blob URLs unchanged.
 * @param src - Image source URL or StaticImport.
 * @returns Processed source with basePath applied if applicable.
 */
function withBase(src: string | any): string {
  if (typeof src !== "string") return src;
  if (/^(https?:\/\/|data:|blob:)/i.test(src)) return src;
  return getPrefixPath(src);
}

/**
 * Drop-in replacement for `next/image` that automatically handles basePath for sub-path hosting.
 * Preserves all Next.js Image optimization features while ensuring correct path resolution.
 */
export default function Image(props: ComponentProps<typeof NextImage>) {
  return <NextImage {...props} src={withBase(props.src)} />;
}