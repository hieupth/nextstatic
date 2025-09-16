"use client";

import type { HTMLAttributes, CSSProperties } from "react";
import { getPrefixCssUrl } from "../utils/basepath";

type Props = HTMLAttributes<HTMLDivElement> & {
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
  if (bg.includes("url(")) {
    return getPrefixCssUrl(bg);
  }
  
  // If it's a simple path, wrap in url() and process
  if (bg.startsWith("/") && !bg.startsWith("//") && !/^https?:\/\//i.test(bg)) {
    return getPrefixCssUrl(`url(${bg})`);
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
export default function Background({ backgroundImage, style, ...props }: Props) {
  const processedStyle = withBaseStyle(style);
  
  // If backgroundImage prop is provided, merge it with style
  if (backgroundImage) {
    const processedBg = withBase(backgroundImage);
    return (
      <div
        {...props}
        style={{
          ...processedStyle,
          backgroundImage: processedBg
        }}
      />
    );
  }
  
  return <div {...props} style={processedStyle} />;
}