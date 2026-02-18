CREATE TABLE "saju_reading" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"label" text NOT NULL,
	"birth_date" text NOT NULL,
	"is_lunar" text DEFAULT 'false' NOT NULL,
	"analysis" jsonb NOT NULL,
	"ai_interpretation" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saju_reading" ADD CONSTRAINT "saju_reading_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "saju_reading_user_id_idx" ON "saju_reading" USING btree ("user_id");