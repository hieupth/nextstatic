import { getLocalePath } from "@hieupth/nextstatic";

export function LangSwitcher({ locale }: { locale: string }) {
  const other = locale === "en" ? "vi" : "en";
  // Raw <a> (not Link) — Link would add the CURRENT locale segment on top
  // of the target locale, producing /en/vi/. getLocalePath includes basePath.
  return (
    <a href={getLocalePath("/", other)} className="lang-switch">
      {other === "en" ? "English" : "Tiếng Việt"}
    </a>
  );
}
