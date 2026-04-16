ALTER TABLE "obligation_templates" ADD COLUMN "default_frequency" "recurrence_frequency";--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "default_value" integer;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP COLUMN "last_generated_at";