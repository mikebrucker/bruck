import { and, eq, inArray, sql } from "drizzle-orm";
import { mapUserAlbum } from "@/data/userAlbumMapper";
import type { UserAlbumBulkUpdateItem } from "@/data/userAlbumSchema";
import { albums, userAlbums } from "@/db/schema";
import { db as defaultDb } from "@/lib/db";
import type { UserAlbum } from "@/types/userAlbum";

export class RankedHonorableError extends Error {
  constructor(albumId: string) {
    super(`Album "${albumId}" is ranked and cannot be marked honorable`);
    this.name = "RankedHonorableError";
  }
}

export class HonorableRankedError extends Error {
  constructor(albumId: string) {
    super(`Album "${albumId}" is an honorable mention and cannot be ranked`);
    this.name = "HonorableRankedError";
  }
}

export class DuplicateAlbumUpdateError extends Error {
  constructor(albumId: string) {
    super(`Album "${albumId}" appears more than once in the same update`);
    this.name = "DuplicateAlbumUpdateError";
  }
}

export class AlbumNotFoundError extends Error {
  constructor(albumId: string) {
    super(`Album "${albumId}" not found`);
    this.name = "AlbumNotFoundError";
  }
}

export class UserAlbumRepository {
  private static readonly conflictTarget = [userAlbums.userId, userAlbums.albumId];

  constructor(private readonly db: typeof defaultDb = defaultDb) {}

  async getAll(): Promise<Array<UserAlbum>> {
    const rows = await this.db.select().from(userAlbums).where(eq(userAlbums.userId, "me"));
    return rows.map((row) => mapUserAlbum(row));
  }

  /** Validates every merged row before a single upsert, so a rejected update writes nothing */
  async applyUpdates(updates: Array<UserAlbumBulkUpdateItem>): Promise<Array<UserAlbum>> {
    if (updates.length === 0) return [];

    const albumIds = updates.map((update) => update.albumId);
    const seen = new Set<string>();
    for (const albumId of albumIds) {
      if (seen.has(albumId)) throw new DuplicateAlbumUpdateError(albumId);
      seen.add(albumId);
    }

    const [existing, albumRows] = await Promise.all([
      this.db
        .select()
        .from(userAlbums)
        .where(and(eq(userAlbums.userId, "me"), inArray(userAlbums.albumId, albumIds))),
      this.db.select({ id: albums.id }).from(albums).where(inArray(albums.id, albumIds)),
    ]);

    const knownAlbumIds = new Set(albumRows.map((row) => row.id));
    const missingAlbumId = albumIds.find((albumId) => !knownAlbumIds.has(albumId));
    if (missingAlbumId !== undefined) throw new AlbumNotFoundError(missingAlbumId);

    const existingByAlbumId = new Map(existing.map((row) => [row.albumId, row]));

    const values = updates.map(({ albumId, ...patch }) => {
      const current = existingByAlbumId.get(albumId);
      const merged = {
        userId: "me",
        albumId,
        trackId: patch.trackId !== undefined ? patch.trackId : (current?.trackId ?? null),
        review: (patch.review !== undefined ? patch.review : current?.review) || null,
        honorable: patch.honorable !== undefined ? patch.honorable : (current?.honorable ?? false),
        rank: patch.rank !== undefined ? patch.rank : (current?.rank ?? null),
      };
      if (merged.honorable && merged.rank !== null) {
        throw patch.rank !== undefined && patch.honorable === undefined
          ? new HonorableRankedError(albumId)
          : new RankedHonorableError(albumId);
      }
      return merged;
    });

    const rows = await this.db
      .insert(userAlbums)
      .values(values)
      .onConflictDoUpdate({
        target: UserAlbumRepository.conflictTarget,
        set: {
          trackId: sql`excluded.track_id`,
          review: sql`excluded.review`,
          honorable: sql`excluded.honorable`,
          rank: sql`excluded.rank`,
          updatedAt: sql`now()`,
        },
      })
      .returning();
    return rows.map((row) => mapUserAlbum(row));
  }
}

export const userAlbumRepository = new UserAlbumRepository();
