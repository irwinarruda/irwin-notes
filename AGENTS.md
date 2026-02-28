# AGENTS Guide
This file defines how agentic coding assistants should operate in this repository.
Follow these commands and conventions unless the user explicitly asks otherwise.

## Project Snapshot
- Framework: Next.js 16 App Router with React 19 and TypeScript.
- Package manager: Bun (`packageManager: bun@1.3.9`).
- Styling: Tailwind CSS v4 via `@import "tailwindcss"` and custom theme tokens.
- Content: Local Markdown and MDX posts in `src/content/posts`.
- MDX pipeline: `@next/mdx`, `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`, `rehype-pretty-code`.
- Linting: ESLint 9 with `eslint-config-next` (`core-web-vitals` + `typescript`).
- Testing: No dedicated test framework or test script is currently configured.

## Directory Map
- `src/app`: Next.js routes, layouts, and global styles.
- `src/components`: UI components (`terminal-window`, `theme-toggle`, etc.).
- `src/lib`: Server-side helpers (`posts.ts` for post loading/parsing).
- `src/content/posts`: Blog content files (`.md` and `.mdx`).
- `public`: Static assets.
- Root config: `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `postcss.config.mjs`.

## Setup and Core Commands
Run commands from repo root: `/Users/irwinarruda/Documents/PRO/blog-ideas/0`.
```bash
# install dependencies
bun install
# run dev server
bun dev
# production build (runs TS checks in Next build pipeline)
bun run build
# run production server
bun run start
# lint entire repository
bun run lint
```

## Lint, Typecheck, and Validation Commands
Use these during implementation and before handoff.
```bash
# lint everything
bun run lint
# lint and auto-fix safe issues
bunx eslint . --fix
# lint a single file
bunx eslint src/lib/posts.ts
# explicit type-check without building
bunx tsc --noEmit
# full production verification
bun run build
```

## Test Commands (Current State + Single-Test Guidance)
There is no `test` script and no configured test runner in this codebase today.
If you add tests, prefer Bun-native commands unless the user asks for another runner.
```bash
# run all tests (after test files are added)
bun test
# run one test file
bun test src/lib/posts.test.ts
# run one named test (pattern)
bun test src/lib/posts.test.ts -t "parses frontmatter"
# run one test in watch mode
bun test src/lib/posts.test.ts --watch
```
If Vitest or Jest is introduced later, update this file with exact commands.

## Validation Matrix (Fast to Full)
- Small UI tweak: `bun run lint`.
- Single logic file change: `bunx eslint <file>` then `bunx tsc --noEmit`.
- Route/data change: `bun run lint` then `bun run build`.
- Content parsing/frontmatter change: `bun run lint` + `bun run build`.
- Before final handoff on non-trivial work: run full build.

## Agent Workflow Expectations
- Prefer Bun commands over npm/pnpm/yarn commands.
- Keep edits minimal and scoped to user intent.
- Do not refactor unrelated files unless required for correctness.
- Run targeted validation first, then broader validation.
- UI-only changes: run lint; run build if route behavior or data logic changed.
- Data/parsing changes: run lint + typecheck/build.
- Mention validation results clearly in your handoff.

## Code Style: Formatting and Structure
- Use TypeScript for all source changes (`.ts` / `.tsx`).
- Use 2-space indentation and semicolons.
- Use double quotes for strings unless interpolation requires template literals.
- Keep trailing commas where the codebase already uses them.
- Keep functions and components small and focused.
- Prefer early returns and guard clauses for clarity.
- Do not add comments unless logic is non-obvious.
- Keep files ASCII unless existing content requires Unicode.

## Code Style: Imports
- Order imports by group: 1) framework/external, 2) alias (`@/...`), 3) relative.
- Keep side-effect imports explicit and near the top (`"server-only"`, `"./globals.css"`).
- Prefer `import type` for type-only imports.
- Avoid deep relative paths when alias paths are available.
- Keep one blank line between different import groups.

## Code Style: Types and Naming
- `tsconfig` has `strict: true`; preserve strict typing.
- Avoid `any`; use `unknown` and narrow safely.
- Define explicit types for exported APIs and shared structures.
- Use union literals for constrained values (theme variants, file extensions).
- Use runtime validation helpers when parsing external data.
- Components: PascalCase (`TerminalWindow`, `ThemeToggle`).
- Variables/functions: camelCase (`getPostBySlug`, `estimateReadTime`).
- Constants: UPPER_SNAKE_CASE (`POSTS_DIRECTORY`).
- Route files follow Next conventions (`page.tsx`, `layout.tsx`).
- Non-route file names are kebab-case (`terminal-window.tsx`, `post-callout.tsx`).

## Next.js and React Conventions
- Default to Server Components; add `"use client"` only when browser APIs/hooks are needed.
- Use async server components for data fetching in routes.
- Use `notFound()` for missing route resources.
- Use `generateStaticParams` and `generateMetadata` for blog route pre-rendering.
- Use `cache` from React for server-side memoized read helpers when appropriate.
- Keep server-only logic in server modules and use `import "server-only"`.
- Use `@/` alias imports from `src` as defined in `tsconfig.json`.

## Error Handling and Resilience
- Fail fast on invalid content invariants (for example malformed frontmatter).
- Throw `Error` with actionable context (field name, slug, file source).
- Do not silently swallow exceptions in parsing or data loaders.
- At route boundaries, convert missing content into user-facing 404 via `notFound()`.
- In client components, guard `window` and `document` access for SSR safety.
- Prefer deterministic fallback behavior (for example default theme snapshot).

## Styling and Content Conventions
- Reuse terminal theme tokens from `src/app/globals.css`.
- Prefer utility-first Tailwind classes inline with existing component style.
- Keep spacing, text scale, and animation classes consistent with existing patterns.
- Preserve responsive behavior (`sm:`, `md:` breakpoints) in layout edits.
- Posts must live in `src/content/posts` and use `.md` or `.mdx`.
- Frontmatter fields: `title`, `description`, `date`, `tags`, `readTime`, optional `draft`.
- `draft: true` posts are excluded from listing.
- In MDX, import components via alias paths (example `@/components/post-callout`).

## Cursor and Copilot Rules
Repository check results:
- No `.cursorrules` file found.
- No `.cursor/rules/` directory found.
- No `.github/copilot-instructions.md` file found.
If any of these rule sources are added later, merge their guidance into this file promptly.

## Pre-Handoff Checklist for Agents
- Run `bun run lint` after code changes.
- Run `bun run build` when changes could affect runtime behavior or typing.
- If tests are added, run the smallest relevant single-test command first.
- Confirm no unrelated files were modified unintentionally.
- Report what changed, why, and what validations were executed.
