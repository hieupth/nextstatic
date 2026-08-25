import type { NextConfig } from "next";

// Community-standard basePath inference for GitHub Pages:
// BASE_PATH (explicit) → GITHUB_REPOSITORY (owner/repo → /repo) → ""
// See: github.com/orgs/community/discussions/191018
const inferBasePath = (): string => {
  if (process.env.BASE_PATH !== undefined) return process.env.BASE_PATH;
  if (process.env.GITHUB_REPOSITORY) return `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`;
  return "";
};

const basePath = inferBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // directory-index static output (/en/index.html)
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  // Inline into the client bundle so the lib's process.env.BASE_PATH
  // matches the build-time value (prevents hydration mismatch).
  env: {
    BASE_PATH: basePath,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
