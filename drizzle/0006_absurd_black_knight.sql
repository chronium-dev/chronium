ALTER TABLE "organisation" ADD COLUMN "financial_year_end_month" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "financial_year_end_day" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD COLUMN "month" integer;--> statement-breakpoint
ALTER TABLE "organisation" DROP COLUMN "financial_year_end";