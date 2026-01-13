# Portfolio Site

Personal portfolio built with [Astro](https://astro.build/).

## Setup

Requires [pnpm](https://pnpm.io/):

```bash
pnpm install
pnpm dev
```

## Adding a New Project

1. Create a folder under `src/content/work/{project-name}/`
2. Add an `index.md` with frontmatter:

```yaml
---
title: Project Name
publishDate: 2026-01-12 00:00:00
img: ./cover.png
img_alt: Brief alt text
description: One-liner about the project.
tags:
  - TypeScript
  - Web
---
```

3. Drop images in the same folder and reference them in the markdown body.

## Commands

| Command        | Description                           |
| -------------- | ------------------------------------- |
| `pnpm dev`     | Start dev server                      |
| `pnpm build`   | Production build                      |
| `pnpm preview` | Preview production build              |
| `pnpm fix`     | Format & lint (`prettier` + `eslint`) |
