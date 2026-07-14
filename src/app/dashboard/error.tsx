"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

// Error boundary for the dashboard route. Catches failures from the
// per-request DB fetches (e.g. a transient Neon error or cold start) and
// offers a retry instead of an unstyled crash page.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </span>
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold">Couldn&apos;t load your dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Something went wrong while fetching your data. This is usually
          temporary — try again in a moment.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
