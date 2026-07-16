/**
 * 你的网站域名（部署后填写）。
 * 本地开发默认 localhost:3000，上线前在 .env.local 设置 NEXT_PUBLIC_SITE_URL。
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "100CUCI";

/** Same favicon as 100cuci.com (browser tab + Google search icon). */
export const SITE_FAVICON_PATH = "/media/f5e0ed4082196f7432355.png";

/** Same Organization logo as 100cuci.com JSON-LD schema. */
export const SITE_ORG_LOGO_PATH = "/media/3ddd0b48bbb962a4933c1.webp";

export const SITE_PAGE_TITLE =
  "100CUCI | Slot Free Credit No Deposit New Member Malaysia";

export const SITE_META_TITLE =
  "100CUCI | Slot Free Credit No Deposit New Member 2026";

/** Matches 100cuci.com og:description / meta description. */
export const SITE_DESCRIPTION =
  "New members claim slot free credit no deposit from RM5 to RM100 at 100CUCI Malaysia. No turnover bonuses, trusted deposits, fast withdrawals. 18+ only.";

export const SITE_KEYWORDS = [
  "free credit no deposit",
  "free credit no deposit new member",
  "slot free credit",
  "slot free credit no deposit",
];

/** @deprecated Use SITE_FAVICON_PATH */
export const SITE_LOGO_PATH = SITE_FAVICON_PATH;
