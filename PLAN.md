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
- [ ] Achievements
- [ ] Gallery
- [ ] Contact
- [ ] Admin panel — login, manage members/events/achievements/gallery
- [ ] Real data population (members, events, achievements, gallery)
- [ ] QA pass

## Known follow-ups

- Home page stats section uses placeholder numbers, must be replaced with
  real figures before launch.
- /events now supports ?category=<value> filtering, but About page's
  "What We Do" category cards still link to /events plain — this task's
  instructions explicitly excluded touching About.jsx, so update those
  4 links (Workshops/Guest talks/Competitions/Flagship events) to
  /events?category=<value> as a small follow-up.
- About page's "Our Story" section is placeholder copy; real copy to be
  supplied by the user before launch.
