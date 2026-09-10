---
description: Design system — colors, typography, animation conventions
globs: "src/components/**,src/pages/**,src/styles/**"
alwaysApply: false
---

# Design system

## Color palette (locked)

| Role | Hex |
|---|---|
| Background base | #05070D |
| Background mid (navy) | #0E1B33 |
| Primary text | #FFFFFF |
| Secondary text | #C6D0E0 |
| Brand accent (CTAs, active states) | #B31E2D |
| Glow accent (constellation only) | #8FD9FF |

Do not introduce new colors outside this palette without updating this file
first.

## Typography

- Headings: Space Grotesk.
- Body: Inter.
- Sizes and weights are left flexible for now — will be refined in Phase 1.
  Don't hardcode a final type scale yet.

## Animation conventions

- Use Framer Motion for all transitions and entrance/exit animations —
  no raw CSS keyframes for anything Framer Motion can express.
- Every animation must respect `prefers-reduced-motion` (fall back to an
  instant/no-op transition when it's set).
- Hero entrance animations must total under ~1 second.
