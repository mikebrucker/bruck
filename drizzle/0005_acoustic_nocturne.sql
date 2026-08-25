-- Hand-edited after generate: drizzle-kit cannot know that artists must be
-- backfilled from the distinct albums.artist values before the FK is added.
-- The generated CREATE TABLE / ADD COLUMN / ADD CONSTRAINT are unchanged, only
-- reordered around the two data statements.
CREATE TABLE "artists" (
	"id" text PRIMARY KEY GENERATED ALWAYS AS (regexp_replace(replace(translate(lower("artists"."artist"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g')) STORED NOT NULL,
	"artist" text NOT NULL,
	"bio" text,
	"location" text,
	"media" text[],
	"members" jsonb,
	"former_members" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "artist_id" text;--> statement-breakpoint
INSERT INTO "artists" ("artist") SELECT DISTINCT "artist" FROM "albums" ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
UPDATE "albums" a SET "artist_id" = ar."id" FROM "artists" ar WHERE ar."artist" = a."artist";--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE restrict ON UPDATE cascade;
