CREATE TABLE IF NOT EXISTS "CharactersToEpisodes" (
	"character_id" integer NOT NULL,
	"episode_id" integer NOT NULL,
	CONSTRAINT "CharactersToEpisodes_character_id_episode_id_pk" PRIMARY KEY("character_id","episode_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Episode" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"air_date" varchar(32) NOT NULL,
	"episode" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "air_date_Idx" ON "Episode" ("air_date");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CharactersToEpisodes" ADD CONSTRAINT "CharactersToEpisodes_character_id_Character_id_fk" FOREIGN KEY ("character_id") REFERENCES "Character"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CharactersToEpisodes" ADD CONSTRAINT "CharactersToEpisodes_episode_id_Episode_id_fk" FOREIGN KEY ("episode_id") REFERENCES "Episode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
