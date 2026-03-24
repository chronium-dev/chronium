ALTER TABLE "events" DROP CONSTRAINT "events_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_event_type_id_event_types_id_fk";
--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP CONSTRAINT "obligation_templates_obligation_type_id_obligation_types_id_fk";
--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP CONSTRAINT "obligation_templates_trigger_event_type_id_event_types_id_fk";
--> statement-breakpoint
ALTER TABLE "obligations" DROP CONSTRAINT "obligations_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "obligations" DROP CONSTRAINT "obligations_obligation_type_id_obligation_types_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation" DROP CONSTRAINT "organisation_jurisdiction_id_jurisdictions_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation" DROP CONSTRAINT "organisation_entity_type_id_entity_types_id_fk";
--> statement-breakpoint
ALTER TABLE "recurrence_rules" DROP CONSTRAINT "recurrence_rules_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "recurrence_rules" DROP CONSTRAINT "recurrence_rules_event_type_id_event_types_id_fk";
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_obligation_type_id_obligation_types_id_fk" FOREIGN KEY ("obligation_type_id") REFERENCES "public"."obligation_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_trigger_event_type_id_event_types_id_fk" FOREIGN KEY ("trigger_event_type_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_obligation_type_id_obligation_types_id_fk" FOREIGN KEY ("obligation_type_id") REFERENCES "public"."obligation_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_jurisdiction_id_jurisdictions_id_fk" FOREIGN KEY ("jurisdiction_id") REFERENCES "public"."jurisdictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_entity_type_id_entity_types_id_fk" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD CONSTRAINT "recurrence_rules_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD CONSTRAINT "recurrence_rules_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
--DROP TYPE "public"."employee_count_enum";