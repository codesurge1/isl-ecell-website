# Architecture

## Folder structure

```
/src
  /pages        one file per public page: Home, About, WhatWeDo, Events,
                Team, MemberProfile, Achievements, Gallery, Contact
  /components   shared UI (Button, Card, Navbar, Footer, etc.)
  /admin        admin panel pages, kept separate from /pages
  /lib          Supabase client + query functions (added in a later phase)
  /styles       global Tailwind entry, font imports
```

- `/pages` holds only top-level public route components. Page-specific
  sub-components that aren't reused elsewhere can live alongside the page
  or in `/components` if shared.
- `/components` holds UI shared across two or more pages/routes.
- `/admin` is a fully separate tree from `/pages` — admin views must never
  import from `/pages` and vice versa, aside from shared `/components`.
- `/lib` will hold the Supabase client and query/mutation functions. Public
  pages and admin pages both read from here — no direct Supabase calls
  scattered in components.
- `/styles` holds the global Tailwind entry point and font imports. No
  page- or component-level global CSS files.

## Routing

- All public pages are top-level routes (`/`, `/about`, `/what-we-do`,
  `/events`, `/team`, `/team/:memberId`, `/achievements`, `/gallery`,
  `/contact`).
- Everything under `/admin` is a separate route group (`/admin/login`,
  `/admin`, etc.). It will be gated behind auth in a later phase — for now
  it just needs to stay structurally separate from the public routes.
- The Team constellation page (`/team`) and the Member profile page
  (`/team/:memberId`) are two distinct routes, not one page with a modal.

## Naming conventions

- Components: PascalCase (`Navbar.jsx`, `MemberProfile.jsx`).
- Functions/variables: camelCase.
- File names other than component files: kebab-case (e.g. `supabase-client.js`).
