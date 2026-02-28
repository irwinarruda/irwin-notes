# Irwin Notes

Terminal-style blog built with Next.js App Router, local markdown/MDX posts, and Shiki-powered syntax highlighting.

## Development

```bash
bun dev
```

Open http://localhost:3000.

## Blog content

Posts live in locale folders under `src/content/posts` and can be either `.md` or `.mdx`.

- English source posts live in `src/content/posts/en`
- Locale overrides can live in `src/content/posts/<locale>` (for example `src/content/posts/pt-BR`)
- When a localized post is missing, the app falls back to the `src/content/posts/en` version

### Required frontmatter

```yaml
---
title: Post title
description: Short post description
date: 2026-02-10
tags:
  - tag-one
  - tag-two
readTime: 8 min
draft: false
---
```

- `draft` is optional and defaults to `false`
- posts are sorted by `date` descending

### MDX features

- `.mdx` posts can import and render React components
- `.md` posts stay plain markdown
- both file types are automatically listed on the home page

### Code blocks

Syntax highlighting is handled at compile time with `rehype-pretty-code` + `shiki`.

Examples:

````md
```ts
const answer = 42;
```

```lua {3-6} title="plugin.lua"
-- highlighted lines 3-6
```
````

## Useful scripts

```bash
bun dev
bun run build
bun run lint
```

## Internationalization

- Localized routes are served under `/<locale>/*` (for example `/en/posts`, `/pt-BR/about`)
- Locale detection uses cookie first, then `Accept-Language`, and redirects via `src/proxy.ts`
- UI strings are loaded on the server from `src/content/texts/*.json` (no client translation hooks)
- Language switching UI is rendered in the terminal chrome and links to the same path in other locales
- Example localized posts are available in `src/content/posts/pt-BR`
