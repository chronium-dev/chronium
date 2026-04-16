ALTER TABLE "obligation_definitions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "recurrence_rules" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "obligation_definitions" CASCADE;--> statement-breakpoint
DROP TABLE "recurrence_rules" CASCADE;--> statement-breakpoint
ALTER TABLE "obligations" DROP CONSTRAINT "fk_obligations_definition";
--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP CONSTRAINT "fk_obligations_definition_organisation";
--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP CONSTRAINT "fk_obligations_definition_obligation_templates";
--> statement-breakpoint
DROP INDEX "org_template_unique";--> statement-breakpoint
DROP INDEX "unique_obligation_instance";--> statement-breakpoint
ALTER TABLE "obligations" ADD COLUMN "organisation_obligation_setting_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "frequency" "recurrence_frequency";--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "interval" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "anchor_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "day_of_month" integer;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "month_of_year" integer;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "end_of_month" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "custom_name" text;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "configured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "last_generated_at" timestamp;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "fk_obligations_definition" FOREIGN KEY ("organisation_obligation_setting_id") REFERENCES "public"."organisation_obligation_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "fk_org_obligation_settings_organisation" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "fk_org_obligation_settings_template" FOREIGN KEY ("obligation_template_id") REFERENCES "public"."obligation_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "org_obligation_settings_unique" ON "organisation_obligation_settings" USING btree ("organisation_id","obligation_template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_obligation_instance" ON "obligations" USING btree ("organisation_id","organisation_obligation_setting_id","due_date");--> statement-breakpoint
ALTER TABLE "obligations" DROP COLUMN "obligation_definition_id";