import { and, eq, sql } from "drizzle-orm";
import { userAlbums } from "@/db/schema";
import { db as defaultDb } from "@/lib/db";
import type { UserAlbum } from "@/types/userAlbum";

const conflictTarget = [userAlbums.userId, userAlbums.albumId];

export class RankedHonorableError extends Error {
  constructor(albumId: string) {
    super(`Album "${albumId}" is ranked and cannot be marked honorable`);
    this.name = "RankedHonorableError";
  }
}

export class UserAlbumRepository {
  constructor(private readonly db: typeof defaultDb = defaultDb) {}

  async getAll(): Promise<Array<UserAlbum>> {
    const rows = await this.db.select().from(userAlbums).where(eq(userAlbums.userId, "me"));
    return rows.map((row) => this.mapUserAlbum(row));
  }

  async setTrackId(albumId: string, trackId: string | null): Promise<UserAlbum> {
    const [row] = await this.db
      .insert(userAlbums)
      .values({ userId: "me", albumId, trackId })
      .onConflictDoUpdate({
        target: conflictTarget,
        set: { trackId, updatedAt: sql`now()` },
      })
      .returning();
    return this.mapUserAlbum(row);
  }

  async setReview(albumId: string, review: string): Promise<UserAlbum> {
    const [row] = await this.db
      .insert(userAlbums)
      .values({ userId: "me", albumId, review })
      .onConflictDoUpdate({
        target: conflictTarget,
        set: { review, updatedAt: sql`now()` },
      })
      .returning();
    return this.mapUserAlbum(row);
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
        target: conflictTarget,
        set: { honorable, updatedAt: sql`now()` },
      })
      .returning();
    return this.mapUserAlbum(row);
  }

  private mapUserAlbum(row: typeof userAlbums.$inferSelect | undefined): UserAlbum {
    if (!row) throw new Error("Failed to upsert user album");
    return {
      id: String(row.id),
      albumId: row.albumId,
      trackId: row.trackId,
      review: row.review,
      honorable: row.honorable,
      rank: row.rank,
      createdAt: new Date(row.createdAt),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    };
  }
}

export const userAlbumRepository = new UserAlbumRepository();
