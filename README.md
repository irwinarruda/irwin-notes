# Irwin Notes

> Fully vibecoded. No plan, no roadmap — just thoughts on code landing somewhere.

A terminal-style personal blog where I dump whatever is on my mind about software engineering. Built on Next.js, styled like a terminal, written whenever the mood strikes.

## Stack

- **Next.js 16** App Router + React 19
- **Tailwind CSS v4** with custom theme tokens
- **MDX** posts with Shiki syntax highlighting
- **Bun** as package manager and runtime

## Running locally

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing a post

Drop a `.md` or `.mdx` file into `src/content/posts/en/` with this frontmatter:

```yaml
---
title: Your title
description: One sentence.
date: 2026-02-28
tags:
  - tag
readTime: 5 min
draft: false
---
```

That's it. It shows up automatically.
