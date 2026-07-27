import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  CategoryArticleList,
  MobileRegisterBar,
  SiteFooter,
} from "@/components/ArticleContent";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/config/site";
import {
  CONTENT_REVALIDATE_SECONDS,
  categoryUrl,
  getAllCategoryPagePaths,
  getCategory,
  getCategoryArticlesPage,
  getCategoryTotalPages,
  normalizePageNumber,
} from "@/lib/content";

type Props = { params: Promise<{ category: string; page: string }> };

export const revalidate = CONTENT_REVALIDATE_SECONDS;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllCategoryPagePaths();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, page: pageParam } = await params;
  const category = await getCategory(categorySlug);
  if (!category) return {};

  const page = normalizePageNumber(
    Number(pageParam),
    getCategoryTotalPages(category),
  );

  return {
    title: `${category.title} — Page ${page} | 100CUCI Malaysia`,
    description: category.description,
    alternates: { canonical: `${SITE_URL}${categoryUrl(category.slug, page)}` },
  };
}

export default async function CategoryPagedPage({ params }: Props) {
  const { category: categorySlug, page: pageParam } = await params;
  const category = await getCategory(categorySlug);
  if (!category) notFound();

  const parsedPage = Number(pageParam);
  if (!Number.isFinite(parsedPage)) {
    redirect(categoryUrl(categorySlug));
  }

  const totalPages = getCategoryTotalPages(category);

  if (parsedPage <= 1) {
    redirect(categoryUrl(categorySlug));
  }

  if (parsedPage > totalPages) {
    redirect(categoryUrl(categorySlug, totalPages));
  }

  const { page, articles } = getCategoryArticlesPage(category, parsedPage);

  return (
    <div className="landing">
      <SiteHeader />
      <main className="lp-content-page">
        <nav className="lp-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={categoryUrl(category.slug)}>{category.title}</Link>
          <span>/</span>
          <span>Page {page}</span>
        </nav>
        <header className="lp-content-header">
          <h1>
            {category.title} — Page {page}
          </h1>
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
