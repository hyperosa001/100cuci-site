/**
 * Sync WordPress content → content/*.json before build.
 * Same pipeline as 96m-site: public REST only (no auth for published content).
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
mkdirSync(contentDir, { recursive: true });

/** Prefer WP_REST_URL (96m style). Also accept WORDPRESS_URL as site root. */
function resolveWpRest() {
  const rest = process.env.WP_REST_URL?.trim().replace(/\/$/, "");
  if (rest) return rest;
  const site = process.env.WORDPRESS_URL?.trim().replace(/\/$/, "");
  if (site) return `${site}/wp-json`;
  return "";
}

const WP_REST = resolveWpRest();
const siteLinksPath = join(contentDir, "site-links.json");

/** Fixed hubs matching top nav — always present even if WP category empty */
const CATEGORY_SHELLS = [
  {
    slug: "casino",
    title: "Casino",
    description:
      "Live casino first-session checklists, FPX/e-wallet banking, and withdrawal timing — written for 100CUCI members in Malaysia.",
  },
  {
    slug: "slots",
    title: "Slots",
    description:
      "JILI, MEGA888-style rooms, and slot free credit guides — stake plans tied to 100CUCI Promotions eligibility.",
  },
  {
    slug: "sportsbook",
    title: "Sportsbook",
    description:
      "Football betting Malaysia and live-odds discipline on 100CUCI — unit stakes, promo checks, mobile latency tips.",
  },
  {
    slug: "lottery",
    title: "Lottery",
    description:
      "4D-style number games and responsible caps for 100CUCI — cut-offs, ticket screenshots, weekly budgets.",
  },
  {
    slug: "promotions",
    title: "Promotions",
    description:
      "Free credit no deposit, RM5 register path, referral and daily rewards — 100CUCI claim rules for 2026.",
  },
];

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
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

function parseBlocks(content = "") {
  const paragraphs = [];
  const list = [];
  const pMatches = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? [];
  for (const block of pMatches) {
    const text = stripHtml(block);
    if (text) paragraphs.push(text);
  }
  const liMatches = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) ?? [];
  for (const block of liMatches) {
    const text = stripHtml(block);
    if (text) list.push(text);
  }
  if (paragraphs.length === 0 && content) {
    const plain = stripHtml(content);
    if (plain) paragraphs.push(plain);
  }
  return { paragraphs, list };
}

function formatUpdatedAt(iso) {
  if (!iso) return "July 2026";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso).slice(0, 10);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

async function syncSiteLinks() {
  const fallback = readJson(siteLinksPath, { login: "", register: "" });
  if (!WP_REST) return fallback;

  try {
    const data = await fetchJson(`${WP_REST}/cuci/v1/site-links`);
    const fromWp = {
      login: String(data.login_url ?? data.login ?? "").trim(),
      register: String(data.register_url ?? data.register ?? "").trim(),
    };
    const next = {
      login: fromWp.login || fallback.login || "",
      register: fromWp.register || fallback.register || "",
    };
    writeJson(siteLinksPath, next);
    console.log(
      "[sync] site-links:",
      next.login ? "login set" : "login empty",
      "|",
      next.register ? "register set" : "register empty",
      fromWp.login || fromWp.register ? "(from WP)" : "(kept local)",
    );
    return next;
  } catch (err) {
    console.warn("[sync] site-links skipped:", err.message);
    return fallback;
  }
}

async function syncCategories() {
  const outPath = join(contentDir, "categories.json");
  const fallback = readJson(outPath, {
    categories: CATEGORY_SHELLS.map((s) => ({ ...s, articles: [] })),
  });

  if (!WP_REST) {
    console.log("[sync] WP_REST_URL not set — using local content/categories.json");
    return fallback;
  }

  try {
    const cats = await fetchJson(
      `${WP_REST}/wp/v2/categories?per_page=100&hide_empty=false`,
    );
    const bySlug = new Map(cats.map((c) => [c.slug, c]));

    const categories = [];

    for (const shell of CATEGORY_SHELLS) {
      const wpCat = bySlug.get(shell.slug);
      if (!wpCat) {
        categories.push({ ...shell, articles: [] });
        continue;
      }

      const posts = await fetchJson(
        `${WP_REST}/wp/v2/posts?categories=${wpCat.id}&per_page=100&status=publish&_embed`,
      );

      const articles = posts.map((post) => {
        const yoast = post.yoast_head_json ?? {};
        const html = String(post.content?.rendered ?? "").trim();
        const { paragraphs, list } = parseBlocks(html);
        return {
          slug: post.slug,
          title: stripHtml(post.title?.rendered ?? post.slug),
          excerpt: stripHtml(
            post.excerpt?.rendered ?? yoast.og_description ?? "",
          ),
          updatedAt: formatUpdatedAt(post.modified ?? post.date),
          html: html || undefined,
          paragraphs: paragraphs.length ? paragraphs : undefined,
          list: list.length ? list : undefined,
          yoastTitle: yoast.title ?? undefined,
          yoastDescription:
            yoast.description ?? yoast.og_description ?? undefined,
        };
      });

      categories.push({
        slug: shell.slug,
        title: shell.title,
        description: stripHtml(wpCat.description ?? "") || shell.description,
        articles,
      });
    }

    const payload = { categories };
    writeJson(outPath, payload);
    const total = categories.reduce((n, c) => n + c.articles.length, 0);
    console.log(`[sync] categories: ${categories.length} hubs (${total} articles)`);
    return payload;
  } catch (err) {
    console.warn("[sync] categories skipped:", err.message);
    return fallback;
  }
}

async function syncHomepageSeo() {
  const outPath = join(contentDir, "homepage-seo.json");
  const fallback = readJson(outPath, {});

  if (!WP_REST) {
    console.log("[sync] WP_REST_URL not set — using local content/homepage-seo.json");
    return fallback;
  }

  try {
    const pages = await fetchJson(
      `${WP_REST}/wp/v2/pages?slug=homepage-seo&status=publish`,
    );
    const page = pages[0];
    if (!page) {
      console.warn("[sync] homepage-seo page not found — keeping local fallback");
      return fallback;
    }

    const { paragraphs } = parseBlocks(page.content?.rendered ?? "");
    const payload = {
      ...fallback,
      lastUpdated: formatUpdatedAt(page.modified),
      sections: [
        {
          title: stripHtml(page.title?.rendered ?? "100CUCI"),
          paragraphs,
        },
      ],
      faq: fallback.faq ?? [],
    };
    writeJson(outPath, payload);
    console.log("[sync] homepage-seo updated");
    return payload;
  } catch (err) {
    console.warn("[sync] homepage-seo skipped:", err.message);
    return fallback;
  }
}

await syncSiteLinks();
await syncCategories();
await syncHomepageSeo();

console.log("[sync] done");
