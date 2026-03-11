import type { SearchableItem } from './types';

export function scoreItem(item: SearchableItem, query: string): number {
  if (!query) return 100;

  const q = query.toLowerCase();
  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const terms = item.searchTerms?.map((t) => t.toLowerCase()) ?? [];

  if (title === q) return 100;
  if (title.startsWith(q)) return 90;

  const titleWords = title.split(/\s+/);
  if (titleWords.some((w) => w.startsWith(q))) return 80;

  if (terms.some((t) => t === q)) return 70;
  if (terms.some((t) => t.startsWith(q))) return 60;

  if (title.includes(q)) return 40;
  if (terms.some((t) => t.includes(q))) return 30;
  if (description.includes(q)) return 20;

  return 0;
}

export function filterAndRankItems<T extends SearchableItem>(
  items: T[],
  query: string,
): T[] {
  if (!query.trim()) return items;

  const scored = items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter(({ score }) => score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.map(({ item }) => item);
}
