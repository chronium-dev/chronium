ALTER TABLE "obligations" DROP CONSTRAINT "obligations_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "fk_obligations_organisation_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;