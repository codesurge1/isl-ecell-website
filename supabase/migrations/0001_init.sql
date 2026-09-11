-- ISL E-cell — initial schema, RLS policies, storage buckets, and seed data.
-- Run manually in the Supabase SQL Editor. Safe to re-run: bucket inserts are
-- idempotent; table/policy creation is not (drop first if re-running by hand).

begin;

create extension if not exists pgcrypto;

-- ============================================================================
-- Tables
-- ============================================================================

create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  domain text,
  parent_id uuid references members (id) on delete set null,
  bio text,
  photo_url text,
  socials jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail_url text,
  date date not null,
  external_link text,
  category text not null check (
    category in ('Workshops', 'Guest talks', 'Competitions', 'Flagship events')
  ),
  created_at timestamptz not null default now()
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  date date not null,
  created_at timestamptz not null default now()
);

create table gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  caption text,
  uploaded_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- Public (anon) + authenticated: read everything.
-- Only authenticated (the future admin login) can write.

alter table members enable row level security;
alter table events enable row level security;
alter table achievements enable row level security;
alter table gallery enable row level security;

create policy "Public read access" on members
  for select to anon, authenticated using (true);
create policy "Authenticated insert" on members
  for insert to authenticated with check (true);
create policy "Authenticated update" on members
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on members
  for delete to authenticated using (true);

create policy "Public read access" on events
  for select to anon, authenticated using (true);
create policy "Authenticated insert" on events
  for insert to authenticated with check (true);
create policy "Authenticated update" on events
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on events
  for delete to authenticated using (true);

create policy "Public read access" on achievements
  for select to anon, authenticated using (true);
create policy "Authenticated insert" on achievements
  for insert to authenticated with check (true);
create policy "Authenticated update" on achievements
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on achievements
  for delete to authenticated using (true);

create policy "Public read access" on gallery
  for select to anon, authenticated using (true);
create policy "Authenticated insert" on gallery
  for insert to authenticated with check (true);
create policy "Authenticated update" on gallery
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on gallery
  for delete to authenticated using (true);

-- ============================================================================
-- Storage buckets
-- ============================================================================
-- Public read on all four; writes restricted to authenticated, matching the
-- table policies above. Deletes of a row must also delete its storage object
-- (application-level concern — see .claude/rules/data-layer.md).

insert into storage.buckets (id, name, public)
values
  ('member-photos', 'member-photos', true),
  ('event-thumbnails', 'event-thumbnails', true),
  ('achievement-images', 'achievement-images', true),
  ('gallery-photos', 'gallery-photos', true)
on conflict (id) do nothing;

create policy "Public read access" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('member-photos', 'event-thumbnails', 'achievement-images', 'gallery-photos'));

create policy "Authenticated insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('member-photos', 'event-thumbnails', 'achievement-images', 'gallery-photos'));

create policy "Authenticated update" on storage.objects
  for update to authenticated
  using (bucket_id in ('member-photos', 'event-thumbnails', 'achievement-images', 'gallery-photos'))
  with check (bucket_id in ('member-photos', 'event-thumbnails', 'achievement-images', 'gallery-photos'));

create policy "Authenticated delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('member-photos', 'event-thumbnails', 'achievement-images', 'gallery-photos'));

-- ============================================================================
-- Seed data (dummy — no real images yet)
-- ============================================================================

-- members: root -> two VPs -> one nested lead (3 hierarchy levels)
insert into members (id, name, role, domain, parent_id, bio, socials) values
  ('11111111-1111-1111-1111-111111111111', 'Aditi Rao', 'President', 'Leadership', null,
   'Founding member and current president of ISL E-cell.', '{}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'Rohan Mehta', 'Vice President', 'Operations',
   '11111111-1111-1111-1111-111111111111',
   'Leads day-to-day operations and event logistics.', '{}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'Sara Iqbal', 'Vice President', 'Outreach',
   '11111111-1111-1111-1111-111111111111',
   'Leads outreach, partnerships, and sponsor relations.', '{}'::jsonb),
  ('44444444-4444-4444-4444-444444444444', 'Kabir Singh', 'Team Lead', 'Events',
   '22222222-2222-2222-2222-222222222222',
   'Coordinates flagship and recurring events under Operations.', '{}'::jsonb);

insert into events (title, description, date, category) values
  ('Startup Bootcamp', 'A weekend workshop covering ideation, validation, and pitching.',
   '2026-02-14', 'Workshops'),
  ('Founders Fireside Chat', 'A guest talk with a founder about building consistency.',
   '2026-03-02', 'Guest talks');

insert into achievements (title, description, date) values
  ('Winners — State Level Startup Challenge',
   'Our team placed first among 40+ colleges at the state entrepreneurship challenge.',
   '2025-11-20');

insert into gallery (caption) values
  ('Team at the annual induction meet');

commit;
