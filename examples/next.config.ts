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
};

export default nextConfig;
