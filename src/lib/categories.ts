import { Category } from "./types";

export const CATEGORIES: Category[] = [
  { id: "trending", title: "Em Alta" },
  { id: "action", title: "Ação", genreId: 28 },
  { id: "comedy", title: "Comédia", genreId: 35 },
  { id: "horror", title: "Terror", genreId: 27 },
  { id: "drama", title: "Drama", genreId: 18 },
  { id: "scifi", title: "Ficção Científica", genreId: 878 },
  { id: "animation", title: "Animação", genreId: 16 },
  { id: "romance", title: "Romance", genreId: 10749 },
  { id: "thriller", title: "Suspense", genreId: 53 },
  { id: "documentary", title: "Documentários", genreId: 99 },
  { id: "fantasy", title: "Fantasia", genreId: 14 },
  { id: "crime", title: "Crime", genreId: 80 },
];

export const KIDS_CATEGORIES: Category[] = [
  { id: "trending", title: "Em Alta" },
  { id: "animation", title: "Animação", genreId: 16 },
  { id: "family", title: "Família", genreId: 10751 },
  { id: "comedy", title: "Comédia", genreId: 35 },
  { id: "adventure", title: "Aventura", genreId: 12 },
  { id: "fantasy", title: "Fantasia", genreId: 14 },
];

export function getCategoryBatch(
  startIndex: number,
  count: number,
  categories: Category[] = CATEGORIES
): Category[] {
  const result: Category[] = [];
  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % categories.length;
    const category = categories[index];
    const page = Math.floor((startIndex + i) / categories.length) + 1;
    result.push({
      ...category,
      id: `${category.id}-${page}`,
    });
  }
  return result;
}

export function getCategoryPage(categoryId: string): number {
  const match = categoryId.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

export function getBaseCategoryId(categoryId: string): string {
  return categoryId.replace(/-\d+$/, "");
}
