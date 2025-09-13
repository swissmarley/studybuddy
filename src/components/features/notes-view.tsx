'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';

export default function NotesView({ notesId }: { notesId: string}) {
  const [notes, setNotes] = useState('');
  const debouncedNotes = useDebounce(notes, 500);
  const notesKey = `studykit-notes-${notesId}`;

  useEffect(() => {
    const savedNotes = localStorage.getItem(notesKey);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
        setNotes('');
    }
  }, [notesKey]);

  useEffect(() => {
    localStorage.setItem(notesKey, debouncedNotes);
  }, [debouncedNotes, notesKey]);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
        <CardDescription>Your notes are automatically saved to this browser.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Textarea
          placeholder="Start typing your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[400px] text-base h-full resize-none"
        />
      </CardContent>
    </Card>
  );
}
