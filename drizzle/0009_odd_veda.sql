CREATE TYPE "public"."employee_count_enum" AS ENUM('0', '1-5', '6-20', '20+');--> statement-breakpoint
CREATE TYPE "public"."vat_frequency_enum" AS ENUM('quarterly', 'monthly', 'annual');--> statement-breakpoint
CREATE TYPE "public"."vat_quarter_group_enum" AS ENUM('jan', 'feb', 'mar');