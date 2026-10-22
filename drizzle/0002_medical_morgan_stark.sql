CREATE TYPE "public"."post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "posts" (
	"author_id" uuid NOT NULL,
	"compiler_version" integer NOT NULL,
	"content_json" jsonb NOT NULL,
	"content_md" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"published_at" timestamp with time zone,
	"slug" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"tags" text[] NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_user_profiles_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "posts_status_published_idx" ON "posts" USING btree ("status","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_unique" ON "posts" USING btree ("slug");