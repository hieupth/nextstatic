"use client";

import { useMemo } from "react";
import { getPrefixPath, getBasePath } from "../utils/basepath";

/**
 * React hook for getting asset paths with automatic basePath handling.
 * Provides convenient functions for path processing in components.
 * @returns Object with path utility functions.
 */
export function useAssetPath() {
  const basePath = getBasePath();
  
  return useMemo(() => ({
    /**
     * Get the current basePath.
     * @returns Current basePath string.
     */
    basePath,
    
    /**
     * Convert a relative path to a full asset path with basePath.
     * @param path - Relative path to process.
     * @returns Full path with basePath applied.
     */
    getPath: (path: string): string => getPrefixPath(path),
    
    /**
     * Get multiple asset paths at once.
     * @param paths - Array of relative paths to process.
     * @returns Array of full paths with basePath applied.
     */
    getPaths: (paths: string[]): string[] => 
      paths.map(path => getPrefixPath(path)),
    
    /**
     * Create a CSS url() value with basePath applied.
     * @param path - Relative path for CSS url().
     * @returns CSS url() string with basePath.
     */
    getCssUrl: (path: string): string => 
      `url(${getPrefixPath(path)})`,
    
    /**
     * Check if a path is external (doesn't need basePath).
     * @param path - Path to check.
     * @returns True if path is external.
     */
    isExternal: (path: string): boolean => 
      /^(https?:\/\/|data:|blob:|\/\/)/i.test(path),
    
    /**
     * Get asset path conditionally based on environment or condition.
     * @param path - Relative path to process.
     * @param condition - Condition to apply basePath.
     * @returns Original path or prefixed path based on condition.
     */
    getConditionalPath: (path: string, condition: boolean = true): string =>
      condition ? getPrefixPath(path) : path,
    
    /**
     * Resolve path from current basePath context.
     * Useful for dynamic imports or fetch requests.
     * @param path - API or resource path to resolve.
     * @returns Resolved path for current deployment context.
     */
    resolvePath: (path: string): string => {
      if (typeof window !== 'undefined') {
        // Client-side: use current origin + basePath
        return new URL(getPrefixPath(path), window.location.origin).href;
      }
      // Server-side: return prefixed path
      return getPrefixPath(path);
    }
  }), [basePath]);
}

/**
 * Simple hook to get a single asset path.
 * Convenient shorthand for common use case.
 * @param path - Relative path to process.
 * @returns Full path with basePath applied.
 */
export function useAsset(path: string): string {
  return useMemo(() => getPrefixPath(path), [path]);
}

/**
 * Hook to get multiple asset paths.
 * Optimized for arrays of paths.
 * @param paths - Array of relative paths to process.
 * @returns Array of full paths with basePath applied.
 */
export function useAssets(paths: string[]): string[] {
  return useMemo(() => 
    paths.map(path => getPrefixPath(path)), 
    [paths]
  );
}