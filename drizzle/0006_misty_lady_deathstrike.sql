CREATE TABLE "recurrence_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"obligation_type_id" text NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"frequency" text NOT NULL,
	"interval" integer DEFAULT 1 NOT NULL,
	"weekday" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD CONSTRAINT "recurrence_rules_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurrence_rules" ADD CONSTRAINT "recurrence_rules_obligation_type_id_obligation_types_id_fk" FOREIGN KEY ("obligation_type_id") REFERENCES "public"."obligation_types"("id") ON DELETE no action ON UPDATE no action;