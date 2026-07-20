import homepageSeo from "../../content/homepage-seo.json";
import type { SeoFaqItem, SeoSection } from "@/content/types";
import { normalizeFaq, normalizeSeoSections } from "@/lib/normalize-cms-content";

export const SEO_LAST_UPDATED = homepageSeo.lastUpdated;

/** 主页 SEO 区：文中第 1 个和最后 1 个「100CUCI」的链接地址 */
export const SEO_CUCI_LINK_HREF = homepageSeo.cuciLinkHref;

export const SEO_CUCI_LINK_EXTERNAL = homepageSeo.cuciLinkExternal ?? true;

export const SEO_SECTIONS = normalizeSeoSections(homepageSeo.sections as SeoSection[]);

export const SEO_FAQ = normalizeFaq(homepageSeo.faq as SeoFaqItem[]);
