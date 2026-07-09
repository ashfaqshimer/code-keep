/**
 * Ad-hoc database connectivity check.
 *
 * Exercises the same PrismaClient the app uses (Neon serverless adapter) to
 * confirm the connection works, the schema is migrated, and every model is
 * queryable. Read-only — it never writes.
 *
 *   npm run db:test
 *
 * Reads DATABASE_URL from .env (loaded below, since standalone scripts don't
 * get Next.js's automatic env loading).
 */
import "dotenv/config";

import { prisma } from "@/lib/prisma";

type AppliedMigration = {
  migration_name: string;
  finished_at: Date | null;
};

async function main() {
  console.log("→ Testing database connection...\n");

  // 1. Raw connectivity check.
  await prisma.$queryRaw`SELECT 1`;
  console.log("✓ Connected to Postgres via the Neon adapter");

  // 2. Confirm migrations have been applied (and list them).
  const migrations = await prisma.$queryRaw<AppliedMigration[]>`
    SELECT migration_name, finished_at
    FROM "_prisma_migrations"
    ORDER BY finished_at ASC
  `;
  if (migrations.length === 0) {
    throw new Error(
      'No applied migrations found. Run "npm run db:migrate" first.',
    );
  }
  console.log(`✓ ${migrations.length} migration(s) applied:`);
  for (const m of migrations) {
    const when = m.finished_at
      ? m.finished_at.toISOString()
      : "(not finished)";
    console.log(`    • ${m.migration_name}  —  ${when}`);
  }

  // 3. Verify every model is queryable (also proves the tables exist).
  const counts = {
    users: await prisma.user.count(),
    accounts: await prisma.account.count(),
    sessions: await prisma.session.count(),
    items: await prisma.item.count(),
    itemTypes: await prisma.itemType.count(),
    collections: await prisma.collection.count(),
    itemCollections: await prisma.itemCollection.count(),
    tags: await prisma.tag.count(),
  };
  console.log("\n✓ All tables queryable — row counts:");
  console.table(counts);

  console.log("\n✅ Database test passed.");
}

main()
  .catch((err) => {
    console.error("\n❌ Database test failed:\n");
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
