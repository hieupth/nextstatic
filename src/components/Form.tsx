// basePath-aware <form>. Prefixes the action URL — without it a sub-directory
// deployment submits to a 404 at the domain root.
"use client";

import type { ComponentProps } from "react";
import { getPrefixPath } from "../utils/basepath.js";


/**
 * Process form action URL to apply basePath for internal endpoints.
 * - Apply getPrefixPath for string URLs starting with "/".
 * - Keep external URLs, mailto:, and other protocols unchanged.
 * - Preserve absolute URLs for external form handlers.
 * @param action - Form action URL.
 * @returns Processed action with basePath applied if applicable.
 */
function withBase(
  action: ComponentProps<"form">["action"]
): ComponentProps<"form">["action"] {
  if (!action || typeof action !== "string") return action;
  if (/^(https?:\/\/|mailto:|tel:|\/\/)/i.test(action)) return action;
  return getPrefixPath(action);
}

/**
 * Drop-in replacement for HTML form element that automatically handles basePath for sub-path hosting.
 * Processes action attribute for internal API endpoints while preserving external form handlers.
 * Maintains all form functionality including methods, encoding, and validation.
 */
export default function Form(props: ComponentProps<"form">) {
  return <form {...props} action={withBase(props.action)} />;
}