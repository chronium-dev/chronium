CREATE TYPE "public"."obligation_domain" AS ENUM('statutory', 'operational', 'governance');--> statement-breakpoint
ALTER TABLE "obligation_types" ADD COLUMN "domain" "obligation_domain" NOT NULL;