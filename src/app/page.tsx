import { LandingPage } from "@/components/LandingPage";
import { getAllCategories } from "@/lib/content";

/** CMS 发文后约 60 秒出现在前台（须为字面量，勿改成变量） */
export const revalidate = 60;

export default async function Home() {
  const categories = await getAllCategories();
  return <LandingPage categories={categories} />;
}
