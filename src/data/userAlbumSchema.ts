import { z } from "zod";

const userAlbumFields = z.object({
  trackId: z.string().nullable().optional(),
  review: z.string().optional(),
  honorable: z.boolean().optional(),
  rank: z.number().int().positive().nullable().optional(),
});

export const userAlbumUpdateSchema = userAlbumFields
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update body must contain at least one field",
  });

export type UserAlbumUpdateInput = z.infer<typeof userAlbumUpdateSchema>;

export const userAlbumBulkUpdateSchema = z.object({
  updates: z
    .array(userAlbumFields.extend({ albumId: z.string().min(1) }).strict())
    .min(1, { message: "Update body must contain at least one album" }),
});

export type UserAlbumBulkUpdateInput = z.infer<typeof userAlbumBulkUpdateSchema>;
export type UserAlbumBulkUpdateItem = UserAlbumBulkUpdateInput["updates"][number];
