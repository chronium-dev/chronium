ALTER TABLE "obligation_templates" ADD COLUMN "due_date_operations" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "first_occurrence_operations" jsonb;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "obligations_generated_at";--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP COLUMN "due_offset_years";--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP COLUMN "due_offset_months";--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP COLUMN "due_offset_days";--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP COLUMN "first_occurrence_years";--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP COLUMN "first_occurrence_months";--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP COLUMN "first_occurrence_days";