CREATE TYPE "public"."obligation_status" AS ENUM('pending', 'completed', 'skipped', 'cancelled');--> statement-breakpoint
ALTER TABLE "organization" RENAME TO "organisation";--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_organisation_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "member" DROP CONSTRAINT "member_organisation_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "obligations" DROP CONSTRAINT "obligations_organisation_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation" DROP CONSTRAINT "organization_jurisdiction_id_jurisdictions_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation" DROP CONSTRAINT "organization_entity_type_id_entity_types_id_fk";
--> statement-breakpoint
ALTER TABLE "obligations" ALTER COLUMN "template_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "obligations" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."obligation_status";--> statement-breakpoint
ALTER TABLE "obligations" ALTER COLUMN "status" SET DATA TYPE "public"."obligation_status" USING "status"::"public"."obligation_status";--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_jurisdiction_id_jurisdictions_id_fk" FOREIGN KEY ("jurisdiction_id") REFERENCES "public"."jurisdictions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_entity_type_id_entity_types_id_fk" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_event_type_idx" ON "events" USING btree ("event_type_id");--> statement-breakpoint
CREATE INDEX "obligation_templates_trigger_event_idx" ON "obligation_templates" USING btree ("trigger_event_type_id");--> statement-breakpoint
CREATE INDEX "obligations_organisation_idx" ON "obligations" USING btree ("organisation_id");