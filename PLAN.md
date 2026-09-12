# Roadmap

- [x] Phase 0 — Project skeleton, folder structure, stack installed, documentation files created
- [x] Connect Supabase — tables, RLS policies, storage buckets, dummy seed data
      Note: Schema is defined in /supabase/migrations/0001_init.sql — must be
      run manually in the Supabase SQL Editor before real data can be fetched.
- [x] Team constellation (Phases 1-3) — visual draft against real Supabase
      data, member profile page + orb-to-profile click-through transition,
      mobile accordion fallback below the md breakpoint
- [x] Header/Footer — real Navbar (active-route indicator, sticky/scroll
      background treatment, mobile hamburger menu) and Footer (socials,
      tagline, copyright), replacing the Phase 0 placeholders
- [x] Home — hero, stats, bento-grid teaser (Events/Team/Achievements), closing CTA
- [x] About — Our Story + What We Do (four category cards); "What We Do"
      is no longer a standalone page/nav item, its content merged into
      About
- [x] Events & timeline — category filter chips synced to a ?category= URL
      param, Upcoming/Past split, expand-in-place or external-link cards
- [x] Achievements — simple reverse-chronological card grid, no filters
- [x] Gallery — CSS-columns masonry with stylized placeholders, lightbox
      with focus trap/return, no filters
- [x] Contact — static page (no Supabase calls): mailto link, location,
      social links; no contact form, no join/recruitment mention
- [ ] Admin panel — login, manage members/events/achievements/gallery
      - [x] Auth layer: Supabase email/password login (/admin/login),
            ProtectedRoute session gate on all other /admin/* routes,
            session persists across refresh, logout clears the session
      - [x] Members CRUD (/admin/members): list with hierarchy indentation
            and resolved "Reports to" names, add/edit form (photo upload to
            member-photos with old-file cleanup, socials, cycle-safe
            "Reports to" dropdown via getDescendantIds), delete blocked
            while a member has direct reports
      - [x] Events CRUD (/admin/events): list sorted most-recent-first,
            add/edit form (thumbnail upload to event-thumbnails with
            old-file cleanup, category dropdown matching the enum exactly,
            external_link URL validation), delete with confirmation +
            storage cleanup
      - [x] Achievements upload/delete (/admin/achievements): list sorted
            most-recent-first, add-only form (image upload to
            achievement-images, optional per schema), delete with
            confirmation + storage cleanup — no edit form, per scope
      - [ ] Gallery CRUD
- [ ] Real data population (members, events, achievements, gallery)
- [ ] QA pass

## Known follow-ups

- Home page stats section uses placeholder numbers, must be replaced with
  real figures before launch.
- About page's "Our Story" section is placeholder copy; real copy to be
  supplied by the user before launch.
- Contact page uses placeholder social URLs (Instagram/LinkedIn both
  "#"), a placeholder email (ecell@islengineering.edu.in), and
  placeholder location text ("ISL Engineering College, [Building/Room
  TBD]") — all three need real values before launch.
