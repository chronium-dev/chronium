CREATE TABLE "event_types" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "event_types_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "obligation_types" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "obligation_types_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "type" TO "event_type_id";--> statement-breakpoint
ALTER TABLE "obligation_templates" RENAME COLUMN "trigger_event_type" TO "trigger_event_type_id";--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD COLUMN "obligation_type_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "obligations" ADD COLUMN "obligation_type_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "obligations" ADD COLUMN "generated_from_event_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_obligation_type_id_obligation_types_id_fk" FOREIGN KEY ("obligation_type_id") REFERENCES "public"."obligation_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligation_templates" ADD CONSTRAINT "obligation_templates_trigger_event_type_id_event_types_id_fk" FOREIGN KEY ("trigger_event_type_id") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_obligation_type_id_obligation_types_id_fk" FOREIGN KEY ("obligation_type_id") REFERENCES "public"."obligation_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_generated_from_event_id_events_id_fk" FOREIGN KEY ("generated_from_event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;