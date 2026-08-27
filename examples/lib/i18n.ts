export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(v: string): v is Locale {
  return locales.includes(v as Locale);
}

const dict: Record<Locale, Record<string, string>> = {
  en: {
    "landing.title": "nextstatic",
    "landing.description": "The path & asset layer for Next.js static exports under a sub-directory.",
    "landing.chooseLanguage": "Choose your language",

    "nav.home": "Home",
    "nav.about": "About",
    "nav.docs": "Docs",
    "nav.docsOverview": "Overview",
    "nav.setup": "Setup",
    "nav.components": "Components",
    "nav.hooks": "Hooks",
    "nav.utils": "Utils",
    "nav.i18n": "i18n",

    "home.title": "nextstatic",
    "home.description": "The path & asset layer for Next.js static exports under a sub-directory. This app is the living documentation and verification harness.",
    "home.hooksDemo": "Hooks & utils — live",
    "home.builtWith": "Built with",

    "about.title": "About",
    "about.description": "This page demonstrates locale-in-route navigation.",

    "docs.overview.title": "Docs",
    "docs.overview.intro": "One BASE_PATH feeds both Next and the lib; every wrapper prefixes correctly.",
    "docs.overview.setupLink": "Setup — one env var, one config",
    "docs.overview.componentsLink": "Components — live, prefixed",
    "docs.overview.hooksLink": "Hooks — live readouts",
    "docs.overview.utilsLink": "Utils — reference",
    "docs.overview.i18nLink": "i18n — locale without flicker",

    "docs.setup.title": "Setup",
    "docs.setup.intro": "Feed one env var to both Next and the lib — they must agree. The lib reads BASE_PATH at runtime for asset paths.",
    "docs.setup.configComment": "next.config.ts",
    "docs.setup.buildCommand": "Build with a base path",
    "docs.setup.thatIsAll": "That is the whole setup. Everything else is handled by the wrappers.",

    "docs.components.title": "Components",
    "docs.components.intro": "Drop-in wrappers with the same props as the originals. Everything below is live on this page.",
    "docs.components.link": "Link / Anchor",
    "docs.components.linkDesc": "Link wraps next/link; basePath comes from Next, the locale segment from LocaleProvider. Anchor is the raw <a> form.",
    "docs.components.imageBg": "Image / Bg",
    "docs.components.script": "Script",
    "docs.components.media": "Media: Video / Audio / Iframe / Source",
    "docs.components.form": "Form",
    "docs.components.source": "Source follows the same pattern inside picture/video elements.",

    "docs.hooks.title": "Hooks — live",
    "docs.hooks.assetPath": "Returns an object of path helpers (no arguments):",
    "docs.hooks.assetAsset": "Single path / multiple paths:",
    "docs.hooks.router": "basePath-aware navigation",
    "docs.hooks.locale": "This section is wrapped in a provider. Outside one, useLocale returns a safe default.",

    "docs.utils.title": "Utils",
    "docs.utils.intro": "Plain functions for raw surfaces — plain <a>, <img>, <script>, CSS urls.",
    "docs.utils.contract": "The prefixing contract",
    "docs.utils.nextPrimitives": "Next primitives (Link, useRouter) add only the locale segment — getLocaleRoute. Next itself applies basePath.",
    "docs.utils.rawSurfaces": "Raw surfaces use the basePath-aware utils (getPrefixPath, getLocalePath).",

    "docs.i18n.title": "i18n patterns",
    "docs.i18n.staticFirst": "Static-first: locale-in-route (zero flicker)",
    "docs.i18n.staticFirstDesc": "Each locale is prerendered as its own HTML; the provider receives the route param at build time.",
    "docs.i18n.switching": "Switching locale",
    "docs.i18n.switchingDesc": "setLocale updates state but does not navigate — push the localized URL yourself.",
    "docs.i18n.noProvider": "Link works standalone: without a provider, locale is empty and it prefixes basePath only.",

    "demos.basePath": "Base path",
    "demos.getPath": "Get path",
    "demos.cssUrl": "CSS url",
    "demos.isExternal": "Is external",
    "demos.locale": "Locale",
    "demos.switchLocale": "Switch",
    "demos.push": "Navigate",
  },

  vi: {
    "landing.title": "nextstatic",
    "landing.description": "Lớp đường dẫn & tài nguyên cho Next.js static export dưới thư mục con.",
    "landing.chooseLanguage": "Chọn ngôn ngữ",

    "nav.home": "Trang chủ",
    "nav.about": "Giới thiệu",
    "nav.docs": "Tài liệu",
    "nav.docsOverview": "Tổng quan",
    "nav.setup": "Cài đặt",
    "nav.components": "Component",
    "nav.hooks": "Hook",
    "nav.utils": "Tiện ích",
    "nav.i18n": "i18n",

    "home.title": "nextstatic",
    "home.description": "Lớp đường dẫn & tài nguyên cho Next.js static export dưới thư mục con. Ứng dụng này là tài liệu sống và công cụ kiểm chứng.",
    "home.hooksDemo": "Hook & tiện ích — trực tiếp",
    "home.builtWith": "Xây dựng bằng",

    "about.title": "Giới thiệu",
    "about.description": "Trang này minh họa điều hướng locale-in-route.",

    "docs.overview.title": "Tài liệu",
    "docs.overview.intro": "Một BASE_PATH cấp cho cả Next và thư viện; mọi wrapper thêm prefix đúng cách.",
    "docs.overview.setupLink": "Cài đặt — một biến môi trường, một cấu hình",
    "docs.overview.componentsLink": "Component — trực tiếp, có prefix",
    "docs.overview.hooksLink": "Hook — kết quả trực tiếp",
    "docs.overview.utilsLink": "Tiện ích — tham chiếu",
    "docs.overview.i18nLink": "i18n — locale không nhấp nháy",

    "docs.setup.title": "Cài đặt",
    "docs.setup.intro": "Cấp một biến môi trường cho cả Next và thư viện — chúng phải khớp nhau. Thư viện đọc BASE_PATH lúc runtime cho đường dẫn tài nguyên.",
    "docs.setup.configComment": "next.config.ts",
    "docs.setup.buildCommand": "Build với đường dẫn cơ sở",
    "docs.setup.thatIsAll": "Chỉ cần vậy thôi. Mọi thứ còn lại được wrapper xử lý.",

    "docs.components.title": "Component",
    "docs.components.intro": "Wrapper thay thế trực tiếp với cùng props như bản gốc. Mọi thứ bên dưới đều chạy trực tiếp trên trang này.",
    "docs.components.link": "Link / Anchor",
    "docs.components.linkDesc": "Link bao bọc next/link; basePath do Next cung cấp, locale segment do LocaleProvider. Anchor là dạng <a> thô.",
    "docs.components.imageBg": "Image / Bg",
    "docs.components.script": "Script",
    "docs.components.media": "Media: Video / Audio / Iframe / Source",
    "docs.components.form": "Form",
    "docs.components.source": "Source hoạt động tương tự trong picture/video.",

    "docs.hooks.title": "Hook — trực tiếp",
    "docs.hooks.assetPath": "Trả về object chứa các hàm xử lý đường dẫn (không đối số):",
    "docs.hooks.assetAsset": "Một đường dẫn / nhiều đường dẫn:",
    "docs.hooks.router": "Điều hướng có basePath",
    "docs.hooks.locale": "Phần này nằm trong provider. Nếu không có provider, useLocale trả về giá trị mặc định an toàn.",

    "docs.utils.title": "Tiện ích",
    "docs.utils.intro": "Hàm thuần cho các bề mặt thô — <a>, <img>, <script>, CSS url.",
    "docs.utils.contract": "Hợp đồng prefix",
    "docs.utils.nextPrimitives": "Next primitive (Link, useRouter) chỉ thêm locale segment — getLocaleRoute. Next tự thêm basePath.",
    "docs.utils.rawSurfaces": "Bề mặt thô dùng tiện ích có basePath (getPrefixPath, getLocalePath).",

    "docs.i18n.title": "Mẫu i18n",
    "docs.i18n.staticFirst": "Tĩnh trước: locale-in-route (không nhấp nháy)",
    "docs.i18n.staticFirstDesc": "Mỗi locale được prerender thành HTML riêng; provider nhận route param lúc build.",
    "docs.i18n.switching": "Chuyển locale",
    "docs.i18n.switchingDesc": "setLocale cập nhật state nhưng không điều hướng — tự push URL có locale.",
    "docs.i18n.noProvider": "Link hoạt động độc lập: không có provider, locale rỗng và chỉ thêm basePath.",

    "demos.basePath": "Đường dẫn cơ sở",
    "demos.getPath": "Lấy đường dẫn",
    "demos.cssUrl": "CSS url",
    "demos.isExternal": "Liên kết ngoài",
    "demos.locale": "Ngôn ngữ",
    "demos.switchLocale": "Chuyển",
    "demos.push": "Điều hướng",
  },
};

export function t(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? dict.en?.[key] ?? key;
}
