import { sql } from "@/lib/db";
import type { User } from "@/types/user";
import type { UserSettingsUpdateInput } from "./userSchema";
import { userRowSchema } from "./userSchema";

export class UserRepository {
  constructor(private readonly db: typeof sql = sql) {}

  async get(): Promise<User> {
    const [row] = await this.db`
      SELECT id, settings, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM users WHERE id = 'me'
    `;
    return userRowSchema.parse(row);
  }

  async updateSettings(input: UserSettingsUpdateInput): Promise<User> {
    const [row] = await this.db`
      UPDATE users SET settings = ${input.settings}, updated_at = now()
      WHERE id = 'me'
      RETURNING id, settings, created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    return userRowSchema.parse(row);
  }
}

export const userRepository = new UserRepository();
