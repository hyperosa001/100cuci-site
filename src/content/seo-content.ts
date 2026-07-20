import homepageSeo from "../../content/homepage-seo.json";
import type { SeoFaqItem, SeoKeywordLink, SeoSection } from "@/content/types";
import { normalizeFaq, normalizeSeoSections } from "@/lib/normalize-cms-content";

export const SEO_LAST_UPDATED = homepageSeo.lastUpdated;

export const SEO_KEYWORD_LINK_HEAD = homepageSeo.keywordLinkHead as SeoKeywordLink;

export const SEO_KEYWORD_LINK_TAIL = homepageSeo.keywordLinkTail as SeoKeywordLink;

export const SEO_SECTIONS = normalizeSeoSections(homepageSeo.sections as SeoSection[]);

export const SEO_FAQ = normalizeFaq(homepageSeo.faq as SeoFaqItem[]);
