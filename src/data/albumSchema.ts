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
    artistId: z.string().min(1).optional(),
    album: z.string().optional(),
    year: z.number().optional(),
    label: z.array(z.string()).min(1).optional(),
    genre: z.array(z.string()).min(1).optional(),
    runtime: z.string().optional(),
    tracks: z.array(trackSchema).min(1).optional(),
    discTitles: z.array(z.string()).nullable().optional(),
    art: z.array(z.string()).nullable().optional(),
    personnel: personnelSchema.nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Update body must contain at least one field",
  });

export type AlbumUpdateInput = z.infer<typeof albumUpdateSchema>;

export const albumCreateSchema = z
  .object({
    artistId: z.string().min(1),
    album: z.string(),
    year: z.number(),
    label: z.array(z.string()).min(1),
    genre: z.array(z.string()).min(1),
    runtime: z.string(),
    tracks: z.array(trackSchema).min(1),
    discTitles: z.array(z.string()).optional(),
    art: z.array(z.string()).optional(),
    personnel: personnelSchema.optional(),
  })
  .strict();

export type AlbumCreateInput = z.infer<typeof albumCreateSchema>;
