import Link from "next/link";
import { Folder, Star } from "lucide-react";

import { itemTypeIcons, itemTypesBySlug } from "@/lib/item-type-meta";
import type { Collection } from "@/lib/mock-data";

interface CollectionCardProps {
  collection: Collection;
}

/**
 * Collection card, background-tinted by its dominant item type. Shows a colored
 * icon tile, name, description, and a footer with item count and last update.
 */
export function CollectionCard({ collection }: CollectionCardProps) {
  const type = itemTypesBySlug[collection.dominantType];
  const Icon = itemTypeIcons[collection.dominantType];

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex min-h-44 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-ring"
      style={{
        backgroundImage: `linear-gradient(135deg, ${type.color}1f, transparent 60%)`,
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex size-11 items-center justify-center rounded-lg"
          style={{ color: type.color, backgroundColor: `${type.color}26` }}
        >
          <Icon className="size-5" />
        </span>
        {collection.isFavorite && (
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
        )}
      </div>

      <h3 className="mt-4 font-semibold leading-tight">{collection.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {collection.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Folder className="size-3.5" />
          {collection.itemCount} items
        </span>
        <span>{collection.updatedLabel}</span>
      </div>
    </Link>
  );
}
