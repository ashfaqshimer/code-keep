import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  count?: number;
}

/**
 * Section heading used across the dashboard main area: a small icon, a bold
 * label, and an optional muted count badge (e.g. "Pinned 2").
 */
export function SectionHeader({ icon: Icon, title, count }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <h2 className="text-sm font-semibold">{title}</h2>
      {count !== undefined && (
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      )}
    </div>
  );
}
