import Link from "next/link";
import type { ReactNode } from "react";
import { ArticlePagination } from "@/components/ArticlePagination";
import { SITE_LINKS } from "@/config/site-links";
import { LinkedText } from "@/components/LinkedText";
import type { Article, Category } from "@/content/types";

export function ArticleBody({ article }: { article: Article }) {
  return (
    <article className="lp-article-body">
      <p className="lp-article-updated">Last updated: {article.updatedAt}</p>
      <h1>{article.title}</h1>
      <p className="lp-article-excerpt">{article.excerpt}</p>

      {article.paragraphs?.map((paragraph, index) => (
        <p key={`${article.slug}-p-${index}`}>
          <LinkedText text={paragraph} />
        </p>
      ))}

      {article.list && (
        <ul>
          {article.list.map((item, index) => (
            <li key={`${article.slug}-li-${index}`}>
              <LinkedText text={item} />
            </li>
          ))}
        </ul>
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
  return (
    <>
      <p className="lp-article-count">
        {category.articles.length} articles · Page {currentPage} of {totalPages}
      </p>
      <div className="lp-article-list">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${category.slug}/${article.slug}`}
            className="lp-article-card"
          >
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <span className="lp-article-read">Read article →</span>
          </Link>
        ))}
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
