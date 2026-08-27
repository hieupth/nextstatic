import { t, type Locale } from "../../../../lib/i18n";

export default async function SetupDocs({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;

  return (
    <>
      <h1>{t(locale, "docs.setup.title")}</h1>
      <p>{t(locale, "docs.setup.intro")}</p>
      <pre>{`// ${t(locale, "docs.setup.configComment")}
const basePath = process.env.BASE_PATH ?? "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
};`}</pre>
      <pre>{`BASE_PATH=/demo npm run build`}</pre>
      <p>{t(locale, "docs.setup.thatIsAll")}</p>
    </>
  );
}
