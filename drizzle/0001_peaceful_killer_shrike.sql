CREATE TABLE "tbl_sku_master" (
	"sku_id" serial PRIMARY KEY NOT NULL,
	"sku_code" varchar(255) NOT NULL,
	"sku_description" varchar(255),
	"sku_points" integer NOT NULL,
	"vertical" varchar(255) NOT NULL,
	"range" varchar(255) NOT NULL,
	"is_sku_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tbl_sku_master_sku_code_unique" UNIQUE("sku_code")
);
