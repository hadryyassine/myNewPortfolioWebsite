# Home Light Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a light-mode-only homepage redesign with layered patterned background and floating card UI while preserving dark mode visuals.

**Architecture:** Apply dedicated home-only CSS utility classes for the light-mode canvas and floating card. Keep dark mode in current visual style via a conditional render branch in `Home.jsx`. Hide global header only on light-mode home so top nav is rendered inside the card.

**Tech Stack:** React 19, React Router, TailwindCSS, Lucide icons, Vite.

---

### Task 1: Add Home Redesign CSS

**Files:**
- Modify: `src/index.css`

Steps:
1. Add `.home-canvas-light` layered background with gradients + geometric repeating pattern.
2. Add `.home-canvas-light::before` for subtle texture blending.
3. Add `.home-float-card` cream card styling with inner and drop shadows.
4. Add `.home-footer-strip` soft lower area framing.

### Task 2: Refactor Home Page Structure

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/data/profile.js`

Steps:
1. Add outlet context usage to access `isDark` + `onToggleTheme`.
2. Keep dark-mode branch visually aligned with existing page.
3. Build new light-mode branch with:
   - in-card top nav (logo + links + moon icon)
   - portrait + name/title + corrected bio
   - pill action row with primary/secondary styling
   - refined social icon row
4. Update duplicated bio sentence in `profile` data.

### Task 3: Layout Header Behavior

**Files:**
- Modify: `src/App.jsx`

Steps:
1. Use `useLocation` in `Layout`.
2. Hide global header only when route is home and theme is light.
3. Pass theme context to pages via `Outlet context`.
4. Keep default container/header behavior for other pages and dark-mode home.

### Task 4: Verify

Steps:
1. Run `npm run lint` and ensure success.
2. Run `npm run build` and ensure success (known Node warning acceptable).
3. Manual check:
   - `/` light mode new design
   - `/` dark mode old style
   - nav and theme toggle behavior
   - 320px wrapping.
