CREATE TYPE "public"."recurrence_frequency" AS ENUM('daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "recurrence_rules" RENAME COLUMN "obligation_type_id" TO "event_type_id";--> statement-breakpoint
ALTER TABLE "recurrence_rules" DROP CONSTRAINT "recurrence_rules_obligation_type_id_obligation_types_id_fk";
--> statement-breakpoint
DROP INDEX "recurrence_rule_unique";--> statement-breakpoint
ALTER TABLE "recurrence_rules" ALTER COLUMN "frequency" SET DATA TYPE "public"."recurrence_frequency" USING "frequency"::"public"."recurrence_frequency";--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD COLUMN "month_day" integer;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD CONSTRAINT "recurrence_rules_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_generation_event_obligation_unique" ON "obligations" USING btree ("generated_from_event_id","obligation_type_id");--> statement-breakpoint
CREATE UNIQUE INDEX "recurrence_rule_unique" ON "recurrence_rules" USING btree ("organisation_id","event_type_id");