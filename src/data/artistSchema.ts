import { z } from "zod";
import { creditSchema } from "@/data/albumSchema";

export const artistUpdateSchema = z
  .object({
    artist: z.string().min(1).optional(),
    bio: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    media: z.array(z.string()).nullable().optional(),
    members: z.array(creditSchema).nullable().optional(),
    formerMembers: z.array(creditSchema).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update body must contain at least one field",
  });

export type ArtistUpdateInput = z.infer<typeof artistUpdateSchema>;

export const artistCreateSchema = z
  .object({
    artist: z.string().min(1),
    bio: z.string().optional(),
    location: z.string().optional(),
    media: z.array(z.string()).optional(),
    members: z.array(creditSchema).optional(),
    formerMembers: z.array(creditSchema).optional(),
  })
  .strict();

export type ArtistCreateInput = z.infer<typeof artistCreateSchema>;
