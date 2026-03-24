CREATE TYPE "public"."employee_count_enum" AS ENUM('0', '1-5', '6-20', '20+');--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "vat_registered" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "payroll_active" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "employee_count" SET DATA TYPE "public"."employee_count_enum" USING "employee_count"::"public"."employee_count_enum";--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "business_premises" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "vat_scheme" text;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "vat_frequency" text;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "vat_quarter_group" text;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "vat_start_date" date;