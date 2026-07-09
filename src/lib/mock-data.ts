/**
 * Single source of truth for mock dashboard data.
 *
 * Temporary stand-in for the database while the UI is built out. Shapes loosely
 * follow the Prisma models in context/project-overview.md, trimmed to what the
 * dashboard actually renders. Replace with real DB queries once Prisma is wired up.
 */

// System item type slugs (fixed, non-editable). See project spec.
export type ItemTypeSlug =
  | "snippet"
  | "prompt"
  | "command"
  | "note"
  | "link"
  | "file"
  | "image";

export interface ItemType {
  slug: ItemTypeSlug;
  name: string; // singular label, e.g. "Snippet"
  plural: string; // sidebar label, e.g. "Snippets"
  color: string; // hex, drives card borders / accents
  icon: string; // Lucide icon name
  isPro: boolean; // file & image are Pro-only
  count: number; // how many items the user has of this type
}

export interface ItemSummary {
  id: string;
  title: string;
  type: ItemTypeSlug;
  description?: string;
  content?: string; // text content for snippet/prompt/note/command
  language?: string; // syntax highlighting hint, e.g. "typescript"
  url?: string; // for link items
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  collectionIds: string[];
  updatedLabel: string; // display-ready relative time, e.g. "2h ago"
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  dominantType: ItemTypeSlug; // drives the card's color coding
  isFavorite: boolean;
  updatedLabel: string; // e.g. "Updated 2h ago"
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  isPro: boolean;
}

// --- Item types (the seven fixed system types) ---------------------------

export const itemTypes: ItemType[] = [
  { slug: "snippet", name: "Snippet", plural: "Snippets", color: "#3b82f6", icon: "Code", isPro: false, count: 25 },
  { slug: "prompt", name: "Prompt", plural: "Prompts", color: "#8b5cf6", icon: "Sparkles", isPro: false, count: 22 },
  { slug: "command", name: "Command", plural: "Commands", color: "#f97316", icon: "Terminal", isPro: false, count: 9 },
  { slug: "note", name: "Note", plural: "Notes", color: "#fde047", icon: "StickyNote", isPro: false, count: 17 },
  { slug: "link", name: "Link", plural: "Links", color: "#10b981", icon: "Link", isPro: false, count: 31 },
  { slug: "file", name: "File", plural: "Files", color: "#6b7280", icon: "File", isPro: true, count: 0 },
  { slug: "image", name: "Image", plural: "Images", color: "#ec4899", icon: "Image", isPro: true, count: 0 },
];

// --- Current (mock) logged-in user ---------------------------------------

export const currentUser: CurrentUser = {
  id: "user_1",
  name: "Dev User",
  email: "dev@codekeep.io",
  initials: "DV",
  isPro: true,
};

// --- Collections ----------------------------------------------------------

export const collections: Collection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Reusable hooks, components, and rendering patterns.",
    itemCount: 14,
    dominantType: "snippet",
    isFavorite: true,
    updatedLabel: "Updated 2h ago",
  },
  {
    id: "col_ai_prompt_library",
    name: "AI Prompt Library",
    description: "System messages and prompts for coding assistants.",
    itemCount: 22,
    dominantType: "prompt",
    isFavorite: true,
    updatedLabel: "Updated 5h ago",
  },
  {
    id: "col_shell_toolkit",
    name: "Shell Toolkit",
    description: "Everyday terminal commands and one-liners.",
    itemCount: 9,
    dominantType: "command",
    isFavorite: false,
    updatedLabel: "Updated 1d ago",
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Algorithms, notes, and talking points.",
    itemCount: 17,
    dominantType: "note",
    isFavorite: false,
    updatedLabel: "Updated 2d ago",
  },
  {
    id: "col_context_files",
    name: "Context Files",
    description: "Project context docs for AI pairing sessions.",
    itemCount: 6,
    dominantType: "file",
    isFavorite: false,
    updatedLabel: "Updated 3d ago",
  },
  {
    id: "col_useful_links",
    name: "Useful Links",
    description: "Docs, references, and bookmarks worth keeping.",
    itemCount: 31,
    dominantType: "link",
    isFavorite: true,
    updatedLabel: "Updated 4d ago",
  },
  {
    id: "col_python_snippets",
    name: "Python Snippets",
    description: "Handy utilities and scripts in Python.",
    itemCount: 12,
    dominantType: "snippet",
    isFavorite: false,
    updatedLabel: "Updated 5d ago",
  },
  {
    id: "col_design_assets",
    name: "Design Assets",
    description: "Screenshots, mockups, and reference images.",
    itemCount: 8,
    dominantType: "image",
    isFavorite: false,
    updatedLabel: "Updated 1w ago",
  },
];

// --- Items ----------------------------------------------------------------

