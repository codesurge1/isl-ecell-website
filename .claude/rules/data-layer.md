---
description: Data layer — Supabase schema and access rules
globs: "src/lib/**"
alwaysApply: false
---

# Data layer

Public reads allowed on all four tables. Writes require an authenticated
admin session. Deletes must also remove the associated file from Supabase
Storage, not just the database row.

Supabase is not connected yet (see PLAN.md). This documents the target
schema so future sessions build against the right shape.

## members

- `name`
- `role`
- `domain`
- `parent_id`
- `bio`
- `photo_url`
- `socials`

## events

- `title`
- `description`
- `thumbnail_url`
- `date`
- `external_link` (nullable)
- `category` (enum: `Workshops`, `Guest talks`, `Competitions`, `Flagship events`)

## achievements

- `title`
- `description`
- `image_url` (nullable)
- `date`

## gallery

- `image_url`
- `caption` (nullable)
- `uploaded_at`
