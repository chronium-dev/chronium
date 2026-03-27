ALTER TABLE "obligation_templates" ADD COLUMN "first_occurrence_override" boolean;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "first_occurrence_base" text;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "first_occurrence_months" integer;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "first_occurrence_days" integer;--> statement-breakpoint
ALTER TABLE "obligations" ADD COLUMN "assigned_to_user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation" ADD COLUMN "obligation_generation_horizon" date;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_assigned_to_user_id_user_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;