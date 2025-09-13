import { pgTable, uuid, varchar, timestamp, text, jsonb } from 'drizzle-orm/pg-core';
import type { Flashcard, QuizQuestion } from '../types';

export const studyKits = pgTable('study_kits', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  summary: text('summary').notNull(),
  flashcards: jsonb('flashcards').$type<Flashcard[]>().notNull().default([]),
  mindMap: text('mind_map').notNull(),
  quiz: jsonb('quiz').$type<QuizQuestion[]>().notNull().default([]),
  transcription: text('transcription').notNull(),
  youtubeLinks: jsonb('youtube_links').$type<string[]>().notNull().default([]),
});

export type StudyKit = typeof studyKits.$inferSelect;
export type NewStudyKit = typeof studyKits.$inferInsert;