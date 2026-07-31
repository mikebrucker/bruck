import { and, eq, inArray, sql } from "drizzle-orm";
import { mapUserAlbum } from "@/data/userAlbumMapper";
import type { UserAlbumBulkUpdateItem } from "@/data/userAlbumSchema";
import { userAlbums } from "@/db/schema";
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

export class UserAlbumRepository {
  private static readonly conflictTarget = [userAlbums.userId, userAlbums.albumId];

  constructor(private readonly db: typeof defaultDb = defaultDb) {}

  async getAll(): Promise<Array<UserAlbum>> {
    const rows = await this.db.select().from(userAlbums).where(eq(userAlbums.userId, "me"));
    return rows.map((row) => mapUserAlbum(row));
  }

  async setTrackId(albumId: string, trackId: string | null): Promise<UserAlbum> {
    const [row] = await this.db
      .insert(userAlbums)
      .values({ userId: "me", albumId, trackId })
      .onConflictDoUpdate({
        target: UserAlbumRepository.conflictTarget,
        set: { trackId, updatedAt: sql`now()` },
      })
      .returning();
    return mapUserAlbum(row);
  }

  async setReview(albumId: string, review: string | null): Promise<UserAlbum> {
    const value = review || null;
    const [row] = await this.db
      .insert(userAlbums)
      .values({ userId: "me", albumId, review: value })
      .onConflictDoUpdate({
        target: UserAlbumRepository.conflictTarget,
        set: { review: value, updatedAt: sql`now()` },
      })
      .returning();
    return mapUserAlbum(row);
  }

  async setHonorable(albumId: string, honorable: boolean): Promise<UserAlbum> {
    if (honorable) {
      const [existing] = await this.db
        .select()
        .from(userAlbums)
        .where(and(eq(userAlbums.userId, "me"), eq(userAlbums.albumId, albumId)));
      if (existing?.rank !== null && existing?.rank !== undefined) {
        throw new RankedHonorableError(albumId);
      }
    }

    const [row] = await this.db
      .insert(userAlbums)
      .values({ userId: "me", albumId, honorable })
      .onConflictDoUpdate({
        target: UserAlbumRepository.conflictTarget,
        set: { honorable, updatedAt: sql`now()` },
      })
      .returning();
    return mapUserAlbum(row);
  }

  async setRank(albumId: string, rank: number | null): Promise<UserAlbum> {
    if (rank !== null) {
      const [existing] = await this.db
        .select()
        .from(userAlbums)
        .where(and(eq(userAlbums.userId, "me"), eq(userAlbums.albumId, albumId)));
      if (existing?.honorable) {
        throw new HonorableRankedError(albumId);
      }
    }

    const [row] = await this.db
      .insert(userAlbums)
      .values({ userId: "me", albumId, rank })
      .onConflictDoUpdate({
        target: UserAlbumRepository.conflictTarget,
        set: { rank, updatedAt: sql`now()` },
      })
      .returning();
    return mapUserAlbum(row);
  }

  async applyUpdates(updates: Array<UserAlbumBulkUpdateItem>): Promise<Array<UserAlbum>> {
    if (updates.length === 0) return [];

    const albumIds = updates.map((update) => update.albumId);
    const seen = new Set<string>();
    for (const albumId of albumIds) {
      if (seen.has(albumId)) throw new DuplicateAlbumUpdateError(albumId);
      seen.add(albumId);
    }

    const existing = await this.db
      .select()
      .from(userAlbums)
      .where(and(eq(userAlbums.userId, "me"), inArray(userAlbums.albumId, albumIds)));
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
      if (merged.honorable && merged.rank !== null) throw new RankedHonorableError(albumId);
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
