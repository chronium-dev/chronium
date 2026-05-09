CREATE TYPE "public"."recurrence_type" AS ENUM('day_of_month', 'last_day_of_month');--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "day_of_week" integer;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD COLUMN "recurrenceType" "recurrence_type";--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" DROP COLUMN "end_of_month";