ALTER TABLE "obligations" DROP CONSTRAINT "obligations_generated_from_recurrence_rule_id_recurrence_rules_id_fk";
--> statement-breakpoint
DROP INDEX "obligation_generation_recurring_rule_id_unique";--> statement-breakpoint
ALTER TABLE "obligations" DROP COLUMN "generated_from_recurrence_rule_id";