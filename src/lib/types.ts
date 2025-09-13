import type { generateFlashcards } from '@/ai/flows/generate-flashcards';
import type { generateQuiz } from '@/ai/flows/generate-quiz';
import type { z } from 'zod';

// Re-creating Zod schemas as types for client-side use
export type Flashcard = {
  term: string;
  definition: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export interface StudyKit {
  id: string;
  title: string;
  createdAt: string;
  summary: string;
  flashcards: Flashcard[];
  mindMap: string;
  quiz: QuizQuestion[];
  transcription: string;
  youtubeLinks: string[];
}

export type StudyKitView = 'summary' | 'flashcards' | 'mindmap' | 'quiz' | 'transcription' | 'youtube' | 'notes';
