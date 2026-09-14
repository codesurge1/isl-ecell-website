-- Adds an optional email contact field to members. Run manually in the
-- Supabase SQL Editor after review — same convention as 0001_init.sql.
-- Nullable: existing rows are unaffected, and the admin form treats it as
-- optional (not every member needs a public contact email).

begin;

alter table members add column email text;

commit;
