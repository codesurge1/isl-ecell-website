# ISL E-cell Website

ISL E-cell (Entrepreneurship Cell) website: a public marketing site covering
the club's activities, events, team, and achievements, plus a small gated
admin panel for managing that content. Built as a static-ish React SPA
backed by Supabase for data and storage.

## Tech stack

- React + Vite
- Tailwind CSS (v4, via `@tailwindcss/vite`)
- Framer Motion (animations/transitions)
- React Router (public pages + a separate gated `/admin` route group)
- Supabase (database, auth, storage) — added in a later phase

## Color palette (current identity)

| Role | Hex |
|---|---|
| Base black | #0A0A0A |
| Red (primary accent, used boldly) | #B31E2D |
| Primary text | #FFFFFF |
| Muted/secondary text | #8A8A8A |
| Glow accent (Team constellation only) | #9D7FE8 |

Not-yet-redesigned pages still run on an older navy/cosmic palette
(#05070D base, #0E1B33 navy mid, #C6D0E0 secondary text) — see
`.claude/rules/design-system.md` for the full legacy table and migration
note. Navbar, Footer, and Button have already moved to the palette above.

## Typography

- Display/headlines: Anton (Google Fonts) — the Navbar/Footer wordmark
  uses it now; page headings migrate to it as each page is redesigned.
- Body/UI: Inter (Google Fonts)
- Legacy heading font (Space Grotesk) still used by not-yet-redesigned
  pages.

## Hard rules

- Always read PLAN.md before starting work in a new session. Always log any
  bug encountered and its fix to ERRORS.md before considering a task done.
- Never commit Supabase keys or secrets to the repo. Environment variables
  only, via `.env` (gitignored).

See `.claude/rules/architecture.md`, `.claude/rules/design-system.md`, and
`.claude/rules/data-layer.md` for detailed conventions.
