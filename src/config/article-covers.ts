/**
 * 文章封面固定在前台（原站克隆图）。
 * CMS 只更新文字；换图需改本文件并部署代码。
 */
export const ARTICLE_COVERS: Record<string, string> = {
  "live-casino-first-session-100cuci": "/media/b0dc9b63d88967e6859cb.webp",
  "100cuci-casino-banking-withdrawal": "/media/1ab4589f3219601fbb7cd.png",
  "jili-mega888-start-100cuci": "/media/0eae92f8764a601b27c2e.png",
  "slot-free-credit-malaysia-100cuci": "/media/cf8789d8764a6e04830fa.png",
  "football-betting-malaysia-100cuci": "/media/62f867f8764a68724ee87.png",
  "live-odds-basics-100cuci": "/media/e22f2ef8764a6d3b0a117.png",
  "4d-lottery-guide-100cuci": "/media/dd267538764a6356b6583.png",
  "lottery-responsible-play-100cuci": "/media/e62a46a7764a6b7535127.png",
  "free-credit-no-deposit-100cuci-guide": "/media/f85eb31f3219680b10ca3.gif",
  "referral-daily-rewards-100cuci": "/media/5165631054b96399427ff.png",
};

/** 栏目列表无 slug 匹配时的兜底图 */
export const CATEGORY_COVERS: Record<string, string> = {
  casino: "/media/b0dc9b63d88967e6859cb.webp",
  slots: "/media/0eae92f8764a601b27c2e.png",
  sportsbook: "/media/62f867f8764a68724ee87.png",
  lottery: "/media/dd267538764a6356b6583.png",
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
