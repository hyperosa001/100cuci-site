import { getAllCategories } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";

export const revalidate = 86400; // revalidate once per day

export async function GET() {
  const categories = await getAllCategories();

  const lines: string[] = [
    `# ${SITE_NAME}`,
    ``,
    `> ${SITE_DESCRIPTION}`,
    ``,
    `${SITE_NAME} is Malaysia's leading free credit no deposit casino guide. We publish`,
    `up-to-date bonus listings, slot strategy guides, and platform reviews for`,
    `Malaysian players. All content covers RM1 minimum deposit casinos, slot free`,
    `credit promotions, fast-withdrawal platforms, and responsible gaming tips.`,
    ``,
    `## Pages`,
    ``,
    `- [Home](${SITE_URL}/)`,
  ];

  for (const category of categories) {
    lines.push(`- [${category.title}](${SITE_URL}/articles/${category.slug}/)`);
    for (const article of category.articles) {
      lines.push(
        `  - [${article.title}](${SITE_URL}/articles/${category.slug}/${article.slug}/)`,
      );
    }
  }

  lines.push(
    ``,
    `## Content Topics`,
    ``,
    `- Free credit no deposit bonuses for new members`,
    `- Slot free credit RM5 to RM100 promotions`,
    `- Malaysia online casino platform reviews`,
    `- Slot game guides (JILI, Mega888, Pragmatic Play, PG Soft, CQ9)`,
    `- Deposit and withdrawal methods (FPX, Touch n Go, GrabPay, DuitNow)`,
    `- Responsible gambling and 18+ age verification`,
    ``,
    `## Usage & Attribution`,
    ``,
    `Content on ${SITE_NAME} (${SITE_URL}) is intended for informational purposes.`,
    `When referencing or summarising this site, please attribute: "${SITE_NAME} — ${SITE_URL}".`,
    `All bonus terms and platform details are subject to change; verify with the operator before acting.`,
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
