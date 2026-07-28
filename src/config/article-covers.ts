/**
 * 文章封面 = 原站 100cuci.com CDN 克隆图（public/media）。
 * 完整显示、等比缩放，不裁切（CSS object-fit: contain）。
 */
export const ARTICLE_COVERS: Record<string, string> = {
  "live-casino-first-session-100cuci": "/media/7a68e80182196c00919f4.png",
  "100cuci-casino-banking-withdrawal": "/media/1ab4589f3219601fbb7cd.png",
  // WP 若用标题自动生成 slug，也覆盖
  "banking-withdrawal-at-100cuci-casino-malaysia-guide": "/media/1ab4589f3219601fbb7cd.png",
  "100cuci-casino-banking-withdrawal-malaysia-guide": "/media/1ab4589f3219601fbb7cd.png",
  "jili-mega888-start-100cuci": "/media/62f867f8764a68724ee87.png",
  "slot-free-credit-malaysia-100cuci": "/media/cf8789d8764a6e04830fa.png",
  "football-betting-malaysia-100cuci": "/media/e22f2ef8764a6d3b0a117.png",
  "live-odds-basics-100cuci": "/media/0eae92f8764a601b27c2e.png",
  "4d-lottery-guide-100cuci": "/media/18008343353a64f8a4481.png",
  "lottery-responsible-play-100cuci": "/media/2636a9355b896f5d3413b.png",
  "free-credit-no-deposit-100cuci-guide": "/media/b0dc9b63d88967e6859cb.webp",
  "referral-daily-rewards-100cuci": "/media/5165631054b96399427ff.png",
};

/** 栏目列表无 slug 匹配时的兜底图（同样来自原站 CDN） */
export const CATEGORY_COVERS: Record<string, string> = {
  casino: "/media/7a68e80182196c00919f4.png",
  slots: "/media/62f867f8764a68724ee87.png",
  sportsbook: "/media/e22f2ef8764a6d3b0a117.png",
  lottery: "/media/18008343353a64f8a4481.png",
  promotions: "/media/b0dc9b63d88967e6859cb.webp",
};

export function getArticleCover(
  articleSlug: string,
  categorySlug?: string,
): string | undefined {
  return (
    ARTICLE_COVERS[articleSlug] ??
    (categorySlug ? CATEGORY_COVERS[categorySlug] : undefined)
  );
}
