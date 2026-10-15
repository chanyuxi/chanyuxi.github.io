-- Adds the profile initialization flag. Existing users never went through the
-- Profile Setup flow, so they are backfilled as initialized to keep the
-- enforcement gate exclusive to new signups.
ALTER TABLE "user_profiles" ADD COLUMN "is_profile_initialized" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "user_profiles" SET "is_profile_initialized" = true;
