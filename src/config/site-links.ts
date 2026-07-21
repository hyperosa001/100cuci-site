import siteLinks from "../../content/site-links.json";

/** Register / Login 按钮链接（在 CMS「站点按钮链接」中编辑） */
export const SITE_LINKS = {
  login: siteLinks.login,
  register: siteLinks.register,
} as const;
