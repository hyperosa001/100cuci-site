import type { Category } from "@/content/types";

/** 没有拉到 CMS 栏目时的顶栏（Home + 五个固定栏目） */
export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Casino", href: "/articles/casino" },
  { label: "Slots", href: "/articles/slots" },
  { label: "Sportsbook", href: "/articles/sportsbook" },
  { label: "Lottery", href: "/articles/lottery" },
  { label: "Promotions", href: "/articles/promotions" },
] as const;

export type NavItem = { label: string; href: string };

/** 顶栏：Home，然后是 CMS 里实际有文章的栏目（含后加的 About / Contact / FAQ） */
export function navFromCategories(
  categories: Pick<Category, "slug" | "title">[],
): NavItem[] {
  return [
    { label: "Home", href: "/" },
    ...categories.map((category) => ({
      label: category.title,
      href: `/articles/${category.slug}`,
    })),
  ];
}
