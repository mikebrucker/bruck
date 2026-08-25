import { asc, eq, sql as rawSql } from "drizzle-orm";
import type { ArtistCreateInput, ArtistUpdateInput } from "@/data/artistSchema";
import { artists } from "@/db/schema";
import { db as defaultDb } from "@/lib/db";
import type { Artist } from "@/types/artist";

export type { ArtistCreateInput, ArtistUpdateInput } from "@/data/artistSchema";
export { artistCreateSchema, artistUpdateSchema } from "@/data/artistSchema";

export class ArtistRepository {
  constructor(private readonly db: typeof defaultDb = defaultDb) {}

  async getAll(): Promise<Array<Artist>> {
    const rows = await this.db.select().from(artists).orderBy(asc(artists.artist));
    return rows.map((row) => this.mapArtist(row));
  }

  async getById(id: string): Promise<Artist | null> {
    const rows = await this.db.select().from(artists).where(eq(artists.id, id));
    const row = rows[0];
    return row ? this.mapArtist(row) : null;
  }

  async create(input: ArtistCreateInput): Promise<Artist> {
    const [inserted] = await this.db
      .insert(artists)
      .values({
        artist: input.artist,
        bio: input.bio ?? null,
        location: input.location ?? null,
        media: input.media ?? null,
        members: input.members ?? null,
        formerMembers: input.formerMembers ?? null,
      })
      .returning({ id: artists.id });

    const created = await this.getById(inserted.id);
    if (!created) throw new Error(`Failed to create artist "${inserted.id}"`);
    return created;
  }

  async update(id: string, input: ArtistUpdateInput): Promise<Artist | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const [updated] = await this.db
      .update(artists)
      .set({ ...input, updatedAt: rawSql`now()` })
      .where(eq(artists.id, id))
      .returning({ id: artists.id });

    return this.getById(updated.id);
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;

    await this.db.delete(artists).where(eq(artists.id, id));
    return true;
  }

  private mapArtist(row: typeof artists.$inferSelect): Artist {
    return {
      id: row.id,
      artist: row.artist,
      bio: row.bio ?? undefined,
      location: row.location ?? undefined,
      media: row.media ?? undefined,
      members: row.members ?? undefined,
      formerMembers: row.formerMembers ?? undefined,
      createdAt: new Date(row.createdAt),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    };
  }
}

export const artistRepository = new ArtistRepository();
