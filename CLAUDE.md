# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal website at **andrea.fyi**, built with SvelteKit 2 + Svelte 4 + Vite 5. Pure JavaScript (no TypeScript). Client-side only (no SSR/server routes).

## Commands

- `npm run dev` — Start dev server with HMR
- `npm run build` — Build static site to `./build`
- `npm run preview` — Preview production build locally

No test or lint commands are configured.

## Architecture

**Static SPA** using `@sveltejs/adapter-static` with `index.html` fallback for client-side routing. Output goes to `build/`.

**Routing** uses SvelteKit file-based routing in `src/routes/`:
- `/` — Home page with countdown timer (neobrutalist design)
- `/countdown` — Alternative countdown display
- `/article/tobe-article` — Article page

**Styling**: Global reset in `src/app.css`, component-scoped styles in `<style>` blocks. Neobrutalist aesthetic with bold borders, rotated elements, bright colors. Fonts: Courier New + Space Grotesk (Google Fonts loaded per-page via `<svelte:head>`).

**No shared components** — pages are self-contained with inline reactive state. Countdown timers use `onMount` + `setInterval` with cleanup.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on push to `main`. Custom domain configured via `CNAME` file.
