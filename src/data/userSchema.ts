import { z } from "zod";

export const userSettingsUpdateSchema = z
  .object({ settings: z.record(z.string(), z.unknown()) })
  .strict();

export type UserSettingsUpdateInput = z.infer<typeof userSettingsUpdateSchema>;

export const userRowSchema = z.object({
  id: z.string(),
  settings: z.record(z.string(), z.unknown()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
