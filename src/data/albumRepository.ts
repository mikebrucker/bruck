import { asc, eq, inArray, sql as rawSql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { albums, tracks, userAlbums } from "@/db/schema";
import { db as defaultDb } from "@/lib/db";
import type { Album, Track } from "@/types/album";
import type { AlbumCreateInput, AlbumUpdateInput } from "./albumSchema";

export type { AlbumCreateInput, AlbumUpdateInput } from "./albumSchema";
export { albumCreateSchema, albumUpdateSchema } from "./albumSchema";

function assertNonEmptyBatch<T>(items: Array<T>): asserts items is [T, ...Array<T>] {
  if (items.length === 0) {
    throw new Error("Batch must contain at least one query");
  }
}

const trackOrder = [rawSql`${tracks.disc} asc nulls first`, asc(tracks.number)];

export class AlbumRepository {
  constructor(private readonly db: typeof defaultDb = defaultDb) {}

  async getAll(): Promise<Array<Album>> {
    const [albumRows, trackRows] = await Promise.all([
      this.db.select().from(albums),
      this.db
        .select()
        .from(tracks)
        .orderBy(...trackOrder),
    ]);

    const tracksByAlbum = new Map<string, Array<Track>>();
    for (const row of trackRows) {
      const track = this.mapTrack(row);
      const existing = tracksByAlbum.get(row.albumId);
      existing ? existing.push(track) : tracksByAlbum.set(row.albumId, [track]);
    }

    return albumRows.map((row) => this.mapAlbum(row, tracksByAlbum.get(row.id) ?? []));
  }

  async getRanked(userId = "me"): Promise<Array<Album>> {
    const userRows = await this.db.select().from(userAlbums).where(eq(userAlbums.userId, userId));

    const rankedRows = userRows
      .filter((row) => row.rank !== null)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    const honorableIds = userRows
      .filter((row) => row.honorable && row.rank === null)
      .map((row) => row.albumId);

    const albumIds = [...new Set([...rankedRows.map((row) => row.albumId), ...honorableIds])];
    if (albumIds.length === 0) return [];

    const [albumRows, trackRows] = await Promise.all([
      this.db.select().from(albums).where(inArray(albums.id, albumIds)),
      this.db
        .select()
        .from(tracks)
        .where(inArray(tracks.albumId, albumIds))
        .orderBy(...trackOrder),
    ]);

    const tracksByAlbum = new Map<string, Array<Track>>();
    for (const row of trackRows) {
      const track = this.mapTrack(row);
      const existing = tracksByAlbum.get(row.albumId);
      existing ? existing.push(track) : tracksByAlbum.set(row.albumId, [track]);
    }

    const albumById = new Map(
      albumRows.map((row) => [row.id, this.mapAlbum(row, tracksByAlbum.get(row.id) ?? [])]),
    );

    const honorableByArtist = new Map<string, Array<Album>>();
    for (const id of honorableIds) {
      const album = albumById.get(id);
      if (!album) continue;
      const existing = honorableByArtist.get(album.artist);
      existing ? existing.push(album) : honorableByArtist.set(album.artist, [album]);
    }
    for (const list of honorableByArtist.values()) {
      list.sort((a, b) => a.year - b.year);
    }

    return rankedRows
      .map((row) => albumById.get(row.albumId))
      .filter((album): album is Album => album !== undefined)
      .map((album) => {
        const mentions = honorableByArtist.get(album.artist);
        return mentions?.length ? { ...album, honorableMentions: mentions } : album;
      });
  }

  async getById(id: string): Promise<Album | null> {
    const [albumRows, trackRows] = await Promise.all([
      this.db.select().from(albums).where(eq(albums.id, id)),
      this.db
        .select()
        .from(tracks)
        .where(eq(tracks.albumId, id))
        .orderBy(...trackOrder),
    ]);

    const row = albumRows[0];
    if (!row) return null;

    return this.mapAlbum(
      row,
      trackRows.map((trackRow) => this.mapTrack(trackRow)),
    );
  }

  async update(id: string, input: AlbumUpdateInput): Promise<Album | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const { tracks: newTracks, ...albumFields } = input;
    const batch: Array<BatchItem<"pg">> = [];

    if (Object.keys(albumFields).length > 0 || newTracks) {
      batch.push(
        this.db
          .update(albums)
          .set({ ...albumFields, updatedAt: rawSql`now()` })
          .where(eq(albums.id, id)),
      );
    }

    if (newTracks) {
      batch.push(this.db.delete(tracks).where(eq(tracks.albumId, id)));
      for (const track of newTracks) {
        batch.push(
          this.db.insert(tracks).values({
            albumId: id,
            number: track.number,
            title: track.title,
            duration: track.duration,
            notes: track.notes ?? null,
            instrumental: track.instrumental ?? null,
            disc: track.disc ?? null,
            personnel: track.personnel ?? null,
          }),
        );
      }
    }

    assertNonEmptyBatch(batch);
    await this.db.batch(batch);

    return this.getById(id);
  }

  async create(input: AlbumCreateInput): Promise<Album> {
    const batch: Array<BatchItem<"pg">> = [
      this.db.insert(albums).values({
        id: input.id,
        artist: input.artist,
        album: input.album,
        year: input.year,
        label: input.label,
        genre: input.genre,
        runtime: input.runtime,
        discTitles: input.discTitles ?? null,
        art: input.art ?? null,
        personnel: input.personnel ?? null,
      }),
    ];

    for (const track of input.tracks) {
      batch.push(
        this.db.insert(tracks).values({
          albumId: input.id,
          number: track.number,
          title: track.title,
          duration: track.duration,
          notes: track.notes ?? null,
          instrumental: track.instrumental ?? null,
          disc: track.disc ?? null,
          personnel: track.personnel ?? null,
        }),
      );
    }

    assertNonEmptyBatch(batch);
    await this.db.batch(batch);

    const created = await this.getById(input.id);
    if (!created) throw new Error(`Failed to create album "${input.id}"`);
    return created;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;

    await this.db.delete(albums).where(eq(albums.id, id));
    return true;
  }

  private mapTrack(row: typeof tracks.$inferSelect): Track {
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

  private mapAlbum(row: typeof albums.$inferSelect, tracksList: Array<Track>): Album {
    return {
      id: row.id,
      artist: row.artist,
      album: row.album,
      year: row.year,
      label: row.label,
      genre: row.genre,
      runtime: row.runtime,
      tracks: tracksList,
      discTitles: row.discTitles ?? undefined,
      art: row.art ?? undefined,
      personnel: row.personnel ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    };
  }
}

export const albumRepository = new AlbumRepository();
