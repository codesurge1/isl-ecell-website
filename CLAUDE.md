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

## Color palette (locked)

| Role | Hex |
|---|---|
| Background base | #05070D |
| Background mid (navy) | #0E1B33 |
| Primary text | #FFFFFF |
| Secondary text | #C6D0E0 |
| Brand accent (CTAs, active states) | #B31E2D |
| Glow accent (constellation only) | #8FD9FF |

## Typography

- Headings: Space Grotesk (Google Fonts)
- Body: Inter (Google Fonts)

## Hard rules

- Always read PLAN.md before starting work in a new session. Always log any
  bug encountered and its fix to ERRORS.md before considering a task done.
- Never commit Supabase keys or secrets to the repo. Environment variables
  only, via `.env` (gitignored).

See `.claude/rules/architecture.md`, `.claude/rules/design-system.md`, and
`.claude/rules/data-layer.md` for detailed conventions.
