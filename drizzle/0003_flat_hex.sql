ALTER TABLE "obligation_definitions" DROP CONSTRAINT "obligation_definitions_recurrence_rule_id_recurrence_rules_id_fk";
--> statement-breakpoint
ALTER TABLE "obligations" DROP CONSTRAINT "obligations_obligation_definition_id_obligation_definitions_id_fk";
--> statement-breakpoint
ALTER TABLE "obligation_definitions" ADD CONSTRAINT "fk_obligations_definition_recurrence_rule" FOREIGN KEY ("recurrence_rule_id") REFERENCES "public"."recurrence_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "fk_obligations_definition" FOREIGN KEY ("obligation_definition_id") REFERENCES "public"."obligation_definitions"("id") ON DELETE no action ON UPDATE no action;