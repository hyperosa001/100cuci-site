import keywordLinksData from "../../content/keyword-links.json";
import type { KeywordLink } from "@/content/types";

const ALL_LINKS = keywordLinksData.links as KeywordLink[];
const BY_CATEGORY = (keywordLinksData.byCategory ?? {}) as Record<
  string,
  string[]
>;
export const KEYWORD_MAX_PER_ARTICLE =
  typeof keywordLinksData.maxPerArticle === "number"
    ? keywordLinksData.maxPerArticle
    : 2;

/** 全站关键词池（首页 SEO 等） */
export const KEYWORD_LINKS = ALL_LINKS;

/** 每个栏目文章只用该栏目的 2 个关键词 */
export function getKeywordLinksForCategory(
  categorySlug?: string,
): KeywordLink[] {
  if (!categorySlug) return ALL_LINKS.slice(0, KEYWORD_MAX_PER_ARTICLE);

  const names = BY_CATEGORY[categorySlug];
  if (!names?.length) return ALL_LINKS.slice(0, KEYWORD_MAX_PER_ARTICLE);

  const selected: KeywordLink[] = [];
  for (const name of names) {
    const hit = ALL_LINKS.find(
      (link) => link.keyword.toLowerCase() === name.toLowerCase(),
    );
    if (hit) selected.push(hit);
    if (selected.length >= KEYWORD_MAX_PER_ARTICLE) break;
  }
  return selected.length > 0
    ? selected
    : ALL_LINKS.slice(0, KEYWORD_MAX_PER_ARTICLE);
}
