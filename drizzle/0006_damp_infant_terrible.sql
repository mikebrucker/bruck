-- Hand-edited after generate. albums.id is GENERATED ALWAYS, so repointing it
-- from albums.artist to albums.artist_id means dropping and re-adding the PK
-- column, which drizzle-kit emits in an order Postgres rejects:
--   * tracks/user_albums FKs reference albums.id and must be dropped first;
--   * albums.artist cannot be dropped while the old id expression depends on it;
--   * artist_id must be NOT NULL before the new id column exists, or the
--     generated value is NULL and the PK is violated.
-- The new id evaluates to the same string as the old one (artists.id is the
-- artist slug), so every existing albums.id, tracks.album_id and
-- user_albums.album_id value stays valid.
ALTER TABLE "albums" ALTER COLUMN "artist_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_album_id_fkey";--> statement-breakpoint
ALTER TABLE "user_albums" DROP CONSTRAINT "user_albums_album_id_fkey";--> statement-breakpoint
ALTER TABLE "albums" drop column "id";--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN "artist";--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "id" text PRIMARY KEY GENERATED ALWAYS AS (("albums"."artist_id" || '-' || regexp_replace(replace(translate(lower("albums"."album"), 'àáâãäåèéêëìíîïòóôõöùúûüñç', 'aaaaaaeeeeiiiiooooouuuunc'), ' ', '_'), '[^a-z0-9_]', '', 'g'))) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_albums" ADD CONSTRAINT "user_albums_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE cascade;
