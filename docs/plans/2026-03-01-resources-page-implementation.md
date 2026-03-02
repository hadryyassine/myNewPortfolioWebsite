# Resources Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dedicated `/resources` page with manual curated entries, search, and type-chip filtering consistent with Blog/Projects.

**Architecture:** Keep resources as a local data module and build one listing page that mirrors existing page patterns (search + chips + list cards + return icon). Use URL search params to persist filters and enable shareable state.

**Tech Stack:** React 19, React Router, TailwindCSS, Lucide icons, Vite.

---

### Task 1: Add Resources Data Module

**Files:**
- Create: `src/resources/resources.js`

**Step 1: Define resource type labels and seed curated resources**
```js
export const resourceTypeLabels = {
  movies: 'Movies',
  podcasts: 'Podcasts',
  books: 'Books',
  places: 'Places',
  'tools-apps': 'Tools/Apps',
}

const data = [
  { slug: '...', title: '...', type: 'books', ... }
]
```

**Step 2: Export sorted resources and all types**
```js
export const resources = [...data].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
export const allResourceTypes = Object.keys(resourceTypeLabels)
```

### Task 2: Create Resources Page

**Files:**
- Create: `src/pages/Resources.jsx`
- Modify: `src/pages/Blog.jsx` (reuse patterns reference only, no behavior changes)

**Step 1: Build page shell and SEO**
- Add `SEO`, `site`, and `useViewportSpace` usage.
- Add title row with return icon to `/` and search field.

**Step 2: Implement URL-based filters**
- Use `useSearchParams` with:
  - `q` string
  - repeated `type` params
- Add helper `toggleSet` and `normalize`.

**Step 3: Implement filtered list and featured list**
- `filtered` via `useMemo` using query + types.
- `featured` from filtered with `featured === true`.
- Render minimal cards with metadata/tags and external link icon.

### Task 3: Wire Route and Header Navigation

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Header.jsx`

**Step 1: Add route**
```jsx
<Route path="/resources" element={<Resources />} />
```

**Step 2: Add nav item**
- Add `NavLink` labeled `Resources` with same active/hover styles.

### Task 4: Verify and Stabilize

**Files:**
- Modify as needed from verification feedback

**Step 1: Lint**
Run: `npm run lint`
Expected: exit code 0

**Step 2: Build**
Run: `npm run build`
Expected: exit code 0 (allowing known Node version warning if present)

**Step 3: Manual UX spot checks**
- Confirm `/resources` filters/search update URL and results.
- Confirm header nav and return icon placement on mobile widths.

