import { z } from "zod";

export const userAlbumUpdateSchema = z
  .object({
    trackId: z.string().nullable().optional(),
    review: z.string().optional(),
    honorable: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update body must contain at least one field",
  });

export type UserAlbumUpdateInput = z.infer<typeof userAlbumUpdateSchema>;

export const userAlbumRowSchema = z.object({
  id: z.string(),
  albumId: z.string(),
  trackId: z.string().nullable(),
  review: z.string(),
  honorable: z.boolean(),
  rank: z.number().nullable(),
});
