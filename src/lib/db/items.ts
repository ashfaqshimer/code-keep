/**
 * Item data-fetching for the dashboard.
 *
 * Reads items for the current user (the seeded demo user until auth lands) and
 * shapes them for the dashboard's Pinned cards and Recent list. The item type
 * is keyed by its slug, which matches the `ItemType.name` stored in the DB.
 */
import "server-only";

import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import { itemTypes, type ItemTypeSlug } from "@/lib/mock-data";

// No auth yet — everything is scoped to the seeded demo user.
const DEMO_EMAIL = "demo@codekeep.io";

export interface DashboardItem {
  id: string;
  title: string;
  /** System item type slug; matches the `ItemType.name` stored in the DB. */
  type: ItemTypeSlug;
  description?: string;
  /** Text content for snippet/prompt/note/command items. */
  content?: string;
  /** Syntax-highlighting hint, e.g. "typescript". */
  language?: string;
  /** URL for link items. */
  url?: string;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  /** Relative time since last update, e.g. "2h ago". */
  updatedLabel: string;
}

// Row shape shared by both queries below.
const itemSelect = {
  id: true,
  title: true,
  content: true,
  language: true,
  url: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  updatedAt: true,
  itemType: { select: { name: true } },
  tags: { select: { name: true } },
} as const;

type ItemRow = {
  id: string;
  title: string;
  content: string | null;
  language: string | null;
  url: string | null;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  itemType: { name: string };
  tags: { name: string }[];
};

function toDashboardItem(row: ItemRow): DashboardItem {
  return {
    id: row.id,
    title: row.title,
    type: row.itemType.name as ItemTypeSlug,
    description: row.description ?? undefined,
    content: row.content ?? undefined,
    language: row.language ?? undefined,
    url: row.url ?? undefined,
    tags: row.tags.map((tag) => tag.name),
    isFavorite: row.isFavorite,
    isPinned: row.isPinned,
    updatedLabel: formatRelativeTime(row.updatedAt),
  };
}

/**
 * The demo user's pinned items, newest-updated first, shaped for the dashboard
 * item cards. Empty when the user has no pinned items.
 */
export async function getPinnedItems(): Promise<DashboardItem[]> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { userId: user.id, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: itemSelect,
  });

  return items.map(toDashboardItem);
}

/**
 * The demo user's most-recently-updated items, capped at `limit`, shaped for
 * the dashboard recent-items list.
 */
export async function getRecentItems(limit: number): Promise<DashboardItem[]> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (!user) return [];

  const items = await prisma.item.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: itemSelect,
  });

  return items.map(toDashboardItem);
}

/**
 * Aggregate item counts for the demo user, driving the dashboard stat tiles.
 */
export async function getItemStats(): Promise<{
  total: number;
  favorites: number;
}> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (!user) return { total: 0, favorites: 0 };

  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
  ]);

  return { total, favorites };
}

/** An all-slugs-present count record initialized to zero. */
function emptyTypeCounts(): Record<ItemTypeSlug, number> {
  return Object.fromEntries(
    itemTypes.map((type) => [type.slug, 0]),
  ) as Record<ItemTypeSlug, number>;
}

/**
 * Per-type item counts for the demo user, keyed by item-type slug
 * (`ItemType.name`). Every system slug is present, defaulting to 0, so the
 * sidebar can look up each type's badge count directly. Drives the sidebar
 * Library counts (previously the mock `itemTypes[].count`).
 */
export async function getItemTypeCounts(): Promise<Record<ItemTypeSlug, number>> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (!user) return emptyTypeCounts();

  const rows = await prisma.item.findMany({
    where: { userId: user.id },
    select: { itemType: { select: { name: true } } },
  });

  const counts = emptyTypeCounts();
  for (const row of rows) {
    const slug = row.itemType.name as ItemTypeSlug;
    if (slug in counts) counts[slug] += 1;
  }
  return counts;
}
