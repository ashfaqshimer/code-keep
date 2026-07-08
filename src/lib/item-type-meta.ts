/**
 * Presentation metadata for the seven system item types.
 *
 * mock-data stores each type's icon as a Lucide name string; this maps the
 * slug to the actual icon component so the UI can render it type-safely.
 * Colors are derived from mock-data so it stays the single source of truth.
 */
import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { itemTypes, type ItemTypeSlug } from "@/lib/mock-data";

export const itemTypeIcons: Record<ItemTypeSlug, LucideIcon> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: StickyNote,
  link: Link,
  file: File,
  image: Image,
};

export const itemTypeColors = Object.fromEntries(
  itemTypes.map((type) => [type.slug, type.color]),
) as Record<ItemTypeSlug, string>;
