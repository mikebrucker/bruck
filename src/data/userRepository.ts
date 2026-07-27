import { eq } from "drizzle-orm";
import type { UserSettingsUpdateInput } from "@/data/userSchema";
import { users } from "@/db/schema";
import { db as defaultDb } from "@/lib/db";
import type { User } from "@/types/user";

export class UserRepository {
  constructor(private readonly db: typeof defaultDb = defaultDb) {}

  async get(): Promise<User> {
    const [row] = await this.db.select().from(users).where(eq(users.id, "me"));
    return this.mapUser(row);
  }

  async updateSettings(input: UserSettingsUpdateInput): Promise<User> {
    const [row] = await this.db
      .update(users)
      .set({ settings: input.settings, updatedAt: new Date().toISOString() })
      .where(eq(users.id, "me"))
      .returning();
    return this.mapUser(row);
  }

  private mapUser(row: typeof users.$inferSelect | undefined): User {
    if (!row) throw new Error('User "me" not found');
    return {
      id: row.id,
      settings: row.settings,
      createdAt: new Date(row.createdAt),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    };
  }
}

export const userRepository = new UserRepository();
