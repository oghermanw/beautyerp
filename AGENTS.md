# AGENTS.md

## Beauty Salon Management System MVP v4 Guidelines

### Architecture Rules
1. Next.js App Router with TypeScript and Tailwind CSS.
2. Roles: `SUPER`, `ADMIN`, `STAFF`.
3. Server-side security and Supabase RLS MUST enforce role capabilities.
4. Never expose passwords, financial secrets, or COGS to unauthorized roles.
5. All monetary amounts are formatted as `numeric(12,2)` and displayed with explicit currency (`HKD`).
6. Complete data portability via CSV zip packages and Excel workbooks.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
