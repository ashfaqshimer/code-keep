import { Skeleton } from "@/components/ui/skeleton";

// Skeleton placeholder shown while the dashboard's per-request DB fetches
// resolve. Mirrors the real layout in page.tsx: a 4-tile stat row, a section,
// and a collections grid.
export default function DashboardLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="size-10 shrink-0 rounded-lg" />
            <div className="grid gap-1.5">
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </section>

      {/* Collections */}
      <section>
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </section>

      {/* Recent items */}
      <section>
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="size-4 shrink-0 rounded" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="ml-auto h-3 w-16" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
