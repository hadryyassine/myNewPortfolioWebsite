# Home Light Redesign Design

**Date:** 2026-03-01
**Scope:** Home page only (`/`) in light mode.

## Goal
Deliver a premium, non-flat homepage visual language with a layered patterned canvas and a central floating cream card while preserving the current dark mode look and behavior.

## Visual Direction
- Canvas: warm light-blue background with subtle geometric wireframe pattern.
- Outer frame: soft footer strip feel at the bottom of the viewport.
- Main card: central cream floating container with rounded corners and tactile depth.

## Content Hierarchy (inside card)
- Top row: logo mark on the left, nav links + moon icon on the right.
- Center: circular portrait, name, role, corrected bio sentence.
- Actions: pill-shaped CTAs with muted-teal primary and soft-neutral secondary actions.
- Socials: clear icon-only row in cohesive style.

## Interaction
- Theme toggle remains available via icon in top-right card nav.
- Dark mode keeps existing homepage visual style (no new canvas/card treatment).

## Layout/Responsiveness
- 320px-first spacing and wrapping.
- Top nav wraps on small screens.
- Action pills wrap without overlap.
- Social row remains centered and tappable.

## Out of Scope
- No redesign for Blog/Projects/Resources pages.
- No changes to content model or routing.

## Validation
- `npm run lint`
- `npm run build`
- Manual checks on 320px and desktop for `/` light and dark.
