/**
 * 你的网站域名（部署后填写）。
 * 本地开发默认 localhost:3000，上线前在 .env.local 设置 NEXT_PUBLIC_SITE_URL。
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "100CUCI";

export const SITE_DESCRIPTION =
  "100CUCI gives Malaysian players a genuine free credit no deposit path into online casino gaming, starting the moment you register.";
