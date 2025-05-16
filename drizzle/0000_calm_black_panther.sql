CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"size" integer NOT NULL,
	"type" text NOT NULL,
	"fileUrl" text NOT NULL,
	"thumbnailUrl" text,
	"User_id" text NOT NULL,
	"Parent_id" uuid NOT NULL,
	"is_folder" boolean DEFAULT false NOT NULL,
	"is_Starred" boolean DEFAULT false NOT NULL,
	"is_Trash" boolean DEFAULT false NOT NULL,
	"created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL
);