export const items: ItemSummary[] = [
  {
    id: "item_use_debounce",
    title: "useDebounce hook",
    type: "snippet",
    description: "Debounce any fast-changing value in React.",
    language: "typescript",
    content: `import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}`,
    tags: ["react", "hooks", "typescript"],
    isFavorite: true,
    isPinned: true,
    collectionIds: ["col_react_patterns", "col_interview_prep"],
    updatedLabel: "2h ago",
  },
  {
    id: "item_senior_reviewer",
    title: "Senior code reviewer",
    type: "prompt",
    description: "System prompt for thorough, actionable code reviews.",
    content:
      "You are a senior staff engineer performing a code review. Be direct and specific. For each issue, cite the line, explain the risk, and propose a concrete fix. Prioritize correctness, then security, then readability.",
    tags: ["ai", "review", "system-prompt"],
    isFavorite: true,
    isPinned: true,
    collectionIds: ["col_ai_prompt_library"],
    updatedLabel: "5h ago",
  },
  {
    id: "item_kill_port",
    title: "Kill process on port",
    type: "command",
    description: "Free up a port that's already in use.",
    language: "bash",
    content: "lsof -ti:3000 | xargs kill -9",
    tags: ["shell", "ports", "macos"],
    isFavorite: false,
    isPinned: false,
    collectionIds: ["col_shell_toolkit"],
    updatedLabel: "1d ago",
  },
  {
    id: "item_bigo_notes",
    title: "Big-O cheat sheet",
    type: "note",
    description: "Time complexity for common data structures.",
    content:
      "Arrays: access O(1), search O(n). Hash maps: insert/lookup O(1) avg. Balanced BST: O(log n). Sorting: O(n log n) comparison-based lower bound.",
    tags: ["algorithms", "interview"],
    isFavorite: false,
    isPinned: false,
    collectionIds: ["col_interview_prep"],
    updatedLabel: "2d ago",
  },
  {
    id: "item_nextjs_docs",
    title: "Next.js App Router docs",
    type: "link",
    description: "Official App Router documentation.",
    url: "https://nextjs.org/docs/app",
    tags: ["nextjs", "docs", "reference"],
    isFavorite: false,
    isPinned: false,
    collectionIds: ["col_useful_links"],
    updatedLabel: "4d ago",
  },
  {
    id: "item_zustand_store",
    title: "Zustand store setup",
    type: "snippet",
    description: "Minimal typed store with a selector hook.",
    language: "typescript",
    content: `import { create } from "zustand"

interface CounterState {
  count: number
  increment: () => void
}

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))`,
    tags: ["react", "state", "typescript"],
    isFavorite: true,
    isPinned: false,
    collectionIds: ["col_react_patterns"],
    updatedLabel: "5d ago",
  },
  {
    id: "item_git_undo_commit",
    title: "Undo last commit (keep changes)",
    type: "command",
    description: "Soft-reset the most recent commit.",
    language: "bash",
    content: "git reset --soft HEAD~1",
    tags: ["git", "vcs"],
    isFavorite: true,
    isPinned: false,
    collectionIds: ["col_shell_toolkit"],
    updatedLabel: "6d ago",
  },
  {
    id: "item_refactor_prompt",
    title: "Refactor to composition",
    type: "prompt",
    description: "Ask the model to break a component into composable parts.",
    content:
      "Refactor the following component to favor composition over configuration. Extract focused subcomponents, lift shared logic into hooks, and keep each piece under one responsibility. Explain each extraction briefly.",
    tags: ["ai", "refactor"],
    isFavorite: false,
    isPinned: false,
    collectionIds: ["col_ai_prompt_library"],
    updatedLabel: "1w ago",
  },
  {
    id: "item_tailwind_tokens",
    title: "Tailwind v4 theme tokens",
    type: "note",
    description: "How CSS-first config replaces tailwind.config.js.",
    content:
      "Tailwind v4 configures the theme in CSS via @theme blocks in globals.css — no tailwind.config.js. Custom colors, radii, and fonts become CSS variables and auto-generate utility classes.",
    tags: ["tailwind", "css"],
    isFavorite: false,
    isPinned: false,
    collectionIds: ["col_react_patterns"],
    updatedLabel: "1w ago",
  },
  {
    id: "item_pg_cheatsheet",
    title: "PostgreSQL psql cheat sheet",
    type: "note",
    description: "Common psql meta-commands.",
    content:
      "\\l list databases, \\c connect, \\dt list tables, \\d table describe, \\du list roles, \\timing toggle query timing.",
    tags: ["postgres", "database"],
    isFavorite: false,
    isPinned: false,
    collectionIds: ["col_interview_prep"],
    updatedLabel: "2w ago",
  },
  {
    id: "item_design_system_link",
    title: "Refactoring UI",
    type: "link",
    description: "Practical visual design tips for developers.",
    url: "https://www.refactoringui.com/",
    tags: ["design", "ui", "reference"],
    isFavorite: true,
    isPinned: false,
    collectionIds: ["col_useful_links"],
    updatedLabel: "2w ago",
  },
  {
    id: "item_fetch_retry",
    title: "fetch with retry",
    type: "snippet",
    description: "Retry a fetch with exponential backoff.",
    language: "typescript",
    content: `export async function fetchRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((r) => setTimeout(r, 2 ** i * 200))
    }
  }
  throw new Error("unreachable")
}`,
    tags: ["fetch", "typescript", "network"],
    isFavorite: false,
    isPinned: false,
    collectionIds: ["col_react_patterns"],
    updatedLabel: "3w ago",
  },
];
