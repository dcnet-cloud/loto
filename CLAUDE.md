# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DCNET Lô Tô — a Vietnamese lottery number caller (Lô Tô) web app. Calls numbers 1–60 with Vietnamese text-to-speech announcements including cultural phrases, math riddles, and plain number reading. Designed for mobile-first use with responsive desktop layout.

## Build & Run

```bash
npm run build      # Production build → dist/index.html (minified, obfuscated, single-file)
```

No dev server — open `index.html` directly in a browser. The `dist/index.html` is a self-contained single file with all CSS/JS inlined.

No tests exist. No linter configured.

## Architecture

Vanilla JS app with no framework. Four source files compose the entire app:

- **`index.html`** — Semantic layout: sidebar (header, display, controls, auto-settings) + board (number grid). `data.js` must load before `app.js`.
- **`data.js`** — `lottoData` object mapping numbers to arrays of Vietnamese cultural phrase strings (numbers 1–15). `licensePlateData` object mapping numbers 11–60 to Vietnamese province names for license plate riddles.
- **`app.js`** — All game logic, TTS, and DOM manipulation in a single file:
  - `randomInt()` — Cryptographic RNG via `crypto.getRandomValues`
  - `speak()` / `sayText()` — Web Speech API (vi-VN) with suspense pattern: reads riddle → 3s pause → reveals "là con số X"
  - `numberToVietnamese()` — Vietnamese number pronunciation with linguistic rules (mười/mươi, mốt, lăm, lẻ)
  - `generateMathPhrase()` — Dynamic math riddle generator (add/sub/mul/div/sqrt/square/cube/pow2)
  - `getRandomPhrase()` — 4-category random selection: culture (from lottoData), math (generated), bienso (license plate riddle from licensePlateData), or null (plain reading)
  - Game state: `remaining[]` / `called[]` arrays, 60-number pool
  - Auto mode: configurable interval (1–30s), waits for speech completion between calls
- **`styles.css`** — CSS custom properties theme, responsive layout with 3 breakpoints (mobile portrait, desktop ≥768px, desktop ≥1200px, mobile landscape). Sidebar uses `display: contents` on mobile to flatten into flex parent.

## Build System (`build.js`)

Node.js script that:
1. Minifies CSS (clean-css level 2)
2. Combines data.js + app.js → Terser minify → javascript-obfuscator
3. Inlines everything into a single HTML file
4. Output: `dist/index.html`

`renameGlobals: false` in obfuscator config — DOM element IDs must remain intact.

## Key Conventions

- All UI text is in Vietnamese
- Numbers range 1–60 (not 90)
- CSS grid: 9 columns × 7 rows for the number board
- CSS variables defined in `:root` for theming (--bg, --surface, --accent, --gold, etc.)
- `speakAbort` flag prevents speech continuation after game reset
