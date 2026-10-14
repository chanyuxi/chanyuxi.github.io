-- Initial migration. `site_likes` already exists in production (created
-- manually via database/site-likes.sql before Drizzle Kit was adopted), so its
-- DDL was removed here; the Drizzle snapshot still tracks the table, which
-- keeps future diffs correct.
CREATE TYPE "public"."like_target_type" AS ENUM('poem', 'post', 'life_record');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'owner');--> statement-breakpoint
CREATE TABLE "likes" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_id" text NOT NULL,
	"target_type" "like_target_type" NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "likes_user_target_unique" UNIQUE("user_id","target_type","target_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"avatar_url" text,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"display_name" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE INDEX "likes_target_idx" ON "likes" USING btree ("target_type","target_id");