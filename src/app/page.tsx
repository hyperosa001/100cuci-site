import { LandingPage } from "@/components/LandingPage";
import { CONTENT_REVALIDATE_SECONDS, getAllCategories } from "@/lib/content";

export const revalidate = CONTENT_REVALIDATE_SECONDS;

export default async function Home() {
  const categories = await getAllCategories();
  return <LandingPage categories={categories} />;
}
