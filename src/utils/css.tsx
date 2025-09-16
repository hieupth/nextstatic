"use client";

import { getPrefixCssUrl } from "./basepath";

/**
 * Process CSS string to handle basePath in url() values.
 * Useful for dynamic CSS generation or styled-components.
 * @param css - CSS string containing url() values.
 * @returns Processed CSS string with basePath applied to URLs.
 */
export function processCss(css: string): string {
  if (!css || typeof css !== "string") return css || "";
  return getPrefixCssUrl(css);
}

/**
 * Template literal tag for CSS with automatic basePath handling.
 * Use as a tagged template literal for CSS strings.
 * @param strings - Template literal strings.
 * @param values - Template literal values.
 * @returns Processed CSS string with basePath applied.
 */
export function css(strings: TemplateStringsArray, ...values: any[]): string {
  // Combine template literal parts
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + strings[i + 1];
  }
  
  // Process the combined CSS
  return processCss(result);
}

/**
 * Higher-order component that processes className with CSS url() values.
 * Useful for CSS-in-JS libraries or dynamic className generation.
 * @param Component - React component to wrap.
 * @returns Wrapped component with basePath-aware className processing.
 */
export function withProcessedClassName<T extends { className?: string }>(
  Component: React.ComponentType<T>
) {
  return function ProcessedComponent(props: T) {
    const processedClassName = props.className ? processCss(props.className) : props.className;
    return <Component {...props} className={processedClassName} />;
  };
}

/**
 * React hook for processing CSS strings with basePath.
 * Useful for dynamic CSS generation in components.
 * @param css - CSS string to process.
 * @returns Processed CSS string with basePath applied.
 */
export function useProcessedCss(css: string): string {
  return processCss(css);
}