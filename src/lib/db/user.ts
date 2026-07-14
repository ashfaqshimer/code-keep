/**
 * Current-user resolution for the data layer.
 *
 * There's no auth yet, so every query is scoped to the seeded demo user. This
 * lookup is wrapped in React's `cache()` so the many dashboard fetchers that
 * each need the user's id share a single query per request, rather than every
 * one of them re-running the same `findUnique`.
 */
import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";

// No auth yet — everything is scoped to the seeded demo user.
export const DEMO_EMAIL = "demo@codekeep.io";

/**
 * The demo user's id, or `null` if the database hasn't been seeded. Deduped
 * per request via `cache()`.
 */
export const getDemoUserId = cache(async (): Promise<string | null> => {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
});
