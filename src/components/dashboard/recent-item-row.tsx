import { Pin, Star } from "lucide-react";

import { itemTypeIcons, itemTypesBySlug } from "@/lib/item-type-meta";
import type { ItemSummary } from "@/lib/mock-data";

interface RecentItemRowProps {
  item: ItemSummary;
}

/**
 * Compact single-line entry for the "Recent items" list: a colored type icon,
 * the title and description, favorite/pin markers, and a relative timestamp.
 */
export function RecentItemRow({ item }: RecentItemRowProps) {
  const type = itemTypesBySlug[item.type];
  const Icon = itemTypeIcons[item.type];

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-md"
        style={{ color: type.color, backgroundColor: `${type.color}1a` }}
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium">{item.title}</span>
          {item.isPinned && (
            <Pin className="size-3 shrink-0 fill-current text-muted-foreground" />
          )}
          {item.isFavorite && (
            <Star className="size-3 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        {item.description && (
          <p className="truncate text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>

      <span className="shrink-0 text-xs text-muted-foreground">
        {item.updatedLabel}
      </span>
    </div>
  );
}
