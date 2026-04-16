CREATE TYPE "public"."employee_count_enum" AS ENUM('0', '1-5', '6-20', '20+');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."obligation_category" AS ENUM('statutory', 'operational', 'governance');--> statement-breakpoint
CREATE TYPE "public"."obligation_source" AS ENUM('system', 'user');--> statement-breakpoint
CREATE TYPE "public"."obligation_status" AS ENUM('pending', 'completed', 'skipped', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."paye_frequency_enum" AS ENUM('quarterly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."recurrence_frequency" AS ENUM('weekly', 'monthly', 'quarterly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."vat_frequency_enum" AS ENUM('quarterly', 'monthly', 'annual');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entity_types" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entity_types_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "jurisdictions" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "jurisdictions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "obligation_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"category" "obligation_category" NOT NULL,
	"is_system" boolean DEFAULT true,
	"default_frequency" "recurrence_frequency",
	"default_value" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "obligations" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"organisation_obligation_setting_id" text NOT NULL,
	"due_date" date NOT NULL,
	"status" "obligation_status" DEFAULT 'pending' NOT NULL,
	"assigned_to_user_id" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisation" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"logo_height" integer,
	"logo_width" integer,
	"jurisdiction_id" text NOT NULL,
	"entity_type_id" text NOT NULL,
	"incorporation_date" date NOT NULL,
	"financial_year_end_month" integer NOT NULL,
	"financial_year_end_day" integer NOT NULL,
	"financial_year_end_is_last_day" boolean DEFAULT false NOT NULL,
	"vat_registered" boolean NOT NULL,
	"vat_frequency" "vat_frequency_enum",
	"vat_end_date" date,
	"payroll_active" boolean NOT NULL,
	"paye_frequency" "paye_frequency_enum",
	"employee_count" "employee_count_enum",
	"business_premises" boolean NOT NULL,
	"obligation_generation_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisation_obligation_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"organisation_id" text NOT NULL,
	"obligation_template_id" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"frequency" "recurrence_frequency",
	"interval" integer DEFAULT 1 NOT NULL,
	"anchor_date" date,
	"day_of_month" integer,
	"month_of_year" integer,
	"end_of_month" boolean DEFAULT false,
	"custom_name" text,
	"configured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"onboarded" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "obligations_assigned_to_user_id_user_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "fk_obligations_organisation_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "obligations" ADD CONSTRAINT "fk_obligations_settings_fk" FOREIGN KEY ("organisation_obligation_setting_id") REFERENCES "public"."organisation_obligation_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_jurisdiction_id_jurisdictions_id_fk" FOREIGN KEY ("jurisdiction_id") REFERENCES "public"."jurisdictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_entity_type_id_entity_types_id_fk" FOREIGN KEY ("entity_type_id") REFERENCES "public"."entity_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "fk_org_obligation_settings_organisation" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisation_obligation_settings" ADD CONSTRAINT "fk_org_obligation_settings_template" FOREIGN KEY ("obligation_template_id") REFERENCES "public"."obligation_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_account_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "members_pk" ON "member" USING btree ("user_id","organisation_id");--> statement-breakpoint
CREATE INDEX "member_user_id_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_organisation_id_idx" ON "member" USING btree ("organisation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "obligation_templates_key_unique" ON "obligation_templates" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_obligation_instance" ON "obligations" USING btree ("organisation_id","organisation_obligation_setting_id","due_date");--> statement-breakpoint
CREATE INDEX "obligations_due_date_idx" ON "obligations" USING btree ("due_date");--> statement-breakpoint
CREATE UNIQUE INDEX "org_obligation_settings_unique" ON "organisation_obligation_settings" USING btree ("organisation_id","obligation_template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "org_obligation_settings_key_unique" ON "organisation_obligation_settings" USING btree ("organisation_id","key");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");