ALTER TABLE "obligations" ADD COLUMN "generated_from_recurrence_rule_id" text;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_generated_from_recurrence_rule_id_recurrence_rules_id_fk" FOREIGN KEY ("generated_from_recurrence_rule_id") REFERENCES "public"."recurrence_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "provider_account_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "events_unique" ON "events" USING btree ("organisation_id","event_type_id","event_date");--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_template_rule_unique" ON "obligation_templates" USING btree ("trigger_event_type_id","obligation_type_id","jurisdiction_id","entity_type_id");--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_generation_event_Id_unique" ON "obligations" USING btree ("generated_from_event_id","template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_generation_recurring_rule_id_unique" ON "obligations" USING btree ("generated_from_recurrence_rule_id","due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "recurrence_rule_unique" ON "recurrence_rules" USING btree ("organisation_id","obligation_type_id","name");