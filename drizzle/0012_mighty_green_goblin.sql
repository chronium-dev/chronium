ALTER TABLE "assets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "assets" CASCADE;--> statement-breakpoint
ALTER TABLE "obligation_templates" RENAME COLUMN "trigger_event_type_id" TO "event_type_id";--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_asset_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP CONSTRAINT "obligation_templates_trigger_event_type_id_event_types_id_fk";
--> statement-breakpoint
--ALTER TABLE "obligations" DROP CONSTRAINT "obligations_asset_id_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "recurrence_rules" DROP CONSTRAINT "recurrence_rules_asset_id_assets_id_fk";
--> statement-breakpoint
DROP INDEX "events_unique";--> statement-breakpoint
DROP INDEX "obligation_templates_trigger_event_idx";--> statement-breakpoint
DROP INDEX "obligation_template_rule_unique";--> statement-breakpoint
DROP INDEX "recurrence_rule_unique";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "obligations_generated_at" timestamp;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "events_unique" ON "events" USING btree ("organisation_id","event_type_id","event_date");--> statement-breakpoint
CREATE INDEX "obligation_templates_trigger_event_idx" ON "obligation_templates" USING btree ("event_type_id");--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_template_rule_unique" ON "obligation_templates" USING btree ("event_type_id","obligation_type_id","jurisdiction_id","entity_type_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recurrence_rule_unique" ON "recurrence_rules" USING btree ("organisation_id","event_type_id");--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "asset_id";--> statement-breakpoint
ALTER TABLE "obligations" DROP COLUMN "asset_id";--> statement-breakpoint
ALTER TABLE "recurrence_rules" DROP COLUMN "asset_id";