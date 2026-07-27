import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import {
  categoryUrl,
  getAllArticlePaths,
  getAllCategories,
  getCategoryTotalPages,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const home = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  const categories = await getAllCategories();
  const categoryPages = categories.flatMap((category) => {
    const totalPages = getCategoryTotalPages(category);
    return Array.from({ length: totalPages }, (_, index) => ({
      url: `${SITE_URL}${categoryUrl(category.slug, index + 1)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  });

  const articlePaths = await getAllArticlePaths();
  const articlePages = articlePaths.map(({ category, slug }) => ({
    url: `${SITE_URL}/articles/${category}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [home, ...categoryPages, ...articlePages];
}
