import Link from "next/link";
import { categoryUrl } from "@/lib/content";

export function ArticlePagination({
  categorySlug,
  currentPage,
  totalPages,
}: {
  categorySlug: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="lp-pagination" aria-label="Article pages">
      {currentPage > 1 ? (
        <Link href={categoryUrl(categorySlug, currentPage - 1)} className="lp-pagination-btn">
          ← Previous
        </Link>
      ) : (
        <span className="lp-pagination-btn lp-pagination-btn-disabled">← Previous</span>
      )}

      <div className="lp-pagination-pages">
        {pages.map((page) => (
          <Link
            key={page}
            href={categoryUrl(categorySlug, page)}
            className={`lp-pagination-page${page === currentPage ? " is-active" : ""}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link href={categoryUrl(categorySlug, currentPage + 1)} className="lp-pagination-btn">
          Next →
        </Link>
      ) : (
        <span className="lp-pagination-btn lp-pagination-btn-disabled">Next →</span>
      )}
    </nav>
  );
}
