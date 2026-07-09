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

  // 4. Surface the seeded data (if any) for a quick eyeball check. Read-only —
  //    absence is reported, not treated as a failure (the DB may be un-seeded).
  const demo = await prisma.user.findUnique({
    where: { email: "demo@codekeep.io" },
    select: { name: true, email: true, isPro: true, emailVerified: true },
  });
  if (demo) {
    console.log("\n✓ Demo user present:");
    console.table({
      name: demo.name,
      email: demo.email,
      isPro: demo.isPro,
      emailVerified: demo.emailVerified?.toISOString() ?? null,
    });

    const systemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
      select: { name: true, icon: true, color: true },
    });
    console.log(`\n✓ ${systemTypes.length} system item type(s):`);
    console.table(systemTypes);

    const collections = await prisma.collection.findMany({
      orderBy: { name: "asc" },
      select: { name: true, _count: { select: { items: true } } },
    });
    console.log(`\n✓ ${collections.length} collection(s) — item counts:`);
    console.table(
      Object.fromEntries(collections.map((c) => [c.name, c._count.items])),
    );
  } else {
    console.log(
      '\nℹ No demo user found — run "npm run db:seed" to populate sample data.',
    );
  }

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
