DROP INDEX "obligation_template_rule_unique";--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "first_occurrence_years" integer;--> statement-breakpoint
ALTER TABLE "obligations" ADD COLUMN "event_date" date NOT NULL;