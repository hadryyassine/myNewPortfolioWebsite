# Deploying Without Crying Blog Post Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new detailed blog post for the talk "Deploying Without Crying" with embedded YouTube video, in-page slide deck navigation, and explained code excerpts from the demo repository.

**Architecture:** Create one reusable `SlideDeck` React component for PDF page navigation, then author one MDX post that imports and uses it. Keep existing blog discovery/routing intact via `src/blog/posts.js` auto-glob behavior.

**Tech Stack:** React 19, MDX, Vite, Tailwind utility classes, existing blog metadata pipeline.

---

### Task 1: Add failing verification script (RED)

**Files:**
- Create: `scripts/verify-deployment-blog.mjs`

**Step 1: Write failing checks**
- Check for required post file.
- Check for `SlideDeck` component usage.
- Check for required metadata/date (`2026-02-26`).

**Step 2: Run to verify failure**
Run: `node scripts/verify-deployment-blog.mjs`
Expected: FAIL before implementation.

### Task 2: Implement reusable slide deck component (GREEN)

**Files:**
- Create: `src/components/SlideDeck.jsx`

**Step 1:** Implement page-based PDF viewer using iframe fragments (`#page=`) with next/prev controls.
**Step 2:** Add accessible labels and page indicator.

### Task 3: Author new detailed MDX post

**Files:**
- Create: `src/blog/deploying-without-crying-deployment-strategies-for-peaceful-nights.mdx`

**Step 1:** Add frontmatter with date `2026-02-26`.
**Step 2:** Embed YouTube talk.
**Step 3:** Import and render `SlideDeck` using `/blog/slides-blog-deployment-without-crying.pdf`.
**Step 4:** Add detailed strategy sections with code excerpts from demo repo + explanations.

### Task 4: Run verification (GREEN + build)

**Files:**
- Modify: `scripts/verify-deployment-blog.mjs` (only if needed)

**Step 1:** Run `node scripts/verify-deployment-blog.mjs` and confirm PASS.
**Step 2:** Run `npm run build` and confirm Vite build succeeds.

### Task 5: Final review

**Step 1:** Confirm new post appears as separate post (do not remove existing startup post).
**Step 2:** Summarize changes with file references.
