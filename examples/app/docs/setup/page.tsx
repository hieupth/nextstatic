export default function SetupDocs() {
  return (
    <>
      <h1>Setup</h1>
      <p>
        Feed one env var to both Next and the lib — they must agree. The lib
        reads <code>BASE_PATH</code> (fallback <code>NEXT_PUBLIC_BASE_PATH</code>)
        at runtime for asset paths.
      </p>
      <pre>{`// next.config.ts
const basePath = process.env.BASE_PATH ?? "";

const nextConfig = {
  output: "export",
  trailingSlash: true, // directory-index static output (host-friendly)
  basePath,            // Next: route URLs
  assetPrefix: basePath,
  images: { unoptimized: true },
};`}</pre>
      <pre>{`BASE_PATH=/demo npm run build   # → every route & asset under /demo/`}</pre>
      <p>
        That is the whole setup. Everything else — links, images, scripts,
        media, CSS urls — is handled by the wrappers on the next pages.
      </p>
    </>
  );
}
