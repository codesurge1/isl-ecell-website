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

Red is also the site's single glow/accent color, including the Team
constellation's orb glow and connector-line effects — see
`--color-glow-accent` / `--color-glow-accent-rgb` in `src/styles/
globals.css`, which supply the same red as a layered rgba() box-shadow
(real light-emission via 2-3 stacked shadows, not a flat colored ring)
rather than a solid fill. This used to be a dedicated violet (#9D7FE8)
reserved exclusively for Team; that carve-out is retired as of Team's own
redesign, so violet should not appear anywhere in the codebase.

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

- Display/headlines: Anton — bold, condensed, high-impact, but only at
  actual display sizes (tested: reads great at 32px+). At small UI sizes
  like an 18px nav wordmark its mixed-case letterforms compress and read
  cramped rather than bold — verified by rendering the real font, not
  guessed from a screenshot where the webfont had silently failed to load.
  Reserved for page headlines as pages are redesigned; not used in the
  Navbar/Footer wordmark for this reason.
- Body/UI: Inter. Nav links stay Inter at regular weight; the Navbar/
  Footer wordmark uses Inter at font-bold (700) rather than Anton, for the
  small-size legibility reason above.
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
