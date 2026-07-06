import type { NeonQueryInTransaction } from "@neondatabase/serverless";
import { z } from "zod";
import { sql } from "@/lib/db";
import type { Album, Track } from "@/types/album";

const creditSchema = z
  .object({
    name: z.string(),
    roles: z.array(z.string()),
    notes: z.string().optional(),
  })
  .strict();

const personnelSchema = z
  .object({
    members: z.array(creditSchema).optional(),
    guests: z.array(creditSchema).optional(),
    production: z.array(creditSchema).optional(),
    studios: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })
  .strict();

const trackSchema = z
  .object({
    number: z.number(),
    title: z.string(),
    duration: z.string(),
    notes: z.string().optional(),
    instrumental: z.boolean().optional(),
    personnel: z.array(creditSchema).optional(),
    disc: z.number().optional(),
  })
  .strict();

export const albumUpdateSchema = z
  .object({
    artist: z.string().optional(),
    album: z.string().optional(),
    year: z.number().optional(),
    label: z.string().optional(),
    genre: z.string().optional(),
    runtime: z.string().optional(),
    review: z.string().optional(),
    tracks: z.array(trackSchema).min(1).optional(),
    discTitles: z.array(z.string()).nullable().optional(),
    art: z.array(z.string()).nullable().optional(),
    favoriteTrack: z.number().optional(),
    favoriteDisc: z.number().nullable().optional(),
    personnel: personnelSchema.nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update body must contain at least one field",
  });

export type AlbumUpdateInput = z.infer<typeof albumUpdateSchema>;

export const albumCreateSchema = z
  .object({
    id: z.string(),
    artist: z.string(),
    album: z.string(),
    year: z.number(),
    label: z.string(),
    genre: z.string(),
    runtime: z.string(),
    review: z.string(),
    tracks: z.array(trackSchema).min(1),
    discTitles: z.array(z.string()).optional(),
    art: z.array(z.string()).optional(),
    favoriteTrack: z.number().default(0),
    favoriteDisc: z.number().optional(),
    personnel: personnelSchema.optional(),
  })
  .strict();

export type AlbumCreateInput = z.infer<typeof albumCreateSchema>;

const albumColumnByField: Record<string, string> = {
  artist: "artist",
  album: "album",
  year: "year",
  label: "label",
  genre: "genre",
  runtime: "runtime",
  review: "review",
  discTitles: "disc_titles",
  art: "art",
  favoriteTrack: "favorite_track",
  favoriteDisc: "favorite_disc",
  personnel: "personnel",
};

// The neon driver types query rows as Record<string, any>[] (no column
// schema to infer from), which TS won't structurally assign to a plain row
// interface. Parsing each row through zod narrows it to a concrete type
// without an `any`/`as` escape hatch.
const albumRowSchema = z.object({
  id: z.string(),
  artist: z.string(),
  album: z.string(),
  year: z.number(),
  label: z.string(),
  genre: z.string(),
  runtime: z.string(),
  review: z.string(),
  art: z.array(z.string()).nullable(),
  personnel: personnelSchema.nullable(),
  discTitles: z.array(z.string()).nullable(),
  favoriteTrack: z.number(),
  favoriteDisc: z.number().nullable(),
});
type AlbumRow = z.infer<typeof albumRowSchema>;

const trackRowSchema = z.object({
  number: z.number(),
  title: z.string(),
  duration: z.string(),
  notes: z.string().nullable(),
  instrumental: z.boolean().nullable(),
  disc: z.number().nullable(),
  personnel: z.array(creditSchema).nullable(),
});
type TrackRow = z.infer<typeof trackRowSchema>;

const trackRowWithAlbumIdSchema = trackRowSchema.extend({ albumId: z.string() });

export class AlbumRepository {
  constructor(private readonly db: typeof sql = sql) {}

  async getAll(): Promise<Array<Album>> {
    const [albumRows, trackRows] = await Promise.all([
      this.db`
        SELECT
          id, artist, album, year, label, genre, runtime, review,
          art, personnel,
          disc_titles AS "discTitles",
          favorite_track AS "favoriteTrack",
          favorite_disc AS "favoriteDisc"
        FROM albums
      `,
      this.db`
        SELECT album_id AS "albumId", number, title, duration, notes, instrumental, disc, personnel
        FROM tracks
        ORDER BY disc NULLS FIRST, number
      `,
    ]);

    const tracksByAlbum = new Map<string, Array<Track>>();
    for (const raw of trackRows) {
      const row = trackRowWithAlbumIdSchema.parse(raw);
      const track = this.mapTrack(row);
      const existing = tracksByAlbum.get(row.albumId);
      existing ? existing.push(track) : tracksByAlbum.set(row.albumId, [track]);
    }

    return albumRows.map((raw) => {
      const row = albumRowSchema.parse(raw);
      return this.mapAlbum(row, tracksByAlbum.get(row.id) ?? []);
    });
  }

