ALTER TABLE "obligations" DROP CONSTRAINT "fk_obligations_definition";
--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "fk_obligations_settings_fk" FOREIGN KEY ("organisation_obligation_setting_id") REFERENCES "public"."organisation_obligation_settings"("id") ON DELETE cascade ON UPDATE no action;