ALTER TABLE "obligation_templates" ALTER COLUMN "due_offset_days" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "vat_frequency" SET DATA TYPE "public"."vat_frequency_enum";--> statement-breakpoint
ALTER TABLE "organisation" ALTER COLUMN "vat_quarter_group" SET DATA TYPE "public"."vat_quarter_group_enum";--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "due_offset_months" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- ALTER TABLE "organisation" DROP COLUMN "vat_scheme";