"use client";
import { useRouter as useNextRouter, usePathname as useNextPathname } from "next/navigation";
import { getPrefixPath } from "../utils/basepath";

/**
 * Enhanced router hook that automatically handles basePath for navigation methods.
 * Wraps Next.js useRouter to ensure all navigation works correctly with sub-path hosting.
 */
export function useRouter() {
  const router = useNextRouter();

  return {
    ...router,
    /**
     * Navigate to a route with automatic basePath handling.
     * @param href - Route to navigate to (string or URL).
     * @param options - Navigation options.
     */
    push: (href: string | URL, options?: any) => {
      const processedHref = typeof href === "string" 
        ? getPrefixPath(href) 
        : href.toString();
      return router.push(processedHref, options);
    },
    
    /**
     * Replace current route with automatic basePath handling.
     * @param href - Route to replace with (string or URL).
     * @param options - Navigation options.
     */
    replace: (href: string | URL, options?: any) => {
      const processedHref = typeof href === "string" 
        ? getPrefixPath(href) 
        : href.toString();
      return router.replace(processedHref, options);
    },
    
    /**
     * Prefetch a route with automatic basePath handling.
     * @param href - Route to prefetch (string or URL).
     * @param options - Prefetch options.
     */
    prefetch: (href: string | URL, options?: any) => {
      const processedHref = typeof href === "string" 
        ? getPrefixPath(href) 
        : href.toString();
      return router.prefetch(processedHref, options);
    }
  };
}

/**
 * Enhanced pathname hook that returns the pathname without basePath for cleaner routing logic.
 * Removes basePath prefix from the current pathname to get the app-relative path.
 */
export function usePathname(): string {
  const pathname = useNextPathname();
  // Note: Next.js App Router automatically handles basePath removal in usePathname
  // This wrapper is for consistency and future extensibility
  return pathname;
}