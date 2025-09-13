import type { StudyKit } from './types';

const API_BASE = '/api';

export async function createStudyKit(data: Omit<StudyKit, 'id' | 'createdAt'>): Promise<StudyKit> {
  const response = await fetch(`${API_BASE}/study-kits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create study kit');
  }

  return response.json();
}

export async function getStudyKit(id: string): Promise<StudyKit> {
  const response = await fetch(`${API_BASE}/study-kits/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch study kit');
  }

  return response.json();
}

export async function getAllStudyKits(): Promise<StudyKit[]> {
  const response = await fetch(`${API_BASE}/study-kits`);

  if (!response.ok) {
    throw new Error('Failed to fetch study kits');
  }

  return response.json();
}

export async function updateStudyKit(id: string, data: Partial<Omit<StudyKit, 'id' | 'createdAt'>>): Promise<StudyKit> {
  const response = await fetch(`${API_BASE}/study-kits/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update study kit');
  }

  return response.json();
}

export async function deleteStudyKit(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/study-kits/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete study kit');
  }
}