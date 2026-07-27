import { ARTICLES_PER_PAGE } from "@/config/content";
import type { Article, Category } from "@/content/types";
import { fetchCategoriesLive } from "@/lib/wordpress";

export async function getAllCategories(): Promise<Category[]> {
  return fetchCategoriesLive();
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getArticle(
  categorySlug: string,
  articleSlug: string,
): Promise<{ category: Category; article: Article } | undefined> {
  const category = await getCategory(categorySlug);
  if (!category) return undefined;
  const article = category.articles.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { category, article };
}

export async function getAllArticlePaths(): Promise<
  { category: string; slug: string }[]
> {
  const categories = await getAllCategories();
  return categories.flatMap((category) =>
    category.articles.map((article) => ({
      category: category.slug,
      slug: article.slug,
    })),
  );
}

export function getCategoryTotalPages(category: Category): number {
  return Math.max(1, Math.ceil(category.articles.length / ARTICLES_PER_PAGE));
}

export function normalizePageNumber(page: number, totalPages: number): number {
  if (!Number.isFinite(page) || page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

export function getCategoryArticlesPage(
  category: Category,
  page: number,
): { page: number; totalPages: number; articles: Article[] } {
  const totalPages = getCategoryTotalPages(category);
  const safePage = normalizePageNumber(page, totalPages);
  const start = (safePage - 1) * ARTICLES_PER_PAGE;
  const articles = category.articles.slice(start, start + ARTICLES_PER_PAGE);
  return { page: safePage, totalPages, articles };
}

export async function getAllCategoryPagePaths(): Promise<
  { category: string; page: string }[]
> {
  const categories = await getAllCategories();
  return categories.flatMap((category) => {
    const totalPages = getCategoryTotalPages(category);
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      category: category.slug,
      page: String(index + 2),
    }));
  });
}

export function articleUrl(categorySlug: string, articleSlug: string): string {
  return `/articles/${categorySlug}/${articleSlug}`;
}

export function categoryUrl(categorySlug: string, page = 1): string {
  if (page <= 1) return `/articles/${categorySlug}`;
  return `/articles/${categorySlug}/page/${page}`;
}