  async getById(id: string): Promise<Album | null> {
    const [albumRows, trackRows] = await Promise.all([
      this.db`
        SELECT
          id, artist, album, year, label, genre, runtime, review,
          art, personnel,
          disc_titles AS "discTitles",
          favorite_track AS "favoriteTrack",
          favorite_disc AS "favoriteDisc"
        FROM albums
        WHERE id = ${id}
      `,
      this.db`
        SELECT number, title, duration, notes, instrumental, disc, personnel
        FROM tracks
        WHERE album_id = ${id}
        ORDER BY disc NULLS FIRST, number
      `,
    ]);

    const rawRow = albumRows[0];
    if (!rawRow) return null;

    const row = albumRowSchema.parse(rawRow);
    return this.mapAlbum(
      row,
      trackRows.map((raw) => this.mapTrack(trackRowSchema.parse(raw))),
    );
  }

  async update(id: string, input: AlbumUpdateInput): Promise<Album | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const setClauses: Array<string> = [];
    const params: Array<unknown> = [];
    for (const [field, column] of Object.entries(albumColumnByField)) {
      const value = (input as Record<string, unknown>)[field];
      if (value !== undefined) {
        params.push(value);
        setClauses.push(`${column} = $${params.length}`);
      }
    }

    await this.db.transaction((tx) => {
      const batch: Array<NeonQueryInTransaction> = [];

      if (setClauses.length > 0) {
        params.push(id);
        batch.push(
          tx.query(
            `UPDATE albums SET ${setClauses.join(", ")} WHERE id = $${params.length}`,
            params,
          ),
        );
      }

      if (input.tracks) {
        batch.push(tx`DELETE FROM tracks WHERE album_id = ${id}`);
        for (const track of input.tracks) {
          batch.push(tx`
            INSERT INTO tracks (album_id, number, title, duration, notes, instrumental, disc, personnel)
            VALUES (
              ${id}, ${track.number}, ${track.title}, ${track.duration},
              ${track.notes ?? null}, ${track.instrumental ?? null}, ${track.disc ?? null}, ${track.personnel ?? null}
            )
          `);
        }
      }

      return batch;
    });

    return this.getById(id);
  }

  async create(input: AlbumCreateInput): Promise<Album> {
    await this.db.transaction((tx) => {
      const batch: Array<NeonQueryInTransaction> = [
        tx`
          INSERT INTO albums (id, artist, album, year, label, genre, runtime, review, disc_titles, art, favorite_track, favorite_disc, personnel)
          VALUES (
            ${input.id}, ${input.artist}, ${input.album}, ${input.year}, ${input.label}, ${input.genre},
            ${input.runtime}, ${input.review}, ${input.discTitles ?? null}, ${input.art ?? null},
            ${input.favoriteTrack}, ${input.favoriteDisc ?? null}, ${input.personnel ?? null}
          )
        `,
      ];

      for (const track of input.tracks) {
        batch.push(tx`
          INSERT INTO tracks (album_id, number, title, duration, notes, instrumental, disc, personnel)
          VALUES (
            ${input.id}, ${track.number}, ${track.title}, ${track.duration},
            ${track.notes ?? null}, ${track.instrumental ?? null}, ${track.disc ?? null}, ${track.personnel ?? null}
          )
        `);
      }

      return batch;
    });

    const created = await this.getById(input.id);
    if (!created) throw new Error(`Failed to create album "${input.id}"`);
    return created;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;

    await this.db`DELETE FROM albums WHERE id = ${id}`;
    return true;
  }

  private mapTrack(row: TrackRow): Track {
    return {
      number: row.number,
      title: row.title,
      duration: row.duration,
      notes: row.notes ?? undefined,
      instrumental: row.instrumental ?? undefined,
      disc: row.disc ?? undefined,
      personnel: row.personnel ?? undefined,
    };
  }

  private mapAlbum(row: AlbumRow, tracks: Array<Track>): Album {
    return {
      id: row.id,
      artist: row.artist,
      album: row.album,
      year: row.year,
      label: row.label,
      genre: row.genre,
      runtime: row.runtime,
      review: row.review,
      tracks,
      discTitles: row.discTitles ?? undefined,
      art: row.art ?? undefined,
      favoriteTrack: row.favoriteTrack,
      favoriteDisc: row.favoriteDisc ?? undefined,
      personnel: row.personnel ?? undefined,
    };
  }
}

export const albumRepository = new AlbumRepository();
