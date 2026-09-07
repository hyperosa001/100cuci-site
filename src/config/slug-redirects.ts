/**
 * Old planned slugs (docs/_meta) → live WordPress slugs on the front site.
 * 301 so GSC / bookmarks / wrong internal links still reach the right article.
 */
export const LEGACY_ARTICLE_SLUG_REDIRECTS: ReadonlyArray<{
  category: string;
  from: string;
  to: string;
}> = [
  {
    category: "casino",
    from: "live-casino-first-session-100cuci",
    to: "100cuci-live-casino-malaysia-first-session-checklist",
  },
  {
    category: "casino",
    from: "100cuci-casino-banking-withdrawal",
    to: "casino-banking-withdrawal-at-100cuci-casino-malaysia-guide",
  },
  {
    category: "slots",
    from: "jili-mega888-start-100cuci",
    to: "slots-jili-mega888-style-slots-at-100cuci-new-member-start-guide",
  },
  {
    category: "slots",
    from: "slot-free-credit-malaysia-100cuci",
    to: "slot-free-credit-malaysia-using-it-wisely-at-100cuci",
  },
  {
    category: "sportsbook",
    from: "football-betting-malaysia-100cuci",
    to: "football-betting-malaysia-on-100cuci-sportsbook",
  },
  {
    category: "sportsbook",
    from: "live-odds-basics-100cuci",
    to: "live-odds-basics-for-malaysian-players-at-100cuci",
  },
  {
    category: "lottery",
    from: "4d-lottery-guide-100cuci",
    to: "4d-number-games-at-100cuci-beginner-guide",
  },
  {
    category: "lottery",
    from: "lottery-responsible-play-100cuci",
    to: "responsible-lottery-habits-for-100cuci-members",
  },
  {
    category: "promotions",
    from: "free-credit-no-deposit-100cuci-guide",
    to: "free-credit-no-deposit-at-100cuci-new-member-guide-2026",
  },
  {
    category: "promotions",
    from: "referral-daily-rewards-100cuci",
    to: "referral-daily-rewards-growing-playable-credit-at-100cuci",
  },
];
