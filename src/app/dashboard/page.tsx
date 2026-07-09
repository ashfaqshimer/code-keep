import type { Metadata } from "next";
import { Clock, FolderHeart, LayoutGrid, Library, Pin, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/collection-card";
import { ItemCard } from "@/components/dashboard/item-card";
import { RecentItemRow } from "@/components/dashboard/recent-item-row";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardCollections } from "@/lib/db/collections";
import { getItemStats, getPinnedItems, getRecentItems } from "@/lib/db/items";

export const metadata: Metadata = {
  title: "Dashboard · CodeKeep",
};

// Render per request so collection data reflects the live database rather than
// being baked in at build time.
export const dynamic = "force-dynamic";

// How many of the most-recent items to surface.
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  const [collections, pinnedItems, recentItems, itemStats] = await Promise.all([
    getDashboardCollections(),
    getPinnedItems(),
    getRecentItems(RECENT_ITEMS_LIMIT),
    getItemStats(),
  ]);

  const stats = {
    items: itemStats.total,
    collections: collections.length,
    favoriteItems: itemStats.favorites,
    favoriteCollections: collections.filter((c) => c.isFavorite).length,
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Items" value={stats.items} icon={Library} />
        <StatCard
          label="Collections"
          value={stats.collections}
          icon={LayoutGrid}
        />
        <StatCard
          label="Favorite items"
          value={stats.favoriteItems}
          icon={Star}
        />
        <StatCard
          label="Favorite collections"
          value={stats.favoriteCollections}
          icon={FolderHeart}
        />
      </section>

      {/* Pinned items */}
      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader icon={Pin} title="Pinned" count={pinnedItems.length} />
          <div className="grid gap-4 md:grid-cols-2">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Collections */}
      <section>
        <SectionHeader
          icon={LayoutGrid}
          title="Collections"
          count={collections.length}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Recent items */}
      <section>
        <SectionHeader icon={Clock} title="Recent items" />
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {recentItems.map((item) => (
            <RecentItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
