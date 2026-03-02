# Resources Page Design

**Date:** 2026-03-01
**Owner:** Yassine Hadry portfolio

## Goal
Add a dedicated `/resources` page (not homepage) that presents curated recommendations and supports minimalist filtering/search, aligned with existing Blog/Projects UX.

## Scope
- Add a top-level `Resources` route and header nav item.
- Add curated resource data in source-controlled file (manual entries).
- Implement filtering by resource type through chips.
- Implement search through title/summary/note/tags/metadata.
- Keep visual language consistent with Blog/Projects pages.

## Information Architecture
- Dedicated page: `/resources`.
- Header navigation: `Projects`, `Blog`, `Resources`, theme toggle.
- Resource types:
  - Movies
  - Podcasts
  - Books
  - Places
  - Tools/Apps

## Data Design
Use manual curated entries in `src/resources/resources.js`.

Resource shape:
- `slug`: stable id
- `title`: resource name
- `type`: one of `movies | podcasts | books | places | tools-apps`
- `summary`: short description
- `note`: why it is recommended
- `author`: optional
- `year`: optional
- `location`: optional (places)
- `platform`: optional (tools/apps/podcasts)
- `tags`: optional string array
- `url`: destination link
- `featured`: optional boolean
- `dateAdded`: ISO date

Derived exports:
- `resourceTypeLabels`
- `allResourceTypes`
- `resources` sorted by `dateAdded` desc

## UI/Interaction Design
- Top row mirrors existing pages:
  - Title `Resources`
  - Minimal return icon back to home
  - Search input
- Filter row:
  - Chip-based type filters (multi-select)
  - Clear chip when active filters exist
- Content:
  - Featured strip (top picks)
  - Resource cards list
  - Card fields: title (link), type chip, note, optional metadata, tags
  - External link icon button for cleaner minimal action
- URL state:
  - `q` for query
  - repeated `type` params for selected types

## Behavior
- Search is case/diacritic-insensitive.
- Query matches title, summary, note, tags, author, platform, location.
- Type filtering is inclusive OR across selected types.
- Empty state: `No resources match your filters.`

## Responsiveness
- 320px-first layout.
- Header row uses wrap with stable return icon hit area.
- Search input full width on narrow screens.
- Chips wrap naturally.
- Cards keep readable spacing and avoid overflow.

## Accessibility
- Icon-only actions include `aria-label` + `sr-only` text.
- External links include clear labeling and open in new tab with `rel="noreferrer"`.
- Preserve contrast and existing dark/light behavior.

## Out of Scope
- No CMS/API integration.
- No per-resource detail pages in this phase.
- No automated recommendation scoring.

## Validation
- `npm run lint`
- `npm run build`
- Manual spot checks: `/`, `/blog`, `/projects`, `/resources`, and mobile width behavior.
