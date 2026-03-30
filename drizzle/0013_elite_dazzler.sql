ALTER TABLE "obligations" ALTER COLUMN "assigned_to_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "generated";--> statement-breakpoint
ALTER TABLE "obligations" DROP COLUMN "generated";