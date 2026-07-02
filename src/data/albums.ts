import { sql } from "@/lib/db";
import type { Album, Track } from "@/types/album";

export async function getAllAlbums(): Promise<Array<Album>> {
  const [albumRows, trackRows] = await Promise.all([
    sql`
      SELECT
        id, artist, album, year, label, genre, runtime, review,
        art, personnel,
        disc_titles AS "discTitles",
        favorite_track AS "favoriteTrack",
        favorite_disc AS "favoriteDisc"
      FROM albums
    `,
    sql`
      SELECT album_id AS "albumId", number, title, duration, notes, instrumental, disc, personnel
      FROM tracks
      ORDER BY disc NULLS FIRST, number
    `,
  ]);

  const tracksByAlbum = new Map<string, Array<Track>>();
  for (const row of trackRows) {
    const track: Track = {
      number: row.number,
      title: row.title,
      duration: row.duration,
      notes: row.notes ?? undefined,
      instrumental: row.instrumental ?? undefined,
      disc: row.disc ?? undefined,
      personnel: row.personnel ?? undefined,
    };
    const existing = tracksByAlbum.get(row.albumId);
    existing ? existing.push(track) : tracksByAlbum.set(row.albumId, [track]);
  }

  return albumRows.map((row) => ({
    id: row.id,
    artist: row.artist,
    album: row.album,
    year: row.year,
    label: row.label,
    genre: row.genre,
    runtime: row.runtime,
    review: row.review,
    tracks: tracksByAlbum.get(row.id) ?? [],
    discTitles: row.discTitles ?? undefined,
    art: row.art ?? undefined,
    favoriteTrack: row.favoriteTrack,
    favoriteDisc: row.favoriteDisc ?? undefined,
    personnel: row.personnel,
  }));
}
