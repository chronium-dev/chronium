ALTER TABLE "obligation_definitions" DROP CONSTRAINT "fk_obligations_definition_recurrence_rule";
--> statement-breakpoint
ALTER TABLE "obligations" DROP CONSTRAINT "fk_obligations_definition";
--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP CONSTRAINT "organisation_obligation_settings_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP CONSTRAINT "organisation_obligation_settings_obligation_template_id_obligation_templates_id_fk";
--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP CONSTRAINT "fk_obligations_definition_organisation";
--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP CONSTRAINT "fk_obligations_definition_obligation_templates";
--> statement-breakpoint
ALTER TABLE "obligation_definitions" ADD CONSTRAINT "fk_obligations_definition_recurrence_rule" FOREIGN KEY ("recurrence_rule_id") REFERENCES "public"."recurrence_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "fk_obligations_definition" FOREIGN KEY ("obligation_definition_id") REFERENCES "public"."obligation_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "fk_obligations_definition_organisation" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "fk_obligations_definition_obligation_templates" FOREIGN KEY ("obligation_template_id") REFERENCES "public"."obligation_templates"("id") ON DELETE cascade ON UPDATE no action;