# Seed Data Specification

## Overview

Create a seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos.

## Requirements

### User

| Field | Value |
| --- | --- |
| Email | `demo@codekeep.io` |
| Name | Demo User |
| Password | `12345678` (hash with `bcryptjs`, 12 rounds) |
| isPro | `false` |
| emailVerified | current date |

### System Item Types

| Name | Icon | Color |
| --- | --- | --- |
| snippet | Code | `#3b82f6` |
| prompt | Sparkles | `#8b5cf6` |
| command | Terminal | `#f97316` |
| note | StickyNote | `#fde047` |
| file | File | `#6b7280` |
| image | Image | `#ec4899` |
| link | Link | `#10b981` |

Icons are Lucide React component names. All types have `isSystem: true`.

### Collections & Items

Summary of what gets seeded:

| Collection | Item Types | Count |
| --- | --- | --- |
| React Patterns | snippet | 3 |
| AI Workflows | prompt | 3 |
| DevOps | snippet, command, link | 1 + 1 + 2 |
| Terminal Commands | command | 4 |
| Design Resources | link | 4 |

---

#### React Patterns

_Reusable React patterns and hooks_

3 snippets (TypeScript):

- Custom hooks (`useDebounce`, `useLocalStorage`, etc.)
- Component patterns (context providers, compound components)
- Utility functions

#### AI Workflows

_AI prompts and workflow automations_

3 prompts:

- Code review prompts
- Documentation generation
- Refactoring assistance

#### DevOps

_Infrastructure and deployment resources_

- 1 snippet — Docker / CI-CD config
- 1 command — deployment scripts
- 2 links — documentation URLs (use real URLs)

#### Terminal Commands

_Useful shell commands for everyday development_

4 commands:

- Git operations
- Docker commands
- Process management
- Package manager utilities

#### Design Resources

_UI/UX resources and references_

4 links (use real URLs):

- CSS/Tailwind references
- Component libraries
- Design systems
- Icon libraries