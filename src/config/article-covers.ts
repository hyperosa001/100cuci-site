/**
 * 文章封面 = 原站 100cuci.com CDN 克隆图（public/media）。
 * 完整显示、等比缩放，不裁切（CSS object-fit: contain）。
 * 同时收录「建议 slug」与 WordPress 自动生成的实际 slug。
 */
export const ARTICLE_COVERS: Record<string, string> = {
  // Casino
  "live-casino-first-session-100cuci": "/media/7a68e80182196c00919f4.png",
  "100cuci-live-casino-malaysia-first-session-checklist":
    "/media/7a68e80182196c00919f4.png",
  "100cuci-casino-banking-withdrawal": "/media/5165631054b96399427ff.png",
  "casino-banking-withdrawal-at-100cuci-casino-malaysia-guide":
    "/media/31081511821962ba4e3a6.png",

  // Slots
  "jili-mega888-start-100cuci": "/media/62f867f8764a68724ee87.png",
  "slots-jili-mega888-style-slots-at-100cuci-new-member-start-guide":
    "/media/62f867f8764a68724ee87.png",
  "slot-free-credit-malaysia-100cuci": "/media/ba426dcef62a678dcc70a.webp",
  "slot-free-credit-malaysia-using-it-wisely-at-100cuci":
    "/media/ba426dcef62a678dcc70a.webp",

  // Sportsbook — only origin CDN sports assets (real sportsbook / soccer UI art)
  "football-betting-malaysia-100cuci": "/media/3bc80be352f36.jpg",
  "football-betting-malaysia-on-100cuci-sportsbook":
    "/media/3bc80be352f36.jpg",
  "live-odds-basics-100cuci": "/media/45b8316bdbd96e2b5cc20.png",
  "live-odds-basics-for-malaysian-players-at-100cuci":
    "/media/45b8316bdbd96e2b5cc20.png",

  // Lottery — number / lucky-draw style (not promo commission banners)
  "4d-lottery-guide-100cuci": "/media/125476a9d51965d355fb4.png",
  "4d-number-games-at-100cuci-beginner-guide":
    "/media/125476a9d51965d355fb4.png",
  "lottery-responsible-play-100cuci": "/media/2636a9355b896f5d3413b.png",
  "responsible-lottery-habits-for-100cuci-members":
    "/media/2636a9355b896f5d3413b.png",

  // Promotions — welcome + commission (distinct from lottery)
  "free-credit-no-deposit-100cuci-guide": "/media/b0dc9b63d88967e6859cb.webp",
  "free-credit-no-deposit-at-100cuci-new-member-guide-2026":
    "/media/b0dc9b63d88967e6859cb.webp",
  "referral-daily-rewards-100cuci": "/media/f85eb31f3219680b10ca3.gif",
  "referral-daily-rewards-growing-playable-credit-at-100cuci":
    "/media/f85eb31f3219680b10ca3.gif",
};

/** 栏目列表无 slug 匹配时的兜底图（同样来自原站 CDN） */
export const CATEGORY_COVERS: Record<string, string> = {
  casino: "/media/7a68e80182196c00919f4.png",
  slots: "/media/62f867f8764a68724ee87.png",
  sportsbook: "/media/3bc80be352f36.jpg",
  lottery: "/media/125476a9d51965d355fb4.png",
  promotions: "/media/f85eb31f3219680b10ca3.gif",
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
