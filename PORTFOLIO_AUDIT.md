# Portfolio Website — Technical Audit Report

**Date:** March 8, 2026
**Auditor:** Claude (Technical Consultant)
**Stack:** React 19 + Vite 7 + Tailwind CSS 3 + Framer Motion 12 + MDX

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture & Code Quality](#2-architecture--code-quality)
3. [Performance & Loading](#3-performance--loading)
4. [Motion & Animation](#4-motion--animation)
5. [UX & Design](#5-ux--design)
6. [SEO & Discoverability](#6-seo--discoverability)
7. [Accessibility](#7-accessibility)
8. [Feature Suggestions](#8-feature-suggestions)
9. [Priority Roadmap](#9-priority-roadmap)

---

## 1. Executive Summary

**What's working well:**
- Solid MDX-based blog system with frontmatter, categories, and reading time
- Good SEO foundation (JSON-LD, OG tags, canonical URLs, sitemap)
- WebP image adoption for slide assets
- `prefers-reduced-motion` respected throughout
- LiteYouTubeEmbed is a smart performance choice
- Dark/light theme with localStorage persistence

**Critical issues:**
- Massive code duplication in `Home.jsx` (entire component duplicated for light/dark)
- Duplicated conditional logic in `App.jsx` Layout (same classes repeated 7 times)
- No error boundaries — a single crash takes down the whole app
- `photo.png` (614 KB) served alongside `profile.jpg` (82 KB) — unclear which is used where
- Boot loader blocks ALL content for 220ms minimum, even on fast connections
- Missing loading states for Dialog content (Career, Education, Skills modals)
- `will-change: transform, opacity` permanently set on home card (GPU memory leak)

---

## 2. Architecture & Code Quality

### 2.1 — Home.jsx: Full Component Duplication (CRITICAL)

The entire Home component renders two completely separate JSX trees — one for dark, one for light — branched with `if (isDark)`. This is ~440 lines where ~90% of the structure is identical and only color values differ.

**Impact:** Every feature change or layout fix must be applied in two places. Bug surface area is doubled.

**Fix:** Extract a single `<HomeLayout>` component and pass theme-derived style objects or Tailwind class maps:

```jsx
// theme maps
const themes = {
  light: {
    card: 'home-float-card',
    primary: 'bg-[#6f9ca2] text-white hover:bg-[#5f8c93]',
    secondary: 'bg-[#f1f2ee] text-[#314148] hover:bg-[#e9ece7]',
    // ...
  },
  dark: {
    card: 'home-float-card-dark',
    primary: 'bg-[#446b77] text-[#ecf4f7] hover:bg-[#507d8b]',
    secondary: 'bg-[#1b242b] text-[#cad6de] hover:bg-[#232f38]',
    // ...
  },
}
// Then one JSX tree using themes[isDark ? 'dark' : 'light']
```

### 2.2 — Layout className Duplication (HIGH)

`App.jsx` lines 40–65: The same `isDark ? 'min-h-svh bg-[#121b24] text-neutral-100' : 'min-h-svh bg-[#e7f0f4] text-neutral-800'` is repeated for every route check. All branches produce the same result except the fallback.

**Fix:** Simplify to:

```jsx
const baseClass = isDark
  ? 'min-h-svh bg-[#121b24] text-neutral-100'
  : 'min-h-svh bg-[#e7f0f4] text-neutral-800'
```

One line instead of 25.

### 2.3 — No Error Boundaries

A rendering error in any blog post, dialog, or component will crash the entire app with a white screen. There are no `ErrorBoundary` components anywhere.

**Fix:** Add error boundaries at:
1. App level (global fallback)
2. Route level (around `<Outlet>`)
3. Blog post level (around MDX content)

### 2.4 — Hardcoded Colors Everywhere

Over 50 unique hex values are hardcoded inline (`#121b24`, `#e7f0f4`, `#6f9ca2`, `#2f4952`, etc.). These aren't in `tailwind.config.js` or CSS variables.

**Fix:** Define a semantic color palette in `tailwind.config.js`:

```js
colors: {
  surface: { light: '#e7f0f4', dark: '#121b24' },
  card: { light: '#fcf7ee', dark: '#15212a' },
  accent: { DEFAULT: '#6f9ca2', hover: '#5f8c93' },
  muted: { light: '#4b5e66', dark: '#9fb0bc' },
}
```

### 2.5 — Missing TypeScript

The entire project uses `.jsx` with no type safety. This makes refactoring risky and reduces IDE support.

**Recommendation:** Migrate incrementally — start with `tsconfig.json`, rename key files to `.tsx`, and add prop types to shared components.

---

## 3. Performance & Loading

### 3.1 — Boot Loader: Forced 220ms Delay (HIGH)

`BOOT_MINIMUM_MS = 220` in `performance.js` blocks the entire app even when everything is cached and ready. On repeat visits, this is pure wasted time.

**Fix:**
- Remove the minimum delay entirely, or reduce to 50ms
- Use `startTransition` to show content immediately and let images load progressively
- Only show the loader if boot takes >300ms (perceived performance pattern)

```js
// Show loader only if boot is slow
const LOADER_THRESHOLD_MS = 300
useEffect(() => {
  const timer = setTimeout(() => setShowLoader(true), LOADER_THRESHOLD_MS)
  // When ready, clear timer and hide loader
  return () => clearTimeout(timer)
}, [])
```

### 3.2 — Eager Loading of Blog and Resources Pages (MEDIUM)

`Blog` and `UnderConstruction` pages are statically imported in `App.jsx` — they ship in the main bundle even if the user only visits the home page.

**Fix:** Lazy-load all route components:

```jsx
const Blog = lazy(() => import('./pages/Blog'))
const Home = lazy(() => import('./pages/Home'))
```

### 3.3 — `photo.png` is 614 KB (HIGH)

This file is 7.5x larger than `profile.jpg` (82 KB). If it's the same image, delete one. If different, convert `photo.png` to WebP.

**Fix:**
- Audit which is actually used (currently `profile.jpg` via `profileData.photo`)
- Delete unused `photo.png` or convert to WebP (~50-80 KB)
- Add `srcSet` with multiple sizes:

```jsx
<img
  src="/profile.webp"
  srcSet="/profile-256.webp 256w, /profile-512.webp 512w"
  sizes="(max-width: 640px) 128px, 144px"
/>
```

### 3.4 — Blog Posts Eagerly Loaded via `import.meta.glob` (MEDIUM)

`posts.js` uses `{ eager: true }` which imports ALL blog post MDX content into the main bundle — even when only listing titles on `/blog`.

**Fix:** Split metadata from content:
- Keep frontmatter extraction eager (small data)
- Lazy-load the actual MDX component only when viewing a post

```js
const postModules = import.meta.glob('./blog/*.mdx') // lazy by default
const postMeta = import.meta.glob('./blog/*.mdx', {
  eager: true,
  import: 'frontmatter',
})
```

### 3.5 — No Image Optimization Pipeline

Images are manually converted to WebP. No automated pipeline, no responsive sizes, no AVIF support.

**Fix:** Add `vite-imagetools` or `sharp` script:

```js
import profileImg from './assets/profile.jpg?w=256;512&format=webp&as=srcset'
```

### 3.6 — `will-change` Permanently Applied

```css
.home-float-card { will-change: transform, opacity; }
```

This is always active, consuming GPU memory even when the card is static.

**Fix:** Only apply during animation, then remove:

```jsx
<Motion.div
  onAnimationStart={() => setWillChange(true)}
  onAnimationComplete={() => setWillChange(false)}
  style={{ willChange: willChange ? 'transform, opacity' : 'auto' }}
>
```

Or just remove it — Framer Motion handles GPU promotion automatically.

### 3.7 — No Font Optimization

Inter is loaded from Google Fonts with no `font-display`, no preload, no subsetting.

**Fix:**
- Add `<link rel="preload" as="font" ...>` for Inter
- Use `font-display: swap` to prevent FOIT
- Consider self-hosting the font (use `@fontsource/inter`)
- Subset to latin to reduce font file size

### 3.8 — Missing Compression Headers

No mention of gzip/brotli configuration for the production deployment.

**Fix:** Ensure your hosting provider or `vite.config.js` enables Brotli compression:

```js
import viteCompression from 'vite-plugin-compression'
plugins: [viteCompression({ algorithm: 'brotliCompress' })]
```

---

## 4. Motion & Animation

### 4.1 — Current State Assessment

**What exists:**
| Animation | Location | Type |
|-----------|----------|------|
| Page transitions | App.jsx | Fade + slide (y: 8 → 0) via AnimatePresence |
| Card float-in | Home.jsx | Fade + slide (opacity 0→1, y 8→0) |
| Button hover | InfoDialog | Spring y: -1 lift |
| Timeline items | Timeline.jsx | Staggered fade-in |
| Skill icons | SkillCategoriesPanel.jsx | Staggered fade-in |
| Blog cards | Blog.jsx | whileHover scale |
| YouTube thumb | LiteYouTubeEmbed.jsx | Hover scale |

**What's missing:** Scroll-triggered animations, micro-interactions, layout animations, shared element transitions, gesture-based interactions, loading skeleton animations, hero entrance choreography.

### 4.2 — Recommended Motion Enhancements

#### A. Hero Entrance Choreography (Home Page)

Currently, the entire card fades in as one block. A staggered entrance creates much more impact:

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1, y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 },
  },
}

// Apply to each section: avatar, name, headline, buttons, socials
<Motion.div variants={container} initial="hidden" animate="show">
  <Motion.img variants={item} ... />     {/* Avatar */}
  <Motion.h1 variants={item} ... />      {/* Name */}
  <Motion.p variants={item} ... />       {/* Headline */}
  <Motion.div variants={item} ... />     {/* Buttons */}
  <Motion.div variants={item} ... />     {/* Socials */}
</Motion.div>
```

#### B. Scroll-Triggered Animations (Blog & Resources)

Use Framer Motion's `whileInView` for blog cards and sections:

```jsx
<Motion.article
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
```

#### C. Dialog Open/Close Animations

Current Radix dialogs snap open/closed with no animation.

```jsx
<Dialog.Overlay asChild>
  <Motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm"
  />
</Dialog.Overlay>

<Dialog.Content asChild>
  <Motion.div
    initial={{ opacity: 0, scale: 0.96, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96, y: 8 }}
    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
  >
    ...
  </Motion.div>
</Dialog.Content>
```

#### D. Social Icon Hover Micro-interactions

Replace simple color transitions with playful hover effects:

```jsx
<Motion.a
  whileHover={{ y: -3, scale: 1.12 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  <Github />
</Motion.a>
```

#### E. Blog Card Hover Effects

Add depth and reveal effects on blog cards:

```jsx
<Motion.article
  whileHover={{
    y: -4,
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  }}
>
  {/* Arrow slides in on hover */}
  <Motion.span
    initial={{ x: -8, opacity: 0 }}
    whileHover={{ x: 0, opacity: 1 }}
  >
    →
  </Motion.span>
</Motion.article>
```

#### F. Page Transition Enhancement

Current: simple fade with y offset. Better: different transitions per route type.

```jsx
const pageVariants = {
  blogList: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  blogPost: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  home: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
}
```

#### G. Smooth Layout Animations for Filtering

When filtering blog posts by category, cards should animate in/out smoothly:

```jsx
import { LayoutGroup, AnimatePresence } from 'framer-motion'

<LayoutGroup>
  <AnimatePresence mode="popLayout">
    {filteredPosts.map(post => (
      <Motion.article
        key={post.slug}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      />
    ))}
  </AnimatePresence>
</LayoutGroup>
```

#### H. Skeleton Loading Animations

Replace the spinner-based SiteLoader with content-aware skeletons:

```jsx
function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="mt-3 h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="mt-2 h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="mt-1 h-4 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
    </div>
  )
}
```

#### I. Avatar Hover Ring Animation

```jsx
<Motion.div
  className="relative"
  whileHover="hover"
>
  <Motion.div
    className="absolute -inset-1 rounded-full border-2 border-accent"
    variants={{
      hover: { scale: 1.06, opacity: 1 },
    }}
    initial={{ scale: 1, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 300 }}
  />
  <img src={profileData.photo} className="rounded-full" />
</Motion.div>
```

#### J. Theme Toggle Animation

Instead of instant swap, animate the icon transition:

```jsx
<Motion.button onClick={onToggleTheme}>
  <AnimatePresence mode="wait" initial={false}>
    <Motion.div
      key={isDark ? 'sun' : 'moon'}
      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }}
    >
      {isDark ? <Sun /> : <Moon />}
    </Motion.div>
  </AnimatePresence>
</Motion.button>
```

---

## 5. UX & Design

### 5.1 — No Visual Feedback on Navigation

When clicking a nav link, there's no active state indicator. Users can't tell which page they're on.

**Fix:** Add active route highlighting:

```jsx
<NavLink
  to="/blog"
  className={({ isActive }) =>
    isActive
      ? 'text-accent font-medium border-b-2 border-accent'
      : 'text-muted hover:text-foreground'
  }
>
```

### 5.2 — Dialog Has No Scroll Lock

When opening Career/Education/Skills dialogs, the background page can still scroll. Radix Dialog handles this by default, but verify `overflow: hidden` is applied to `<body>`.

### 5.3 — No "Back to Top" Button

Long blog posts have no way to scroll back to top.

**Fix:** Add a floating "back to top" button that appears after scrolling 400px:

```jsx
<Motion.button
  initial={{ opacity: 0 }}
  animate={{ opacity: scrollY > 400 ? 1 : 0 }}
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className="fixed bottom-6 right-6 rounded-full bg-accent p-3 shadow-lg"
>
  <ArrowUp />
</Motion.button>
```

### 5.4 — Blog Search Has No Debounce

Every keystroke triggers a re-render and re-filter. With 2 posts this is fine, but it won't scale.

**Fix:** Add a 200ms debounce:

```jsx
const [query, setQuery] = useState('')
const debouncedQuery = useDeferredValue(query) // React 19 built-in
```

### 5.5 — Empty States Are Generic

When no blog posts match a search, the empty state is basic text. Make it memorable:

**Fix:** Add an illustration or animation for empty states.

### 5.6 — No Reading Progress Indicator

Long blog posts (18 min read) have no visual progress indicator.

**Fix:** Add a slim progress bar at the top of the viewport:

```jsx
const { scrollYProgress } = useScroll()
<Motion.div
  style={{ scaleX: scrollYProgress }}
  className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-50"
/>
```

### 5.7 — No Table of Contents for Blog Posts

The deployment strategies post is long (18 min). No TOC for navigation.

**Fix:** Parse MDX headings and generate a sticky sidebar TOC with smooth scroll.

### 5.8 — CV/Resume Download Missing

There's a `cvUrl` in profile data but no visible download button.

**Fix:** Add a "Download CV" button to the home page or a dedicated route.

---

## 6. SEO & Discoverability

### 6.1 — Missing Blog RSS/Atom Feed

No RSS feed for blog subscribers.

**Fix:** Generate at build time with a script:

```js
// scripts/generate-rss.mjs
// Output: /public/feed.xml
```

### 6.2 — Missing `<meta name="theme-color">`

Browsers and mobile devices can match the address bar to your site color.

```html
<meta name="theme-color" content="#e7f0f4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121b24" media="(prefers-color-scheme: dark)">
```

### 6.3 — Sitemap May Be Stale

`sitemap.xml` is static in `/public`. New blog posts require manual updates.

**Fix:** Generate sitemap automatically in the `seo:generate` script and run it as part of the build pipeline.

### 6.4 — No `hreflang` or Language Declaration

The HTML `lang` attribute should be set. Check `index.html`.

### 6.5 — Blog Posts Need Better Structured Data

Add `wordCount`, `articleBody` excerpt, and `dateModified` to BlogPosting schema.

---

## 7. Accessibility

### 7.1 — Color Contrast Issues

Several text colors on the home page may not meet WCAG AA:
- `#9fb0bc` on `#121b24` (dark mode muted text) — ratio ~4.1:1 (borderline)
- `#b8c6d1` on dark backgrounds — likely fails for small text
- `#4b5e66` on `#fcf7ee` (light mode blurb) — verify ratio

**Fix:** Run all color pairs through a contrast checker and adjust. Aim for 4.5:1 minimum for body text.

### 7.2 — Dialog Focus Management

Verify that:
- Focus traps inside dialog when open
- Focus returns to trigger button on close
- Escape key closes the dialog

Radix Dialog handles this, but custom overrides could break it.

### 7.3 — Missing Skip Navigation Link

No "Skip to content" link for keyboard users.

**Fix:**
```jsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 ...">
  Skip to content
</a>
```

### 7.4 — Image Alt Text Audit

- Logo images use `alt="Yassine Hadry"` — should be more descriptive: `alt="YH Logo"`
- Blog slide images may lack alt text in the SlideDeck component

### 7.5 — Form Inputs Missing Labels

The blog search input should have an associated `<label>` element (not just placeholder text).

---

## 8. Feature Suggestions

### 8.1 — Must-Have (High Impact, Low Effort)

| Feature | Why | Effort |
|---------|-----|--------|
| **Error Boundaries** | Prevents white-screen crashes | 1-2 hours |
| **Reading progress bar** | Improves long-post UX | 30 min |
| **Active nav indicator** | Basic navigation UX | 30 min |
| **Theme toggle animation** | Polish at low cost | 30 min |
| **Dialog animations** | Dialogs feel broken without them | 1 hour |
| **Skeleton loaders** | Better perceived performance | 1-2 hours |

### 8.2 — Should-Have (High Impact, Medium Effort)

| Feature | Why | Effort |
|---------|-----|--------|
| **Table of Contents** | Navigate long posts | 3-4 hours |
| **RSS Feed** | Blog discoverability | 2 hours |
| **Blog post image cards** | Visual appeal in blog list | 2-3 hours |
| **Contact form** | Convert visitors to leads | 3-4 hours |
| **Projects showcase** | Currently "Under Construction" | 1-2 days |
| **Code block copy button** | Essential for technical blog | 1-2 hours |
| **View transition API** | Smoother route changes (Chrome) | 2-3 hours |

### 8.3 — Nice-to-Have (Medium Impact, Higher Effort)

| Feature | Why | Effort |
|---------|-----|--------|
| **Blog post reactions** (local) | Engagement without auth | 3-4 hours |
| **Estimated scroll time remaining** | Novel UX element | 2 hours |
| **Command palette** (⌘K) | Power user navigation | 4-6 hours |
| **Animated gradient mesh background** | Visual wow factor | 3-4 hours |
| **Blog post sharing buttons** | Social reach | 1-2 hours |
| **Dark mode transition** | Smooth cross-fade between themes | 2-3 hours |
| **Cursor spotlight effect** | Subtle radial gradient follows cursor on hero | 2 hours |
| **Magnetic buttons** | Buttons subtly pull toward cursor | 2-3 hours |
| **Noise texture overlay** | Adds depth to flat surfaces | 30 min |
| **Parallax scroll sections** | Depth on scroll | 3-4 hours |
| **Interactive terminal hero** | Show commands typing out | 4-6 hours |

### 8.4 — DevOps/Engineering-Specific Ideas

Given your DevOps focus, consider:

| Feature | Description |
|---------|-------------|
| **Live infrastructure dashboard** | Embed a small status widget (uptime, deployments) |
| **Interactive deployment strategy visualizer** | Animated diagrams for Blue/Green, Canary, etc. |
| **GitHub contribution graph** | Show your open source activity |
| **Tech stack architecture diagram** | Interactive diagram of your portfolio's own stack |
| **Blog post "Playground"** | Embed runnable code snippets via WebContainers or StackBlitz |

---

## 9. Priority Roadmap

### Phase 1 — Fix Critical Issues (Week 1)

- [ ] Refactor `Home.jsx` — eliminate duplication with theme maps
- [ ] Simplify `Layout` className logic in `App.jsx`
- [ ] Add Error Boundaries (App, Route, MDX levels)
- [ ] Remove or reduce boot loader delay
- [ ] Delete unused `photo.png` or convert to WebP
- [ ] Remove permanent `will-change` from CSS
- [ ] Lazy-load `Blog`, `Home`, and other route components
- [ ] Define semantic color palette in Tailwind config

### Phase 2 — Motion & Polish (Week 2)

- [ ] Hero entrance choreography (staggered elements)
- [ ] Dialog open/close animations
- [ ] Theme toggle rotation animation
- [ ] Social icon hover micro-interactions
- [ ] Blog card hover depth effects
- [ ] Scroll-triggered animations for blog list
- [ ] Layout animations for category filtering
- [ ] Reading progress bar for blog posts
- [ ] Active nav indicator

### Phase 3 — Features (Week 3-4)

- [ ] Table of Contents for long posts
- [ ] Code block copy button
- [ ] Skeleton loading states
- [ ] RSS feed generation
- [ ] Blog post cover images
- [ ] Skip navigation link
- [ ] Back to top button
- [ ] Contact form or improved CTA
- [ ] Font optimization (self-host Inter, add preload)

### Phase 4 — Ship Projects Section (Week 4+)

- [ ] Design project card layout
- [ ] Build 2-3 project case studies
- [ ] Add project filtering by tech stack
- [ ] Interactive demos or screenshots
- [ ] Remove "Under Construction" state

---

## Appendix: File-by-File Issues

| File | Issue | Severity |
|------|-------|----------|
| `src/pages/Home.jsx` | Full component duplication (440 lines) | Critical |
| `src/App.jsx:40-65` | 25 lines of identical conditional classes | High |
| `src/index.css:232-233` | Permanent `will-change` on card | Medium |
| `src/utils/performance.js` | 220ms forced boot delay | High |
| `src/blog/posts.js` | Eager MDX loading bundles all content | Medium |
| `src/App.jsx:8-10` | Blog/Home not lazy-loaded | Medium |
| `public/photo.png` | 614 KB unused or redundant asset | High |
| `src/App.css` | Legacy Vite template CSS still present | Low |
| `src/components/MDXProvider.jsx` | Empty components object, minimal wrapper | Low |
| `tailwind.config.js` | No semantic color tokens defined | Medium |

---

*This audit focuses on actionable improvements. Each recommendation includes the specific file, the problem, and a concrete solution. Prioritize Phase 1 to fix structural issues before adding new features.*
