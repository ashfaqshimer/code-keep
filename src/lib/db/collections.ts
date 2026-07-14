/**
 * Collection data-fetching for the dashboard.
 *
 * Reads collections for the current user (the seeded demo user until auth
 * lands) and derives the presentation fields the dashboard cards need: item
 * count, a relative "updated" label, the dominant (most-used) item type, and
 * the distinct types present. Item types are keyed by their slug, which matches
 * the `ItemType.name` stored in the DB.
 */
import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import { getDemoUserId } from "@/lib/db/user";
import type { ItemTypeSlug } from "@/lib/mock-data";

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Relative time since last update, e.g. "2h ago". */
  updatedLabel: string;
  /** Most-used item type in the collection; null when the collection is empty. */
  dominantType: ItemTypeSlug | null;
  /** Distinct item types present, ordered most-used first (for the type icons). */
  types: ItemTypeSlug[];
}

/**
 * All of the demo user's collections, newest-updated first, shaped for the
 * dashboard collection cards. Wrapped in `cache()` so the dashboard layout
 * (sidebar) and page share a single query per request.
 */
export const getDashboardCollections = cache(async (): Promise<
  DashboardCollection[]
> => {
  const userId = await getDemoUserId();
  if (!userId) return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      updatedAt: true,
      items: {
        select: { item: { select: { itemType: { select: { name: true } } } } },
      },
    },
  });

  return collections.map((collection) => {
    // Tally how many items of each type the collection holds.
    const counts = new Map<string, number>();
    for (const { item } of collection.items) {
      const name = item.itemType.name;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    const byFrequency = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const types = byFrequency.map(([name]) => name as ItemTypeSlug);

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      updatedLabel: formatRelativeTime(collection.updatedAt),
      dominantType: types[0] ?? null,
      types,
    };
  });
});
