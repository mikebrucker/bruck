import type { userAlbums } from "@/db/schema";
import type { UserAlbum } from "@/types/userAlbum";

export function mapUserAlbum(row: typeof userAlbums.$inferSelect | undefined): UserAlbum {
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
