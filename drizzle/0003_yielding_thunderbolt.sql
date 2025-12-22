CREATE TABLE "sku_level1_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sku_level2_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"l1_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sku_level3_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"l2_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sku_level4_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"l3_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sku_level5_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"l4_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sku_level6_master" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"l5_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tbl_sku_master" ADD COLUMN "l1" integer;--> statement-breakpoint
ALTER TABLE "tbl_sku_master" ADD COLUMN "l2" integer;--> statement-breakpoint
ALTER TABLE "tbl_sku_master" ADD COLUMN "l3" integer;--> statement-breakpoint
ALTER TABLE "tbl_sku_master" ADD COLUMN "l4" integer;--> statement-breakpoint
ALTER TABLE "tbl_sku_master" ADD COLUMN "l5" integer;--> statement-breakpoint
ALTER TABLE "tbl_sku_master" ADD COLUMN "l6" integer;--> statement-breakpoint
ALTER TABLE "sku_level2_master" ADD CONSTRAINT "sku_level2_master_l1_id_sku_level1_master_id_fk" FOREIGN KEY ("l1_id") REFERENCES "public"."sku_level1_master"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_level3_master" ADD CONSTRAINT "sku_level3_master_l2_id_sku_level2_master_id_fk" FOREIGN KEY ("l2_id") REFERENCES "public"."sku_level2_master"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_level4_master" ADD CONSTRAINT "sku_level4_master_l3_id_sku_level3_master_id_fk" FOREIGN KEY ("l3_id") REFERENCES "public"."sku_level3_master"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_level5_master" ADD CONSTRAINT "sku_level5_master_l4_id_sku_level4_master_id_fk" FOREIGN KEY ("l4_id") REFERENCES "public"."sku_level4_master"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sku_level6_master" ADD CONSTRAINT "sku_level6_master_l5_id_sku_level5_master_id_fk" FOREIGN KEY ("l5_id") REFERENCES "public"."sku_level5_master"("id") ON DELETE no action ON UPDATE no action;