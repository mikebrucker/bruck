import { z } from "zod";

export const creditSchema = z
  .object({
    name: z.string(),
    roles: z.array(z.string()),
    notes: z.string().optional(),
  })
  .strict();

export const personnelSchema = z
  .object({
    members: z.array(creditSchema).optional(),
    guests: z.array(creditSchema).optional(),
    production: z.array(creditSchema).optional(),
    studios: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })
  .strict();

export const trackSchema = z
  .object({
    number: z.number(),
    title: z.string(),
    duration: z.string(),
    notes: z.string().optional(),
    instrumental: z.boolean().optional(),
    personnel: z.array(creditSchema).optional(),
    disc: z.number().optional(),
  })
  .strict();

export const albumUpdateSchema = z
  .object({
    artist: z.string().optional(),
    album: z.string().optional(),
    year: z.number().optional(),
    label: z.string().optional(),
    genre: z.string().optional(),
    runtime: z.string().optional(),
    review: z.string().optional(),
    tracks: z.array(trackSchema).min(1).optional(),
    discTitles: z.array(z.string()).nullable().optional(),
    art: z.array(z.string()).nullable().optional(),
    favoriteTrack: z.number().optional(),
    favoriteDisc: z.number().nullable().optional(),
    personnel: personnelSchema.nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update body must contain at least one field",
  });

export type AlbumUpdateInput = z.infer<typeof albumUpdateSchema>;

export const albumCreateSchema = z
  .object({
    id: z.string(),
    artist: z.string(),
    album: z.string(),
    year: z.number(),
    label: z.string(),
    genre: z.string(),
    runtime: z.string(),
    review: z.string(),
    tracks: z.array(trackSchema).min(1),
    discTitles: z.array(z.string()).optional(),
    art: z.array(z.string()).optional(),
    favoriteTrack: z.number().default(0),
    favoriteDisc: z.number().optional(),
    personnel: personnelSchema.optional(),
  })
  .strict();

export type AlbumCreateInput = z.infer<typeof albumCreateSchema>;
