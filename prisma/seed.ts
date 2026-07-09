/**
 * Database seed — populates the dev database with a demo user, the seven system
 * item types, and a set of sample collections and items. Spec:
 * context/features/seed-spec.md.
 *
 *   npm run db:seed            (or `prisma db seed`)
 *
 * Idempotent: re-running wipes the demo user (cascading their items and
 * collections) and the system item types, then recreates everything fresh.
 * Reads DATABASE_URL from .env (loaded below, as standalone scripts don't get
 * Next.js's automatic env loading).
 */
import "dotenv/config";

import bcrypt from "bcryptjs";

import { ContentType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "demo@codekeep.io";
const DEMO_PASSWORD = "12345678";

// --- System item types (Lucide icon names + spec colors) --------------------

type TypeName =
  | "snippet"
  | "prompt"
  | "command"
  | "note"
  | "file"
  | "image"
  | "link";

const SYSTEM_ITEM_TYPES: { name: TypeName; icon: string; color: string }[] = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
];

// --- Sample collections & items ---------------------------------------------

type SeedItem = {
  type: TypeName;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  language?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
};

type SeedCollection = {
  name: string;
  description: string;
  defaultType: TypeName;
  isFavorite?: boolean;
  items: SeedItem[];
};

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    defaultType: "snippet",
    isFavorite: true,
    items: [
      {
        type: "snippet",
        title: "useDebounce",
        description: "Debounce a rapidly-changing value.",
        language: "typescript",
        isPinned: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
      },
      {
        type: "snippet",
        title: "Theme context provider",
        description: "Compound context provider + typed consumer hook.",
        language: "typescript",
        content: `import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}`,
      },
      {
        type: "snippet",
        title: "cn() class merge helper",
        description: "Merge Tailwind classes with clsx + tailwind-merge.",
        language: "typescript",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    defaultType: "prompt",
    isFavorite: true,
    items: [
      {
        type: "prompt",
        title: "Code review prompt",
        description: "Structured review focused on correctness and clarity.",
        isPinned: true,
        content: `You are a senior engineer reviewing a pull request. Review the diff below and report:

1. Correctness bugs (logic errors, edge cases, race conditions)
2. Security issues (input validation, auth, injection)
3. Readability & naming
4. Suggested simplifications

For each finding give: file:line, severity (high/med/low), and a concrete fix.
Be concise. Skip praise. If nothing is wrong in a category, say "none".

--- DIFF ---
{{diff}}`,
      },
      {
        type: "prompt",
        title: "Docs generation prompt",
        description: "Generate reference docs from a code file.",
        content: `Given the source file below, produce Markdown documentation:

- A one-paragraph overview of what the module does
- A table of every exported function/class: name, signature, description
- A short usage example for the primary export

Use only what the code actually shows — do not invent behavior.

--- SOURCE ---
{{source}}`,
      },
      {
        type: "prompt",
        title: "Refactoring assistant prompt",
        description: "Propose safe, incremental refactors.",
        content: `Refactor the code below WITHOUT changing its observable behavior.

Constraints:
- Preserve the public API and all return values
- Prefer small, reviewable steps over a rewrite
- Explain each change in one line before showing the code
- Note any change that could alter behavior so I can verify it

--- CODE ---
{{code}}`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    defaultType: "snippet",
    items: [
      {
        type: "snippet",
        title: "GitHub Actions — Node CI",
        description: "Lint, build and test on push and PR.",
        language: "yaml",
        content: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build`,
      },
      {
        type: "command",
        title: "Deploy to production",
        description: "Run migrations then build and deploy.",
        language: "bash",
        content: `npm run db:migrate:deploy && npm run build && vercel deploy --prod`,
      },
      {
        type: "link",
        title: "Docker — Dockerfile reference",
        description: "Official Dockerfile instruction reference.",
        url: "https://docs.docker.com/reference/dockerfile/",
      },
      {
        type: "link",
        title: "GitHub Actions documentation",
        description: "Workflow syntax and CI/CD reference.",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    defaultType: "command",
    items: [
      {
        type: "command",
        title: "Undo last commit (keep changes)",
        description: "Soft-reset the most recent commit.",
        language: "bash",
        content: `git reset --soft HEAD~1`,
      },
      {
        type: "command",
        title: "Remove dangling Docker images",
        description: "Free disk space from untagged images.",
        language: "bash",
        content: `docker image prune -f`,
      },
      {
        type: "command",
        title: "Find & kill process on a port",
        description: "Identify and terminate whatever holds port 3000.",
        language: "bash",
        content: `lsof -ti :3000 | xargs kill -9`,
      },
      {
        type: "command",
        title: "List outdated npm packages",
        description: "Show which dependencies have newer versions.",
        language: "bash",
        content: `npm outdated`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    defaultType: "link",
    items: [
      {
        type: "link",
        title: "Tailwind CSS documentation",
        description: "Utility-first CSS framework reference.",
        url: "https://tailwindcss.com/docs",
      },
      {
        type: "link",
        title: "shadcn/ui",
        description: "Copy-paste React component library.",
        url: "https://ui.shadcn.com",
      },
      {
        type: "link",
        title: "Radix UI",
        description: "Unstyled, accessible component primitives.",
        url: "https://www.radix-ui.com",
      },
      {
        type: "link",
        title: "Lucide icons",
        description: "Open-source icon set used across CodeKeep.",
        url: "https://lucide.dev/icons",
      },
    ],
  },
];

/** Map a type name to the ContentType enum used for its items. */
function contentTypeFor(type: TypeName): ContentType {
  if (type === "link") return ContentType.URL;
  if (type === "file" || type === "image") return ContentType.FILE;
  return ContentType.TEXT;
}

async function main() {
  console.log("→ Seeding database...\n");

  // 1. Reset prior seed data so re-runs are idempotent. Deleting the demo user
  //    cascades their items and collections (and the ItemCollection joins).
  const existing = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (existing) {
    await prisma.user.delete({ where: { id: existing.id } });
    console.log("✓ Cleared previous demo user and their data");
  }
  // System types have no owner, so they aren't cascade-deleted above. With the
  // demo user's items gone, nothing references them and they're safe to drop.
  await prisma.itemType.deleteMany({ where: { isSystem: true } });

  // 2. Demo user.
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);
  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: "Demo User",
      hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`✓ Created demo user (${user.email})`);

  // 3. System item types — keyed by name for item/collection wiring.
  const typeByName = new Map<TypeName, string>();
  for (const t of SYSTEM_ITEM_TYPES) {
    const created = await prisma.itemType.create({
      data: { name: t.name, icon: t.icon, color: t.color, isSystem: true },
    });
    typeByName.set(t.name, created.id);
  }
  console.log(`✓ Created ${SYSTEM_ITEM_TYPES.length} system item types`);

  // 4. Collections + their items (linked via the ItemCollection join).
  let itemCount = 0;
  for (const col of COLLECTIONS) {
    const collection = await prisma.collection.create({
      data: {
        name: col.name,
        description: col.description,
        isFavorite: col.isFavorite ?? false,
        userId: user.id,
        defaultTypeId: typeByName.get(col.defaultType),
      },
    });

    for (const item of col.items) {
      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description,
          contentType: contentTypeFor(item.type),
          content: item.content,
          url: item.url,
          language: item.language,
          isFavorite: item.isFavorite ?? false,
          isPinned: item.isPinned ?? false,
          userId: user.id,
          itemTypeId: typeByName.get(item.type)!,
          collections: { create: { collectionId: collection.id } },
        },
      });
      itemCount++;
    }
    console.log(`✓ ${col.name} — ${col.items.length} item(s)`);
  }

  console.log(
    `\n✅ Seed complete: 1 user, ${SYSTEM_ITEM_TYPES.length} types, ${COLLECTIONS.length} collections, ${itemCount} items.`,
  );
}

main()
  .catch((err) => {
    console.error("\n❌ Seed failed:\n");
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
