import type { Article, Category, SeoFaqItem, SeoSection } from "@/content/types";

/** Decap CMS list 字段可能存成 [{ paragraph: "..." }]，统一转成 string[] */
function normalizeStringList(value: unknown, key: "paragraph" | "item"): string[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;

  if (typeof value[0] === "string") {
    return value as string[];
  }

  return (value as Record<string, string>[])
    .map((entry) => entry[key])
    .filter((text): text is string => Boolean(text));
}

function normalizeArticle(article: Article): Article {
  return {
    ...article,
    paragraphs: normalizeStringList(article.paragraphs, "paragraph"),
    list: normalizeStringList(article.list, "item"),
  };
}

export function normalizeCategories(categories: Category[]): Category[] {
  return categories.map((category) => ({
    ...category,
    articles: category.articles.map(normalizeArticle),
  }));
}

export function normalizeSeoSections(sections: SeoSection[]): SeoSection[] {
  return sections.map((section) => ({
    ...section,
    paragraphs: normalizeStringList(section.paragraphs, "paragraph"),
    list: normalizeStringList(section.list, "item"),
  }));
}

export function normalizeFaq(faq: SeoFaqItem[]): SeoFaqItem[] {
  return faq;
}
