CREATE TABLE "obligation_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"category" "obligation_category" NOT NULL,
	"is_system" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recurrence_rules" ALTER COLUMN "frequency" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."recurrence_frequency";--> statement-breakpoint
CREATE TYPE "public"."recurrence_frequency" AS ENUM('weekly', 'monthly', 'quarterly', 'yearly');--> statement-breakpoint
ALTER TABLE "recurrence_rules" ALTER COLUMN "frequency" SET DATA TYPE "public"."recurrence_frequency" USING "frequency"::"public"."recurrence_frequency";--> statement-breakpoint
ALTER TABLE "obligation_definitions" ADD COLUMN "organisation_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "obligation_definitions" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "obligation_definitions" ADD COLUMN "is_system" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "financial_year_end_is_last_day" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_templates_key_unique" ON "obligation_templates" USING btree ("key");--> statement-breakpoint
ALTER TABLE "obligation_definitions" ADD CONSTRAINT "obligation_definitions_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_definitions_key_unique" ON "obligation_definitions" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_obligation_instance" ON "obligations" USING btree ("organisation_id","obligation_definition_id","due_date");--> statement-breakpoint
ALTER TABLE "obligation_definitions" DROP COLUMN "source";--> statement-breakpoint
DROP TYPE "public"."obligation_domain";