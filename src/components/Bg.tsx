// Background-image div: applies basePath to a backgroundImage prop or
// url() values inside style.background/backgroundImage — the CSS-in-JS case
// that Tailwind classes and plain CSS files cannot reach.
"use client";

import type { ComponentProps, CSSProperties } from "react";
import { getPrefixCssUrl } from "../utils/basepath.js";

type Props = ComponentProps<"div"> & {
  /**
   * Background image URL or CSS background property value.
   * Can be a simple URL string or full CSS background value.
   */
  backgroundImage?: string;
  /**
   * Custom CSS properties. backgroundImage in style will be processed for basePath.
   */
  style?: CSSProperties;
};

/**
 * Process background image URL to apply basePath.
 * Handles both simple URLs and CSS url() syntax.
 * @param bg - Background image value.
 * @returns Processed background value with basePath applied if applicable.
 */
function withBase(bg?: string): string | undefined {
  if (!bg || typeof bg !== "string") return bg;
  
  // If it's already a CSS url() function, process it
  if (bg.toLowerCase().includes("url(")) {
    return getPrefixCssUrl(bg);
  }
  
  // If it's a simple path, wrap in url() and process. Bare https?:// and
  // protocol-relative tokens are also wrapped — emitting them verbatim would
  // produce `background-image: https://…`, which is invalid CSS.
  if (bg.startsWith("/") && !bg.startsWith("//") && !/^https?:\/\//i.test(bg)) {
    return getPrefixCssUrl(`url(${bg})`);
  }
  if (/^(https?:\/\/|\/\/)/i.test(bg) && !/\s/.test(bg)) {
    return `url(${bg})`;
  }

  return bg;
}

/**
 * Process style object to handle backgroundImage with basePath.
 * @param style - React CSS properties object.
 * @returns Processed style object with basePath applied to background images.
 */
function withBaseStyle(style?: CSSProperties): CSSProperties | undefined {
  if (!style) return style;
  
  const processed = { ...style };
  
  if (processed.backgroundImage && typeof processed.backgroundImage === "string") {
    processed.backgroundImage = withBase(processed.backgroundImage);
  }
  
  // Handle other background-related properties that might contain URLs
  if (processed.background && typeof processed.background === "string") {
    processed.background = getPrefixCssUrl(processed.background);
  }
  
  return processed;
}

/**
 * Div component that automatically handles basePath for background images.
 * Supports both backgroundImage prop and style.backgroundImage with automatic path prefixing.
 */
export default function Bg({ backgroundImage, style, ...props }: Props) {
  const processedStyle = withBaseStyle(style);
  
  // If backgroundImage prop is provided, it WINS over any
  // style.backgroundImage — destructured out first so the spread order of
  // the user's style object cannot flip the outcome.
  if (backgroundImage) {
    const processedBg = withBase(backgroundImage);
    const { backgroundImage: _dropped, ...styleRest } = processedStyle ?? {};
    return (
      <div
        {...props}
        style={{
          ...styleRest,
          backgroundImage: processedBg
        }}
      />
    );
  }
  
  return <div {...props} style={processedStyle} />;
}