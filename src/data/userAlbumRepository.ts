import { sql } from "@/lib/db";
import type { UserAlbum } from "@/types/userAlbum";
import { userAlbumRowSchema } from "./userAlbumSchema";

export class UserAlbumRepository {
  constructor(private readonly db: typeof sql = sql) {}

  async getAll(): Promise<Array<UserAlbum>> {
    const rows = await this.db`
      SELECT id::text AS id, album_id AS "albumId", track_id AS "trackId", review, honorable, rank
      FROM user_albums WHERE user_id = 'me'
    `;
    return rows.map((row) => userAlbumRowSchema.parse(row));
  }

  async setTrackId(albumId: string, trackId: string | null): Promise<UserAlbum> {
    const [row] = await this.db`
      INSERT INTO user_albums (user_id, album_id, track_id)
      VALUES ('me', ${albumId}, ${trackId})
      ON CONFLICT (user_id, album_id) DO UPDATE SET track_id = EXCLUDED.track_id, updated_at = now()
      RETURNING id::text AS id, album_id AS "albumId", track_id AS "trackId", review, honorable, rank
    `;
    return userAlbumRowSchema.parse(row);
  }

  async setReview(albumId: string, review: string): Promise<UserAlbum> {
    const [row] = await this.db`
      INSERT INTO user_albums (user_id, album_id, review)
      VALUES ('me', ${albumId}, ${review})
      ON CONFLICT (user_id, album_id) DO UPDATE SET review = EXCLUDED.review, updated_at = now()
      RETURNING id::text AS id, album_id AS "albumId", track_id AS "trackId", review, honorable, rank
    `;
    return userAlbumRowSchema.parse(row);
  }

  async setHonorable(albumId: string, honorable: boolean): Promise<UserAlbum> {
    const [row] = await this.db`
      INSERT INTO user_albums (user_id, album_id, honorable)
      VALUES ('me', ${albumId}, ${honorable})
      ON CONFLICT (user_id, album_id) DO UPDATE SET honorable = EXCLUDED.honorable, updated_at = now()
      RETURNING id::text AS id, album_id AS "albumId", track_id AS "trackId", review, honorable, rank
    `;
    return userAlbumRowSchema.parse(row);
  }
}

export const userAlbumRepository = new UserAlbumRepository();
