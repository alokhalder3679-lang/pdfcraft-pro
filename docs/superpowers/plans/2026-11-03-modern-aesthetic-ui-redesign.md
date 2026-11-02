# Modern Aesthetic UI & Editorial Workstation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

This plan details the visual, typographic, and interactive overhaul of **PDFCraft Pro**, fusing the Swiss/Minimalist design intelligence of `ui-ux-pro-max` with the anti-slop art direction of `design-taste-frontend`.

---

## 1. Aesthetic Direction & Guidelines

### 1.1 Visual Tone ("Achromatic Precision Instrument")
- **Ground**: Crisp architectural background (`#F8FAFC` to `#FFFFFF`) with subtle hair-line borders (`#E2E8F0` / `#CBD5E1`).
- **Accent**: Deliberate single-accent Warm Rose / Crimson (`#E11D48`) used exclusively for active primary actions and brand presence.
- **Typography**: 
  - `Plus Jakarta Sans` for geometric display headings with tight tracking (`-0.03em`).
  - `JetBrains Mono` with `font-variant-numeric: tabular-nums` for technical telemetry, file sizes, and tool metadata.
- **Zero AI-Slop Rules**:
  - No purple-to-blue floating blur gradients.
  - No generic centered 3-line heading with floating pill badges.
  - No artificial emoji icons or saturated toy-like card backgrounds.
  - Real substance: authentic document telemetry (MIME detection, byte formatting, WASM sandbox status).

---

## 2. File Decomposition

- `src/index.css`: Add design tokens, paper elevation shadows, and micro-interaction transitions.
- `src/components/Navbar.tsx`: Sleek glassmorphism header, precision branding, and sandbox status pill.
- `src/pages/HomePage.tsx`: Redesigned editorial hero, tactile document drop workbench with live file analysis, and segmented category filters.
- `src/components/ToolCard.tsx`: Sophisticated Bento-style cards with technical engine badges, keyboard navigation affordances, and crisp borders.
- `src/components/Footer.tsx`: Polished typography, domain & email links, and clean footer hierarchy.

---

## 3. Tasks Breakdown

- [ ] **Task 1: CSS Tokens and Elevation Utilities (`src/index.css`)**
  - Add smooth transitions, crisp card borders, and paper elevation classes.
- [ ] **Task 2: Refine Header & Navigation (`src/components/Navbar.tsx`)**
  - Implement sleek glassmorphism, refined brand origami mark, and telemetry badge.
- [ ] **Task 3: Elevate Bento Tool Cards (`src/components/ToolCard.tsx`)**
  - Update card styling: clean white ground, technical engine tags, subtle hover lift, and accessible focus states.
- [ ] **Task 4: Overhaul Homepage Hero & Interactive Workbench (`src/pages/HomePage.tsx`)**
  - Implement asymmetric editorial hero layout, live document inspection card, and category filter bar.
- [ ] **Task 5: Polish Footer & Security Manifesto (`src/components/Footer.tsx` & `HomePage.tsx`)**
  - Style the security manifesto with architectural gridlines and obsidian theme.
- [ ] **Task 6: Verification & Git Push**
  - Test suite verification, `npm run build`, and push to GitHub.
