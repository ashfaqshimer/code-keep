import type { CSSProperties } from "react";
import Link from "next/link";
import { Folder, Star } from "lucide-react";

import type { DashboardCollection } from "@/lib/db/collections";
import { itemTypeColors, itemTypeIcons } from "@/lib/item-type-meta";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: DashboardCollection;
}

/**
 * Collection card. Its border color and icon tile are derived from the
 * collection's dominant (most-used) item type, with a matching background tint.
 * The footer lists a small icon for every item type the collection contains.
 */
export function CollectionCard({ collection }: CollectionCardProps) {
  const { dominantType, types } = collection;
  const dominantColor = dominantType ? itemTypeColors[dominantType] : null;
  const Icon = dominantType ? itemTypeIcons[dominantType] : Folder;

  const style: CSSProperties = dominantColor
    ? ({
        "--type-color": dominantColor,
        backgroundImage: `linear-gradient(135deg, ${dominantColor}1f, transparent 60%)`,
      } as CSSProperties)
    : {};

  return (
    <Link
      href={`/collections/${collection.id}`}
      style={style}
      className={cn(
        "group flex min-h-44 flex-col rounded-xl border bg-card p-5 transition-colors",
        dominantColor
          ? "[border-color:color-mix(in_oklab,var(--type-color)_35%,transparent)] hover:[border-color:color-mix(in_oklab,var(--type-color)_70%,transparent)]"
          : "border-border hover:border-ring",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex size-11 items-center justify-center rounded-lg"
          style={
            dominantColor
              ? { color: dominantColor, backgroundColor: `${dominantColor}26` }
              : undefined
          }
        >
          <Icon className="size-5" />
        </span>
        {collection.isFavorite && (
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
        )}
      </div>

      <h3 className="mt-4 font-semibold leading-tight">{collection.name}</h3>
      {collection.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {collection.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          {types.length > 0 ? (
            <span className="flex items-center gap-1">
              {types.map((type) => {
                const TypeIcon = itemTypeIcons[type];
                return (
                  <TypeIcon
                    key={type}
                    className="size-3.5"
                    style={{ color: itemTypeColors[type] }}
                  />
                );
              })}
            </span>
          ) : (
            <Folder className="size-3.5" />
          )}
          <span>
            {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
          </span>
        </span>
        <span>Updated {collection.updatedLabel}</span>
      </div>
    </Link>
  );
}
