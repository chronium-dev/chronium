CREATE TABLE "entity_types" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "entity_types_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "jurisdictions" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "jurisdictions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "jurisdiction_id" text;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "entity_type_id" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "jurisdiction_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "entity_type_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_jurisdiction_id_jurisdictions_id_fk" FOREIGN KEY ("jurisdiction_id") REFERENCES "public"."jurisdictions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_entity_type_id_entity_types_id_fk" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_jurisdiction_id_jurisdictions_id_fk" FOREIGN KEY ("jurisdiction_id") REFERENCES "public"."jurisdictions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_entity_type_id_entity_types_id_fk" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE no action ON UPDATE no action;