CREATE TABLE "organisation_obligation_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"obligation_template_id" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "organisation_obligation_settings_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "organisation_obligation_settings_obligation_template_id_obligation_templates_id_fk" FOREIGN KEY ("obligation_template_id") REFERENCES "public"."obligation_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "org_template_unique" ON "organisation_obligation_settings" USING btree ("organisation_id","obligation_template_id");