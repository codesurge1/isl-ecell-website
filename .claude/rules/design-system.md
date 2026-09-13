---
description: Design system — colors, typography, animation conventions
globs: "src/components/**,src/pages/**,src/styles/**"
alwaysApply: false
---

# Design system

## Color palette (current identity)

| Role | Hex |
|---|---|
| Base black | #0A0A0A |
| Red (primary accent — used boldly and often: active states, headlines, CTAs, section markers) | #B31E2D |
| Primary text | #FFFFFF |
| Muted/secondary text | #8A8A8A |
| Glow accent (Team constellation only — never elsewhere) | #9D7FE8 |

Do not introduce new colors outside this palette without updating this file
first.

### Legacy palette (pages pending redesign)

Not-yet-redesigned pages still use the older navy/cosmic palette below.
Migrate a page off this list as part of its own redesign pass — don't mix
old and new tokens within the same component.

| Role | Hex |
|---|---|
| Background base | #05070D |
| Background mid (navy) | #0E1B33 |
| Secondary text | #C6D0E0 |

## Typography

- Display/headlines: Anton — bold, condensed, high-impact. Used for the
  Navbar/Footer wordmark and will extend to page headlines as pages are
  redesigned.
- Body/UI: Inter. Nav links and other UI-level text stay Inter even where
  they sit next to an Anton wordmark.
- Legacy heading font (Space Grotesk) still applies to not-yet-redesigned
  page headings — migrate to Anton as part of each page's redesign pass.
- Sizes and weights are left flexible for now — will be refined in Phase 1.
  Don't hardcode a final type scale yet.

## Animation conventions

- Use Framer Motion for all transitions and entrance/exit animations —
  no raw CSS keyframes for anything Framer Motion can express.
- Every animation must respect `prefers-reduced-motion` (fall back to an
  instant/no-op transition when it's set).
- Hero entrance animations must total under ~1 second.
