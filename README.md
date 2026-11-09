<p align="center">
  <img src="public/brand/irwin-arruda-dark.svg#gh-dark-mode-only" alt="Irwin Arruda" width="360">
  <img src="public/brand/irwin-arruda-light.svg#gh-light-mode-only" alt="Irwin Arruda" width="360">
</p>

My personal site, [irwinarruda.com](https://www.irwinarruda.com), where I write notes on software, building tools and frontend architecture, in English and Portuguese, whenever the mood strikes.

The colors come from [Barro](https://github.com/irwinarruda/barro-theme): Barro Slate in dark mode and Barro Kaolin in light mode, code blocks included. The logo and icons live in [`public/brand`](public/brand).

## Stack

- **Next.js 16** App Router + React 19
- **Tailwind CSS v4** with the [Barro](https://github.com/irwinarruda/barro-theme) theme tokens
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
