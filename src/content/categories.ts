import categoriesData from "../../content/categories.json";
import type { Category } from "@/content/types";
import { normalizeCategories } from "@/lib/normalize-cms-content";

export const CATEGORIES = normalizeCategories(categoriesData.categories as Category[]);
