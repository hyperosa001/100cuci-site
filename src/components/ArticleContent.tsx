import Link from "next/link";
import type { ReactNode } from "react";
import { ArticlePagination } from "@/components/ArticlePagination";
import { LinkedText } from "@/components/LinkedText";
import { getArticleCover } from "@/config/article-covers";
import { SITE_LINKS } from "@/config/site-links";
import { KEYWORD_LINKS } from "@/content/keyword-links";
import type { Article, Category } from "@/content/types";
import { estimateReadMinutes, linkifyHtml, scrubCmsHtml } from "@/lib/linkify-html";

/** 正文误用的图（如世界杯）→ 换成支付/银行相关原站图 */
const MEDIA_SWAPS: Record<string, string> = {
  // FIFA World Cup promo banner → WE ACCEPT / safe withdrawal
  "35001f94353a647d86d7e.webp": "1ab4589f3219601fbb7cd.png",
};

const BANKING_MEDIA_SWAPS: Record<string, string> = {
  // welcome promo → deposit/rebate banner with payment icons
  "b0dc9b63d88967e6859cb.webp": "31081511821962ba4e3a6.png",
  "125476a9d51965d355fb4.png": "31081511821962ba4e3a6.png",
};

/** 彩票文误用了推广佣金图 → 换成彩票相关图 */
const LOTTERY_MEDIA_SWAPS: Record<string, string> = {
  "f85eb31f3219680b10ca3.gif": "9a34856f321963f19982f.gif",
  "b0dc9b63d88967e6859cb.webp": "125476a9d51965d355fb4.png",
};

/** 体育文误用世界杯 AI 风 Banner → 换成原站 SOCCER BETTING / sportsbook 实拍卡 */
const SPORTS_MEDIA_SWAPS: Record<string, string> = {
  "18008343353a64f8a4481.png": "3bc80be352f36.jpg",
  "35001f94353a647d86d7e.webp": "3bc80be352f36.jpg",
  "a2629340ed2a69e4fa4c7.webp": "8c024e3bdbd9673e01f3c.png",
  "965a2bf2db5a64602326e.png": "45b8316bdbd96e2b5cc20.png",
  "e22f2ef8764a6d3b0a117.png": "1bf52db762196ad0e8abf.png",
  "9bb336e08219612129751.png": "55baab9762196392df3bf.png",
};

function applyMediaSwaps(html: string, swaps: Record<string, string>): string {
  let next = html;
  for (const [from, to] of Object.entries(swaps)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    next = next.replace(new RegExp(escaped, "gi"), to);
  }
  return next;
}

function sanitizeArticleHtml(html: string, articleSlug?: string): string {
  const isSports = Boolean(
    articleSlug && /football|live-odds|sportsbook|sport/i.test(articleSlug),
  );
  // 非体育文：世界杯 Banner 换成支付条；体育文换成原站真实体育图
  let next = isSports
    ? applyMediaSwaps(html, SPORTS_MEDIA_SWAPS)
    : applyMediaSwaps(html, MEDIA_SWAPS);
  if (articleSlug && /bank|withdraw/i.test(articleSlug)) {
    next = applyMediaSwaps(next, BANKING_MEDIA_SWAPS);
  }
  if (articleSlug && /lottery|4d|number-games|responsible-lottery/i.test(articleSlug)) {
    next = applyMediaSwaps(next, LOTTERY_MEDIA_SWAPS);
  }
  return next;
}

function stripLeadingImgs(html: string): string {
  return html.replace(
    /^(?:\s*<p>\s*)?(?:\s*<img\b[^>]*>\s*)+(?:\s*<\/p>\s*)?/i,
    "",
  );
}

/** 去掉与封面相同的图，避免文章里出现两张一样的 */
function stripDuplicateCoverImgs(
  html: string,
  coverPath?: string,
  articleSlug?: string,
): string {
  let next = stripLeadingImgs(scrubCmsHtml(sanitizeArticleHtml(html, articleSlug)));
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
    ? linkifyHtml(
        stripDuplicateCoverImgs(article.html, cover, article.slug),
        KEYWORD_LINKS,
      )
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
