CREATE TABLE "study_kits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"summary" text NOT NULL,
	"flashcards" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mind_map" text NOT NULL,
	"quiz" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"transcription" text NOT NULL,
	"youtube_links" jsonb DEFAULT '[]'::jsonb NOT NULL
);
