import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7 requires an explicit driver adapter. We use Neon's serverless driver
// (HTTP for one-shot queries, WebSocket for transactions). Node 22+ exposes a
// global WebSocket, so no `ws` polyfill is needed.
const connectionString = process.env.DATABASE_URL;

// Cache the client on globalThis in dev so Next.js HMR doesn't spawn a new
// client (and connection pool) on every reload.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
