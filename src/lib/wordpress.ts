import type { Article, Category } from "@/content/types";

export const CONTENT_REVALIDATE_SECONDS = 60;

const CATEGORY_SHELLS: Omit<Category, "articles">[] = [
  {
    slug: "casino",
    title: "Casino",
    description:
      "Live casino, online casino Malaysia guides, registration, banking and safety at 100CUCI.",
  },
  {
    slug: "slots",
    title: "Slots",
    description:
      "Slot Malaysia guides — JILI, MEGA888, Pragmatic Play and free credit slot play.",
  },
  {
    slug: "sportsbook",
    title: "Sportsbook",
    description:
      "Sports betting Malaysia — football, live odds and how to bet at 100CUCI.",
  },
  {
    slug: "lottery",
    title: "Lottery",
    description:
      "4D, lottery games and number betting guides for 100CUCI members.",
  },
  {
    slug: "promotions",
    title: "Promotions",
    description:
      "Free credit no deposit, daily rewards, referral bonus and latest 100CUCI promos.",
  },
];

/** WP 后台实际 slug → 前端栏目 slug（兼容拼写/复数） */
const WP_CATEGORY_SLUG_ALIASES: Record<string, string[]> = {
  sportsbook: ["sportsbook", "sportbooks", "sportbook", "sports"],
};

/** 固定五个栏目之后的新栏目顺序；其余按名称排 */
const EXTRA_CATEGORY_ORDER = ["about-us", "contact-us", "faq"];

const EXTRA_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "about-us":
    "Who 100CUCI is, how these guides are written, and what this site covers.",
  "contact-us":
    "How to reach 100CUCI support and where to send editorial inquiries.",
  faq: "Common questions about 100CUCI accounts, bonuses, banking, and play.",
};

function extraCategoryRank(slug: string): number {
  const index = EXTRA_CATEGORY_ORDER.indexOf(slug);
  return index === -1 ? EXTRA_CATEGORY_ORDER.length : index;
}

type WpCategory = {
  id: number;
  slug: string;
  name: string;
  description: string;
};

type WpPost = {
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_description?: string;
  };
};

function resolveWpRest(): string | null {
  const rest = process.env.WP_REST_URL?.trim().replace(/\/$/, "");
  if (rest) return rest;
  const site = process.env.WORDPRESS_URL?.trim().replace(/\/$/, "");
  if (site) return `${site}/wp-json`;
  return null;
}

function resolveWpCategory(
  bySlug: Map<string, WpCategory>,
  shellSlug: string,
): WpCategory | undefined {
  const candidates = WP_CATEGORY_SLUG_ALIASES[shellSlug] ?? [shellSlug];
  for (const candidate of candidates) {
    const hit = bySlug.get(candidate);
    if (hit) return hit;
  }
  return undefined;
}

export function isWordpressLive(): boolean {
  return Boolean(resolveWpRest());
}

async function wpFetch<T>(path: string): Promise<T | null> {
  const base = resolveWpRest();
  if (!base) return null;

  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: CONTENT_REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`[wordpress] ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`[wordpress] fetch failed: ${url}`, error);
    return null;
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function mapPost(post: WpPost): Article {
  const yoast = post.yoast_head_json ?? {};
  const excerpt = stripHtml(post.excerpt.rendered);
  return {
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: excerpt || stripHtml(post.content.rendered).slice(0, 160),
    updatedAt: formatUpdatedAt(post.modified || post.date),
    html: post.content.rendered,
    yoastTitle: yoast.title,
    yoastDescription: yoast.description ?? yoast.og_description,
  };
}

/** 运行时从 WordPress 拉栏目文章（CMS 发文后约 60 秒上站，无需 git push） */
export async function fetchCategoriesLive(): Promise<Category[]> {
  const empty = CATEGORY_SHELLS.map((shell) => ({ ...shell, articles: [] }));

  if (!isWordpressLive()) return empty;

  const cats = await wpFetch<WpCategory[]>(
    "/wp/v2/categories?per_page=100&hide_empty=false",
  );
  if (!cats) return empty;

  const bySlug = new Map(cats.map((c) => [c.slug, c]));
  const categories: Category[] = [];
  const usedIds = new Set<number>();

  for (const shell of CATEGORY_SHELLS) {
    const wpCat = resolveWpCategory(bySlug, shell.slug);
    if (!wpCat) {
      categories.push({ ...shell, articles: [] });
      continue;
    }

    usedIds.add(wpCat.id);
    const posts = await wpFetch<WpPost[]>(
      `/wp/v2/posts?categories=${wpCat.id}&per_page=100&status=publish`,
    );

    categories.push({
      slug: shell.slug,
      title: shell.title,
      description: stripHtml(wpCat.description ?? "") || shell.description,
      articles: (posts ?? []).map(mapPost),
    });
  }

  const extras = cats
    .filter((cat) => !usedIds.has(cat.id) && cat.slug !== "uncategorized")
    .sort((a, b) => {
      const rank = extraCategoryRank(a.slug) - extraCategoryRank(b.slug);
      if (rank !== 0) return rank;
      return a.name.localeCompare(b.name);
    });

  for (const wpCat of extras) {
    const posts = await wpFetch<WpPost[]>(
      `/wp/v2/posts?categories=${wpCat.id}&per_page=100&status=publish`,
    );
    if (!posts || posts.length === 0) continue;

    const title = stripHtml(wpCat.name) || wpCat.slug;
    categories.push({
      slug: wpCat.slug,
      title,
      description:
        stripHtml(wpCat.description ?? "") ||
        EXTRA_CATEGORY_DESCRIPTIONS[wpCat.slug] ||
        `${title} guides published on 100CUCI.`,
      articles: posts.map(mapPost),
    });
  }

  return categories;
}

export type SiteLinksLive = { login: string; register: string };

export async function fetchSiteLinksLive(
  fallback: SiteLinksLive,
): Promise<SiteLinksLive> {
  const data = await wpFetch<{ login_url?: string; register_url?: string }>(
    "/cuci/v1/site-links",
  );
  if (!data) return fallback;
  return {
    login: String(data.login_url ?? "").trim() || fallback.login,
    register: String(data.register_url ?? "").trim() || fallback.register,
  };
}
