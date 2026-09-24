CREATE TABLE IF NOT EXISTS "site_likes" (
  "id" smallint PRIMARY KEY,
  "count" bigint DEFAULT 0 NOT NULL,
  CONSTRAINT "site_likes_singleton_check" CHECK ("id" = 1),
  CONSTRAINT "site_likes_count_nonnegative_check" CHECK ("count" >= 0)
);

INSERT INTO "site_likes" ("id", "count")
VALUES (1, 0)
ON CONFLICT ("id") DO NOTHING;
