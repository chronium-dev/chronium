ALTER TABLE "obligation_templates" RENAME COLUMN "event_type_id" TO "trigger_event_type_id";--> statement-breakpoint
ALTER TABLE "obligation_templates" DROP CONSTRAINT "obligation_templates_event_type_id_event_types_id_fk";
--> statement-breakpoint
DROP INDEX "obligation_templates_trigger_event_idx";--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_trigger_event_type_id_event_types_id_fk" FOREIGN KEY ("trigger_event_type_id") REFERENCES "public"."event_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "obligation_templates_trigger_event_idx" ON "obligation_templates" USING btree ("trigger_event_type_id");