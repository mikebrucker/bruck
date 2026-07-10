import {
  boolean,
  foreignKey,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import type { Credit, Personnel } from "@/types/album";

export const albums = pgTable("albums", {
  id: text().primaryKey().notNull(),
  artist: text().notNull(),
  album: text().notNull(),
  year: integer().notNull(),
  label: text().notNull(),
  genre: text().notNull(),
  runtime: text().notNull(),
  discTitles: text("disc_titles").array(),
  art: text().array(),
  personnel: jsonb().$type<Personnel>(),
});

export const tracks = pgTable(
  "tracks",
  {
    id: serial().primaryKey().notNull(),
    albumId: text("album_id").notNull(),
    number: integer().notNull(),
    title: text().notNull(),
    duration: text().notNull(),
    notes: text(),
    instrumental: boolean(),
    disc: integer(),
    personnel: jsonb().$type<Array<Credit>>(),
  },
  (table) => [
    foreignKey({
      columns: [table.albumId],
      foreignColumns: [albums.id],
      name: "tracks_album_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const users = pgTable("users", {
  id: text().default("me").primaryKey().notNull(),
  settings: jsonb().$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const userAlbums = pgTable(
  "user_albums",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id").default("me").notNull(),
    albumId: text("album_id").notNull(),
    trackId: text("track_id"),
    review: text().default("").notNull(),
    honorable: boolean().default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    rank: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_albums_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.albumId],
      foreignColumns: [albums.id],
      name: "user_albums_album_id_fkey",
    }).onDelete("cascade"),
    unique("user_albums_user_id_album_id_key").on(table.userId, table.albumId),
  ],
);
