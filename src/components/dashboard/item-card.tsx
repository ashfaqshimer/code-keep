import { Pin, Star } from "lucide-react";

import { itemTypeIcons, itemTypesBySlug } from "@/lib/item-type-meta";
import type { DashboardItem } from "@/lib/db/items";

interface ItemCardProps {
  item: DashboardItem;
}

/**
 * Rich card for a single item, used in the Pinned section. Color-coded by its
 * type: a left accent border plus a type badge. Text items preview their
 * content (mono for code, plain for prose); link items show their URL.
 */
export function ItemCard({ item }: ItemCardProps) {
  const type = itemTypesBySlug[item.type];
  const Icon = itemTypeIcons[item.type];

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-l-[3px] border-border bg-card p-4"
      style={{ borderLeftColor: type.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
          style={{ color: type.color, backgroundColor: `${type.color}1a` }}
        >
          <Icon className="size-3" />
          {type.name}
        </span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {item.isPinned && <Pin className="size-3.5 fill-current" />}
          {item.isFavorite && (
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          )}
        </div>
      </div>

      <h3 className="font-semibold leading-tight">{item.title}</h3>

      {item.language && item.content ? (
        <pre className="overflow-hidden rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
          <code className="line-clamp-3 whitespace-pre-wrap break-all">
            {item.content}
          </code>
        </pre>
      ) : item.url ? (
        <p className="truncate text-sm text-muted-foreground">{item.url}</p>
      ) : (
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {item.content ?? item.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {item.tags.map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {item.updatedLabel}
        </span>
      </div>
    </div>
  );
}
