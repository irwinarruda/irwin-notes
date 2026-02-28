# Irwin Notes

## Project Snapshot

- Framework: Next.js 16 App Router with React 19 and TypeScript.
- Package manager: Bun (`packageManager: bun@1.3.9`).
- Styling: Tailwind CSS v4 via `@import "tailwindcss"` and custom theme tokens.
- Content: Local Markdown and MDX posts in `src/content/posts`.
- MDX pipeline: `@next/mdx`, `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`, `rehype-pretty-code`.
- Linting: ESLint 9 with `eslint-config-next` (`core-web-vitals` + `typescript`).

## Directory Map

- `src/app`: Next.js routes, metadata.
- `src/components`: UI components (`terminal-window`, `theme-toggle`, etc.).
- `src/screens`: Never create a page directly inside the app directory, always add it to the screens dir.
- `public`: Static assets.

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
