import { z } from "zod";

export const userSettingsUpdateSchema = z
  .object({ settings: z.record(z.string(), z.unknown()) })
  .strict();

export type UserSettingsUpdateInput = z.infer<typeof userSettingsUpdateSchema>;
