import Link from "next/link";
import type { ReactNode } from "react";
import { ArticlePagination } from "@/components/ArticlePagination";
import { LinkedText } from "@/components/LinkedText";
import { getArticleCover } from "@/config/article-covers";
import { SITE_LINKS } from "@/config/site-links";
import { KEYWORD_LINKS } from "@/content/keyword-links";
import type { Article, Category } from "@/content/types";
import { estimateReadMinutes, linkifyHtml, scrubCmsHtml } from "@/lib/linkify-html";

function stripLeadingImgs(html: string): string {
  return html.replace(
    /^(?:\s*<p>\s*)?(?:\s*<img\b[^>]*>\s*)+(?:\s*<\/p>\s*)?/i,
    "",
  );
}

/** 去掉与封面相同的图，避免文章里出现两张一样的 */
function stripDuplicateCoverImgs(html: string, coverPath?: string): string {
  let next = stripLeadingImgs(scrubCmsHtml(html));
  if (!coverPath) return next;

  const file = coverPath.split("/").pop();
  if (!file) return next;

  const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `(?:<p>\\s*)?<img\\b[^>]*src=["'][^"']*${escaped}[^"']*["'][^>]*>\\s*(?:</p>\\s*)?`,
    "gi",
  );
  return next.replace(pattern, "");
}

function articlePlainText(article: Article): string {
  if (article.html) return article.html.replace(/<[^>]+>/g, " ");
  return [article.excerpt, ...(article.paragraphs ?? []), ...(article.list ?? [])]
    .join(" ");
}

export function ArticleBody({
  article,
  categorySlug,
}: {
  article: Article;
  categorySlug?: string;
}) {
  const cover = getArticleCover(article.slug, categorySlug);
  const minutes = estimateReadMinutes(articlePlainText(article));
  const linkedHtml = article.html
    ? linkifyHtml(stripDuplicateCoverImgs(article.html, cover), KEYWORD_LINKS)
    : null;

  return (
    <article className="lp-article-body">
      {cover ? (
        <img src={cover} alt={article.title} className="lp-article-cover" />
      ) : null}
      <p className="lp-article-meta">
        Last updated: {article.updatedAt} · {minutes} min read
      </p>
      <h1>{article.title}</h1>
      <p className="lp-article-excerpt">
        <LinkedText text={article.excerpt} />
      </p>

      {linkedHtml ? (
        <div
          className="lp-article-html"
          dangerouslySetInnerHTML={{ __html: linkedHtml }}
        />
      ) : (
        <>
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
        No articles yet. Publish in WordPress CMS — they appear here within about 1
        minute.
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
          const minutes = estimateReadMinutes(articlePlainText(article));
          return (
            <Link
              key={article.slug}
              href={`/articles/${category.slug}/${article.slug}`}
              className="lp-article-card"
            >
              {cover ? (
                <img src={cover} alt="" className="lp-article-card-cover" />
              ) : null}
              <p className="lp-article-card-meta">
                {article.updatedAt} · {minutes} min read
              </p>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
              <span className="lp-article-read">Read More →</span>
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

export function RelatedArticles({
  category,
  currentSlug,
}: {
  category: Category;
  currentSlug: string;
}) {
  const related = category.articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="lp-related">
      <h2 className="lp-related-title">Related in {category.title}</h2>
      <div className="lp-article-list lp-related-list">
        {related.map((article) => {
          const cover = getArticleCover(article.slug, category.slug);
          return (
            <Link
              key={article.slug}
              href={`/articles/${category.slug}/${article.slug}`}
              className="lp-article-card"
            >
              {cover ? (
                <img src={cover} alt="" className="lp-article-card-cover" />
              ) : null}
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
              <span className="lp-article-read">Read More →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function SiteFooter({ cta }: { cta?: ReactNode }) {
  return (
    <footer className="lp-footer">
      <p>© 2026 100CUCI. All Rights Reserved.</p>
      {cta ?? (
        <p className="lp-footer-cta">
          <a
            href={SITE_LINKS.register}
            className="lp-btn lp-btn-register"
            target="_blank"
            rel="noopener noreferrer"
          >
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
      <a
        href={SITE_LINKS.register}
        className="lp-btn lp-btn-register"
        target="_blank"
        rel="noopener noreferrer"
      >
        REGISTER NOW — FREE RM5
      </a>
    </div>
  );
}
