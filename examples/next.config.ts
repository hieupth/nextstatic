import type { NextConfig } from "next";

// The demo mirrors the README setup: one BASE_PATH feeds both Next
// (basePath/assetPrefix for routes) and the lib (asset prefixes).
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // directory-index static output (/en/index.html)
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  // Inline BASE_PATH into the client bundle — without this the lib's
  // process.env.BASE_PATH is undefined on the client and hydration
  // mismatches the prerendered (prefixed) HTML.
  env: {
    BASE_PATH: basePath,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
