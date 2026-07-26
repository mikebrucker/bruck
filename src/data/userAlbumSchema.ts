import { z } from "zod";

export const userAlbumUpdateSchema = z
  .object({
    trackId: z.string().nullable().optional(),
    review: z.string().optional(),
    honorable: z.boolean().optional(),
    rank: z.number().int().positive().nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update body must contain at least one field",
  });

export type UserAlbumUpdateInput = z.infer<typeof userAlbumUpdateSchema>;
