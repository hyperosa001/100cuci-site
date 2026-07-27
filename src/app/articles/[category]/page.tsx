import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CategoryArticleList,
  MobileRegisterBar,
  SiteFooter,
} from "@/components/ArticleContent";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/config/site";
import {
  categoryUrl,
  getAllCategories,
  getCategory,
  getCategoryArticlesPage,
} from "@/lib/content";

type Props = { params: Promise<{ category: string }> };

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategory(categorySlug);
  if (!category) return {};

  return {
    title: `${category.title} | 100CUCI Malaysia`,
    description: category.description,
    alternates: { canonical: `${SITE_URL}${categoryUrl(category.slug)}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = await getCategory(categorySlug);
  if (!category) notFound();

  const { page, totalPages, articles } = getCategoryArticlesPage(category, 1);

  return (
    <div className="landing">
      <SiteHeader />
      <main className="lp-content-page">
        <nav className="lp-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{category.title}</span>
        </nav>
        <header className="lp-content-header">
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </header>
        <CategoryArticleList
          category={category}
          articles={articles}
          currentPage={page}
          totalPages={totalPages}
        />
      </main>
      <SiteFooter />
      <MobileRegisterBar />
    </div>
  );
}
