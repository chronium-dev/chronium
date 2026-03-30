CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"name" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "obligation_generation_event_Id_unique";--> statement-breakpoint
DROP INDEX "obligation_generation_event_obligation_unique";--> statement-breakpoint
DROP INDEX "events_unique";--> statement-breakpoint
DROP INDEX "recurrence_rule_unique";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "asset_id" text;--> statement-breakpoint
ALTER TABLE "obligations" ADD COLUMN "asset_id" text;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD COLUMN "asset_id" text;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "asset_org_type_unique" ON "assets" USING btree ("organisation_id","name","name");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD CONSTRAINT "recurrence_rules_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_generation_event_id_unique" ON "obligations" USING btree ("generated_from_event_id","template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "events_unique" ON "events" USING btree ("organisation_id","event_type_id","event_date","asset_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recurrence_rule_unique" ON "recurrence_rules" USING btree ("organisation_id","event_type_id","asset_id");