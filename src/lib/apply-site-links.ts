import { SITE_LINKS } from "@/config/site-links";

export function applySiteLinks(html: string): string {
  return html
    .replace(
      /<a class="login" href="[^"]*"/g,
      `<a class="login" href="${SITE_LINKS.login}"`,
    )
    .replace(
      /<a class="register"(?![^>]*href=)/g,
      `<a class="register" href="${SITE_LINKS.register}"`,
    )
    .replace(/href="\/login"/g, `href="${SITE_LINKS.login}"`)
    .replace(/href="#login"/g, `href="${SITE_LINKS.login}"`)
    .replace(/href="\/register\/SMSRegister"/g, `href="${SITE_LINKS.register}"`)
    .replace(/href="#register"/g, `href="${SITE_LINKS.register}"`);
}
