DO $$ BEGIN
 CREATE TYPE "genders" AS ENUM('male', 'female', 'genderless', 'unknown');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "species" AS ENUM('human', 'alien', 'mythological creature');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "statuses" AS ENUM('alive', 'dead', 'unknown');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Character" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"gender" "genders" DEFAULT 'unknown' NOT NULL,
	"status" "statuses" DEFAULT 'alive' NOT NULL,
	"species" "species" DEFAULT 'mythological creature' NOT NULL,
	"description" text,
	"description_html" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_Idx" ON "Character" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gender_Idx" ON "Character" ("gender");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "species_Idx" ON "Character" ("species");