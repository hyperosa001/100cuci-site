/**
 * 文章封面 = 原站 100cuci.com CDN 克隆图（public/media）。
 * 完整显示、等比缩放，不裁切（CSS object-fit: contain）。
 */
export const ARTICLE_COVERS: Record<string, string> = {
  "live-casino-first-session-100cuci": "/media/7a68e80182196c00919f4.png",
  "100cuci-casino-banking-withdrawal": "/media/5165631054b96399427ff.png",
  "banking-withdrawal-at-100cuci-casino-malaysia-guide": "/media/5165631054b96399427ff.png",
  "jili-mega888-start-100cuci": "/media/62f867f8764a68724ee87.png",
  "slot-free-credit-malaysia-100cuci": "/media/ba426dcef62a678dcc70a.webp",
  "football-betting-malaysia-100cuci": "/media/18008343353a64f8a4481.png",
  "live-odds-basics-100cuci": "/media/a2629340ed2a69e4fa4c7.webp",
  "4d-lottery-guide-100cuci": "/media/125476a9d51965d355fb4.png",
  "lottery-responsible-play-100cuci": "/media/9a34856f321963f19982f.gif",
  "free-credit-no-deposit-100cuci-guide": "/media/b0dc9b63d88967e6859cb.webp",
  "referral-daily-rewards-100cuci": "/media/f85eb31f3219680b10ca3.gif",
};

/** 栏目列表无 slug 匹配时的兜底图（同样来自原站 CDN） */
export const CATEGORY_COVERS: Record<string, string> = {
  casino: "/media/7a68e80182196c00919f4.png",
  slots: "/media/62f867f8764a68724ee87.png",
  sportsbook: "/media/18008343353a64f8a4481.png",
  lottery: "/media/125476a9d51965d355fb4.png",
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
