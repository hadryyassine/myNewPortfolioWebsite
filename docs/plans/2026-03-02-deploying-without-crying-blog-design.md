# Deploying Without Crying Blog Design

## Scope
- Add a **new** blog post (do not replace the existing startup post).
- Date fixed to **2026-02-26**.
- Include the YouTube talk and detailed, explanatory content.
- Present local slides as an in-page slide experience (not raw PDF-only embedding).
- Show real code excerpts from the demo repository and explain each deployment strategy.

## Content Architecture
1. Talk embed section
2. Interactive slide deck section
3. Deep-dive sections per strategy:
   - Big Bang
   - Rolling
   - Blue/Green
   - Canary
   - Feature Toggles
4. Practical strategy selection guide
5. Release checklist and closing

## Technical Design
- New reusable component: `src/components/SlideDeck.jsx`
  - Inputs: `pdfUrl`, `totalPages`, `startPage`, `title`
  - Renders in-page iframe with `#page=` navigation
  - Provides next/previous controls, page indicator, and open-in-new-tab link
- New MDX post imports `SlideDeck` and uses existing MDX routing/rendering pipeline.
- No changes required to blog routing (`src/blog/posts.js` auto-discovers new file).

## Constraints
- Keep current blog UI and discovery behavior unchanged.
- Keep implementation lightweight (no new heavy PDF dependencies).
- Use existing slide PDF at `public/blog/slides-blog-deployment-without-crying.pdf`.

## Verification Plan
- Automated content checks via `scripts/verify-deployment-blog.mjs`.
- Production build check via `npm run build`.
