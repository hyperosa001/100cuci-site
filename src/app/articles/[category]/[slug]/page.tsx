import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArticleBody,
  MobileRegisterBar,
  SiteFooter,
} from "@/components/ArticleContent";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_LINKS } from "@/config/site-links";
import { SITE_URL } from "@/config/site";
import {
  CONTENT_REVALIDATE_SECONDS,
  articleUrl,
  getAllArticlePaths,
  getArticle,
} from "@/lib/content";

type Props = { params: Promise<{ category: string; slug: string }> };

export const revalidate = CONTENT_REVALIDATE_SECONDS;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllArticlePaths();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const result = await getArticle(category, slug);
  if (!result) return {};

  const title = result.article.yoastTitle ?? result.article.title;
  const description =
    result.article.yoastDescription ?? result.article.excerpt;

  return {
    title: `${title} | 100CUCI`,
    description,
    alternates: {
      canonical: `${SITE_URL}${articleUrl(category, slug)}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const result = await getArticle(categorySlug, slug);
  if (!result) notFound();

  const { category, article } = result;

  return (
    <div className="landing">
      <SiteHeader />
      <main className="lp-content-page lp-article-page">
        <nav className="lp-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/articles/${category.slug}`}>{category.title}</Link>
          <span>/</span>
          <span>{article.title}</span>
        </nav>
        <ArticleBody article={article} categorySlug={category.slug} />
        <div className="lp-article-cta">
          <a href={SITE_LINKS.register} className="lp-btn lp-btn-register lp-btn-lg" target="_blank" rel="noopener noreferrer">
            REGISTER NOW — CLAIM FREE RM5
          </a>
        </div>
      </main>
      <SiteFooter />
      <MobileRegisterBar />
    </div>
  );
}
