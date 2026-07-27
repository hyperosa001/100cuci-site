import Link from "next/link";
import type { ReactNode } from "react";
import { ArticlePagination } from "@/components/ArticlePagination";
import { getArticleCover } from "@/config/article-covers";
import { SITE_LINKS } from "@/config/site-links";
import type { Article, Category } from "@/content/types";

/** 去掉正文开头的外链配图，避免与前台固定封面重复 */
function stripLeadingImgs(html: string): string {
  return html.replace(/^(?:\s*<p>\s*)?(?:\s*<img\b[^>]*>\s*)+(?:\s*<\/p>\s*)?/i, "");
}

export function ArticleBody({
  article,
  categorySlug,
}: {
  article: Article;
  categorySlug?: string;
}) {
  const cover = getArticleCover(article.slug, categorySlug);

  return (
    <article className="lp-article-body">
      {cover ? (
        <img
          src={cover}
          alt={article.title}
          className="lp-article-cover"
        />
      ) : null}
      <p className="lp-article-updated">Last updated: {article.updatedAt}</p>
      <h1>{article.title}</h1>
      <p className="lp-article-excerpt">{article.excerpt}</p>

      {article.html ? (
        <div
          className="lp-article-html"
          dangerouslySetInnerHTML={{ __html: stripLeadingImgs(article.html) }}
        />
      ) : (
        <>
          {article.paragraphs?.map((paragraph, index) => (
            <p key={`${article.slug}-p-${index}`}>{paragraph}</p>
          ))}

          {article.list && (
            <ul>
              {article.list.map((item, index) => (
                <li key={`${article.slug}-li-${index}`}>{item}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </article>
  );
}

export function CategoryArticleList({
  category,
  articles,
  currentPage,
  totalPages,
}: {
  category: Category;
  articles: Article[];
  currentPage: number;
  totalPages: number;
}) {
  if (category.articles.length === 0) {
    return (
      <p className="lp-article-empty">
        No articles yet. Publish in WordPress CMS — they appear here within about 1 minute.
      </p>
    );
  }

  return (
    <>
      <p className="lp-article-count">
        {category.articles.length} articles · Page {currentPage} of {totalPages}
      </p>
      <div className="lp-article-list">
        {articles.map((article) => {
          const cover = getArticleCover(article.slug, category.slug);
          return (
            <Link
              key={article.slug}
              href={`/articles/${category.slug}/${article.slug}`}
              className="lp-article-card"
            >
              {cover ? (
                <img
                  src={cover}
                  alt=""
                  className="lp-article-card-cover"
                />
              ) : null}
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
              <span className="lp-article-read">Read article →</span>
            </Link>
          );
        })}
      </div>
      <ArticlePagination
        categorySlug={category.slug}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}

export function SiteFooter({ cta }: { cta?: ReactNode }) {
  return (
    <footer className="lp-footer">
      <p>© 2026 100CUCI. All Rights Reserved.</p>
      {cta ?? (
        <p className="lp-footer-cta">
          <a href={SITE_LINKS.register} className="lp-btn lp-btn-register" target="_blank" rel="noopener noreferrer">
            REGISTER NOW
          </a>
        </p>
      )}
    </footer>
  );
}

export function MobileRegisterBar() {
  return (
    <div className="lp-mobile-bar">
      <a href={SITE_LINKS.register} className="lp-btn lp-btn-register" target="_blank" rel="noopener noreferrer">
        REGISTER NOW — FREE RM5
      </a>
    </div>
  );
}
