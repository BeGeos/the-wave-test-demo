CREATE TABLE IF NOT EXISTS "Location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"type" varchar(128) NOT NULL,
	"dimension" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Character" ADD COLUMN "location_id" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "type_Idx" ON "Location" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dimension_Idx" ON "Location" ("dimension");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "locationId_Idx" ON "Character" ("location_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Character" ADD CONSTRAINT "Character_location_id_Location_id_fk" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
