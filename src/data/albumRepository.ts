import { asc, eq, inArray, sql as rawSql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { AlbumCreateInput, AlbumUpdateInput } from "@/data/albumSchema";
import { mapUserAlbum } from "@/data/userAlbumMapper";
import { albums, artists, tracks, userAlbums } from "@/db/schema";
import { db as defaultDb } from "@/lib/db";
import { parseTrackId } from "@/lib/favoriteTrack";
import type { Album, Track } from "@/types/album";

export type { AlbumCreateInput, AlbumUpdateInput } from "@/data/albumSchema";
export { albumCreateSchema, albumUpdateSchema } from "@/data/albumSchema";

export class AlbumRepository {
  private static readonly trackOrder = [rawSql`${tracks.disc} asc nulls first`, asc(tracks.number)];

  private static assertNonEmptyBatch<T>(items: Array<T>): asserts items is [T, ...Array<T>] {
    if (items.length === 0) {
      throw new Error("Batch must contain at least one query");
    }
  }

  /** Albums always join their artist, so the artist name travels with every row */
  private static readonly albumWithArtist = {
    album: albums,
    artistName: artists.artist,
  };

  constructor(private readonly db: typeof defaultDb = defaultDb) {}

  async getAll(): Promise<Array<Album>> {
    const [albumRows, trackRows] = await Promise.all([
      this.db
        .select(AlbumRepository.albumWithArtist)
        .from(albums)
        .innerJoin(artists, eq(albums.artistId, artists.id)),
      this.db
        .select()
        .from(tracks)
        .orderBy(...AlbumRepository.trackOrder),
    ]);

    const tracksByAlbum = new Map<string, Array<Track>>();
    for (const row of trackRows) {
      const track = this.mapTrack(row);
      const existing = tracksByAlbum.get(row.albumId);
      existing ? existing.push(track) : tracksByAlbum.set(row.albumId, [track]);
    }

    return albumRows.map((row) =>
      this.mapAlbum(row.album, row.artistName, tracksByAlbum.get(row.album.id) ?? []),
    );
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
      this.db
        .select(AlbumRepository.albumWithArtist)
        .from(albums)
        .innerJoin(artists, eq(albums.artistId, artists.id))
        .where(inArray(albums.id, albumIds)),
      this.db
        .select()
        .from(tracks)
        .where(inArray(tracks.albumId, albumIds))
        .orderBy(...AlbumRepository.trackOrder),
    ]);

    const tracksByAlbum = new Map<string, Array<Track>>();
    for (const row of trackRows) {
      const track = this.mapTrack(row);
      const existing = tracksByAlbum.get(row.albumId);
      existing ? existing.push(track) : tracksByAlbum.set(row.albumId, [track]);
    }

    const userAlbumByAlbumId = new Map(userRows.map((row) => [row.albumId, mapUserAlbum(row)]));

    const albumById = new Map(
      albumRows.map((row) => {
        const album = this.mapAlbum(
          row.album,
          row.artistName,
          tracksByAlbum.get(row.album.id) ?? [],
        );
        album.userAlbum = userAlbumByAlbumId.get(row.album.id);
        album.favoriteTrack = this.resolveFavoriteTrack(
          album.tracks,
          album.userAlbum?.trackId ?? null,
        );
        return [row.album.id, album] as const;
      }),
    );

    const honorableByArtist = new Map<string, Array<Album>>();
    for (const id of honorableIds) {
      const album = albumById.get(id);
      if (!album) continue;
      const existing = honorableByArtist.get(album.artistId);
      existing ? existing.push(album) : honorableByArtist.set(album.artistId, [album]);
    }
    for (const list of honorableByArtist.values()) {
      list.sort((a, b) => a.year - b.year);
    }

    return rankedRows
      .map((row) => albumById.get(row.albumId))
      .filter((album): album is Album => album !== undefined)
      .map((album) => {
        const mentions = honorableByArtist.get(album.artistId);
        return mentions?.length ? { ...album, honorableMentions: mentions } : album;
      });
  }

  async getById(id: string): Promise<Album | null> {
    const [albumRows, trackRows] = await Promise.all([
      this.db
        .select(AlbumRepository.albumWithArtist)
        .from(albums)
        .innerJoin(artists, eq(albums.artistId, artists.id))
        .where(eq(albums.id, id)),
      this.db
        .select()
        .from(tracks)
        .where(eq(tracks.albumId, id))
        .orderBy(...AlbumRepository.trackOrder),
    ]);

    const row = albumRows[0];
    if (!row) return null;

    return this.mapAlbum(
      row.album,
      row.artistName,
      trackRows.map((trackRow) => this.mapTrack(trackRow)),
    );
  }

  async update(id: string, input: AlbumUpdateInput): Promise<Album | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const { tracks: newTracks, ...albumFields } = input;
    let currentId = id;

    if (Object.keys(albumFields).length > 0) {
      const [updated] = await this.db
        .update(albums)
        .set({ ...albumFields, updatedAt: rawSql`now()` })
        .where(eq(albums.id, id))
        .returning({ id: albums.id });
      currentId = updated.id;
    }

    if (newTracks) {
      const batch: Array<BatchItem<"pg">> = [
        this.db.delete(tracks).where(eq(tracks.albumId, currentId)),
        ...newTracks.map((track) =>
          this.db.insert(tracks).values({
            albumId: currentId,
            number: track.number,
            title: track.title,
            duration: track.duration,
            notes: track.notes ?? null,
            instrumental: track.instrumental ?? null,
            disc: track.disc ?? null,
            personnel: track.personnel ?? null,
          }),
        ),
      ];
      AlbumRepository.assertNonEmptyBatch(batch);
      await this.db.batch(batch);
    }

    return this.getById(currentId);
  }

  async create(input: AlbumCreateInput): Promise<Album> {
    const [inserted] = await this.db
      .insert(albums)
      .values({
        artistId: input.artistId,
        album: input.album,
        year: input.year,
        label: input.label,
        genre: input.genre,
        runtime: input.runtime,
        discTitles: input.discTitles ?? null,
        art: input.art ?? null,
        personnel: input.personnel ?? null,
      })
      .returning({ id: albums.id });

    const batch: Array<BatchItem<"pg">> = input.tracks.map((track) =>
      this.db.insert(tracks).values({
        albumId: inserted.id,
        number: track.number,
        title: track.title,
        duration: track.duration,
        notes: track.notes ?? null,
        instrumental: track.instrumental ?? null,
        disc: track.disc ?? null,
        personnel: track.personnel ?? null,
      }),
    );

    AlbumRepository.assertNonEmptyBatch(batch);
    await this.db.batch(batch);

    const created = await this.getById(inserted.id);
    if (!created) throw new Error(`Failed to create album "${inserted.id}"`);
    return created;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;

    await this.db.delete(albums).where(eq(albums.id, id));
    return true;
  }

  private resolveFavoriteTrack(
    tracksList: Array<Track>,
    trackId: string | null,
  ): Track | undefined {
    if (!trackId) return undefined;
    const { number, disc } = parseTrackId(trackId);
    return tracksList.find((track) => track.number === number && (track.disc ?? 0) === disc);
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

  private mapAlbum(
    row: typeof albums.$inferSelect,
    artistName: string,
    tracksList: Array<Track>,
  ): Album {
    return {
      id: row.id,
      artistId: row.artistId,
      artist: artistName,
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
