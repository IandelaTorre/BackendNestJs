CREATE TABLE "catalog_user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"visual_name" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "catalog_user_roles_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "catalog_user_roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_logs_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(100),
	"last_name" varchar(100),
	"second_last_name" varchar(100),
	"user_code" varchar(50) NOT NULL,
	"role_id" integer NOT NULL,
	"enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_user_code_unique" UNIQUE("user_code")
);
--> statement-breakpoint
ALTER TABLE "user_logs" ADD CONSTRAINT "user_logs_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_catalog_user_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."catalog_user_roles"("id") ON DELETE no action ON UPDATE no action;