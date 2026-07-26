-- Custom SQL migration file, put your code below! --

ALTER TABLE "tracks" DROP CONSTRAINT "tracks_album_id_fkey";--> statement-breakpoint
ALTER TABLE "user_albums" DROP CONSTRAINT "user_albums_album_id_fkey";--> statement-breakpoint

-- Normalize any child rows whose album_id doesn't already match toSlug(artist)-toSlug(album)
-- (e.g. hand-set/JSON-uploaded ids), so the FK rebuild below doesn't orphan them.
UPDATE "tracks" t
SET "album_id" = regexp_replace(replace(translate(lower(a."artist"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g')
  || '-' ||
  regexp_replace(replace(translate(lower(a."album"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g')
FROM "albums" a
WHERE t."album_id" = a."id";--> statement-breakpoint

UPDATE "user_albums" ua
SET "album_id" = regexp_replace(replace(translate(lower(a."artist"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g')
  || '-' ||
  regexp_replace(replace(translate(lower(a."album"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g')
FROM "albums" a
WHERE ua."album_id" = a."id";--> statement-breakpoint

ALTER TABLE "albums" DROP CONSTRAINT "albums_pkey";--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN "id";--> statement-breakpoint

ALTER TABLE "albums" ADD COLUMN "id" text GENERATED ALWAYS AS (
  regexp_replace(replace(translate(lower("artist"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g')
  || '-' ||
  regexp_replace(replace(translate(lower("album"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g')
) STORED;--> statement-breakpoint

ALTER TABLE "albums" ADD CONSTRAINT "albums_pkey" PRIMARY KEY ("id");--> statement-breakpoint

ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_albums" ADD CONSTRAINT "user_albums_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE cascade;
