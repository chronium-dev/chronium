ALTER TABLE "organisation" ADD COLUMN "incorporation_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "financial_year_end" date NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "vat_registered" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "payroll_active" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "employee_count" text;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "business_premises" text NOT NULL;