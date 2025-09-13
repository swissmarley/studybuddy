import { eq } from 'drizzle-orm';
import { db } from './index';
import { studyKits, type NewStudyKit } from './schema';
import type { StudyKit as ClientStudyKit } from '../types';

export async function createStudyKit(data: Omit<ClientStudyKit, 'id' | 'createdAt'>): Promise<ClientStudyKit> {
  const newStudyKit: NewStudyKit = {
    title: data.title,
    summary: data.summary,
    flashcards: data.flashcards,
    mindMap: data.mindMap,
    quiz: data.quiz,
    transcription: data.transcription,
    youtubeLinks: data.youtubeLinks,
  };

  const [result] = await db.insert(studyKits).values(newStudyKit).returning();
  
  return {
    id: result.id,
    title: result.title,
    createdAt: result.createdAt.toISOString(),
    summary: result.summary,
    flashcards: result.flashcards,
    mindMap: result.mindMap,
    quiz: result.quiz,
    transcription: result.transcription,
    youtubeLinks: result.youtubeLinks,
  };
}

export async function getStudyKitById(id: string): Promise<ClientStudyKit | null> {
  const [result] = await db.select().from(studyKits).where(eq(studyKits.id, id));
  
  if (!result) return null;

  return {
    id: result.id,
    title: result.title,
    createdAt: result.createdAt.toISOString(),
    summary: result.summary,
    flashcards: result.flashcards,
    mindMap: result.mindMap,
    quiz: result.quiz,
    transcription: result.transcription,
    youtubeLinks: result.youtubeLinks,
  };
}

export async function getAllStudyKits(): Promise<ClientStudyKit[]> {
  const results = await db.select().from(studyKits);
  
  return results.map(result => ({
    id: result.id,
    title: result.title,
    createdAt: result.createdAt.toISOString(),
    summary: result.summary,
    flashcards: result.flashcards,
    mindMap: result.mindMap,
    quiz: result.quiz,
    transcription: result.transcription,
    youtubeLinks: result.youtubeLinks,
  }));
}

export async function updateStudyKit(id: string, data: Partial<Omit<ClientStudyKit, 'id' | 'createdAt'>>): Promise<ClientStudyKit | null> {
  const [result] = await db
    .update(studyKits)
    .set(data)
    .where(eq(studyKits.id, id))
    .returning();

  if (!result) return null;

  return {
    id: result.id,
    title: result.title,
    createdAt: result.createdAt.toISOString(),
    summary: result.summary,
    flashcards: result.flashcards,
    mindMap: result.mindMap,
    quiz: result.quiz,
    transcription: result.transcription,
    youtubeLinks: result.youtubeLinks,
  };
}

export async function deleteStudyKit(id: string): Promise<boolean> {
  const result = await db.delete(studyKits).where(eq(studyKits.id, id));
  return result.rowCount > 0;
}