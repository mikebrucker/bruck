-- Hand-edited after `drizzle-kit generate`, for two reasons:
--
-- 1. text -> text[] needs an explicit USING clause; Postgres rejects the bare
--    `SET DATA TYPE text[]` drizzle-kit emits. ARRAY["col"] wraps each existing
--    scalar into a one-element array, preserving every current row.
--
-- 2. drizzle-kit also emitted a drop/recreate of the generated "id" column plus
--    both album_id foreign keys. That is snapshot catch-up, not a real change:
--    0002_generated_album_id.sql already created that column in the database,
--    but its snapshot never recorded the `generated` clause. The 0003 snapshot
--    now records it, so future diffs are correct and the DDL is not needed here.

ALTER TABLE "albums" ALTER COLUMN "label" SET DATA TYPE text[] USING ARRAY["label"];--> statement-breakpoint
ALTER TABLE "albums" ALTER COLUMN "genre" SET DATA TYPE text[] USING ARRAY["genre"];
