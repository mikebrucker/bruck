-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "albums" (
	"id" text PRIMARY KEY NOT NULL,
	"artist" text NOT NULL,
	"album" text NOT NULL,
	"year" integer NOT NULL,
	"label" text NOT NULL,
	"genre" text NOT NULL,
	"runtime" text NOT NULL,
	"disc_titles" text[],
	"art" text[],
	"personnel" jsonb
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" text NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"duration" text NOT NULL,
	"notes" text,
	"instrumental" boolean,
	"disc" integer,
	"personnel" jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT 'me' NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text DEFAULT 'me' NOT NULL,
	"album_id" text NOT NULL,
	"track_id" text,
	"review" text DEFAULT '' NOT NULL,
	"honorable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"rank" integer,
	CONSTRAINT "user_albums_user_id_album_id_key" UNIQUE("user_id","album_id")
);
--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_albums" ADD CONSTRAINT "user_albums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_albums" ADD CONSTRAINT "user_albums_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
*/