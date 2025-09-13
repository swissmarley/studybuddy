
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpenCheck,
  FileText,
  Layers,
  GitMerge,
  HelpCircle,
  AlignLeft,
  Youtube,
  PenLine,
  LoaderCircle,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import * as mammoth from "mammoth";

import type { StudyKit, StudyKitView } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { transcribeContent } from '@/ai/flows/transcribe-content';
import { generateContentSummary } from '@/ai/flows/generate-content-summary';
import { createMindMap } from '@/ai/flows/create-mind-map';
import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import { generateQuiz } from '@/ai/flows/generate-quiz';
import { linkRelevantYouTubeVideos } from '@/ai/flows/link-relevant-youtube-videos';
import { detectLanguage } from '@/ai/flows/detect-language';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';

import AppLogo from '@/components/app-logo';
import FileUpload from '@/components/file-upload';
import SummaryView from '@/components/features/summary-view';
import FlashcardsView from '@/components/features/flashcards-view';
import MindMapView from '@/components/features/mind-map-view';
import QuizView from '@/components/features/quiz-view';
import TranscriptionView from '@/components/features/transcription-view';
import YoutubeView from '@/components/features/youtube-view';
import NotesView from '@/components/features/notes-view';

type AppState = 'dashboard' | 'creating' | 'viewing';

export default function Home() {
  const [studyKits, setStudyKits] = useState<StudyKit[]>([]);
  const [activeKitId, setActiveKitId] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedKits = localStorage.getItem('study-kits');
      if (savedKits) {
        setStudyKits(JSON.parse(savedKits));
      }
    } catch (error) {
      console.error("Failed to load study kits from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('study-kits', JSON.stringify(studyKits));
    } catch (error) {
        console.error("Failed to save study kits to localStorage", error);
    }
  }, [studyKits]);


  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    try {
      let content = '';
      let transcription = '';

      if (file.type.startsWith('text/')) {
        content = await file.text();
        transcription = content;
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value;
        transcription = content;
      } else {
        const dataUri = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        const transcriptionResult = await transcribeContent({ mediaDataUri: dataUri });
        content = transcriptionResult.transcription;
        transcription = content;
      }

      if (!content.trim()) {
        throw new Error('Could not extract any content from the file.');
      }
      
      const { language } = await detectLanguage({ content });

      const summaryResult = await generateContentSummary({ content });
      const summary = summaryResult.summary;

      const [flashcardsResult, mindMapResult, quizResult, youtubeLinksResult] = await Promise.all([
        generateFlashcards({ content }),
        createMindMap({ content }),
        generateQuiz({ content }),
        linkRelevantYouTubeVideos({ topic: summary, language }),
      ]);
      
      const newKit: StudyKit = {
        id: Date.now().toString(),
        title: file.name,
        createdAt: new Date().toISOString(),
        summary,
        transcription,
        flashcards: flashcardsResult.flashcards,
        mindMap: mindMapResult.mindMap,
        quiz: quizResult.quiz,
        youtubeLinks: youtubeLinksResult.videoLinks,
      }
      
      const newKits = [...studyKits, newKit];
      setStudyKits(newKits);
      setActiveKitId(newKit.id);
      setAppState('viewing');

    } catch (error) {
      console.error('Processing failed:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error instanceof Error ? error.message : 'There was a problem with our AI models. Please try again.',
      });
      setAppState('creating');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteKit = (kitId: string) => {
    setStudyKits(kits => kits.filter(k => k.id !== kitId));
  }

  const activeKit = useMemo(() => studyKits.find(kit => kit.id === activeKitId), [studyKits, activeKitId]);

  if (appState === 'creating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
        <div className="absolute top-4 left-4">
            <Button variant="outline" onClick={() => setAppState('dashboard')}>Back to Dashboard</Button>
        </div>
        <div className="max-w-2xl w-full">
          <AppLogo className="mx-auto" />
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-foreground">
            Create a New Study Kit
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload your documents, images, audio, or video, and let AI transform them into a complete study kit.
          </p>
          <div className="mt-8">
            <FileUpload onProcess={handleFileProcess} isProcessing={isProcessing} />
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'viewing' && activeKit) {
    return <AppLayout 
        studyKit={activeKit} 
        onReset={() => {
            setActiveKitId(null);
            setAppState('dashboard');
        }} 
    />;
  }
  
  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-4xl">
        <div className='flex justify-between items-center mb-8'>
            <AppLogo />
            <Button onClick={() => setAppState('creating')}>
                <PlusCircle className="mr-2" />
                New Study Kit
            </Button>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-6">Your Study Kits</h1>
        {studyKits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyKits.map(kit => (
              <Card key={kit.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className='truncate'>{kit.title}</CardTitle>
                  <CardDescription>Created on {new Date(kit.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className='flex-grow'>
                    <p className='text-sm text-muted-foreground line-clamp-3'>{kit.summary}</p>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button onClick={() => {
                      setActiveKitId(kit.id);
                      setAppState('viewing');
                  }}>View Kit</Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteKit(kit.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 border-2 border-dashed rounded-lg'>
            <h2 className='text-xl font-semibold text-muted-foreground'>No study kits yet!</h2>
            <p className='text-muted-foreground mt-2'>Click "New Study Kit" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AppLayout({ studyKit, onReset }: { studyKit: StudyKit; onReset: () => void }) {
  const [activeView, setActiveView] = useState<StudyKitView>('summary');

  const menuItems = useMemo(() => [
    { id: 'summary' as StudyKitView, label: 'Summary', icon: FileText },
    { id: 'flashcards' as StudyKitView, label: 'Flashcards', icon: Layers },
    { id: 'mindmap' as StudyKitView, label: 'Mind Map', icon: GitMerge },
    { id: 'quiz' as StudyKitView, label: 'Quiz', icon: HelpCircle },
    { id: 'transcription' as StudyKitView, label: 'Transcription', icon: AlignLeft },
    { id: 'youtube' as StudyKitView, label: 'YouTube Videos', icon: Youtube },
    { id: 'notes' as StudyKitView, label: 'Notes', icon: PenLine },
  ], []);

  const MainContent = () => {
    if (activeView === 'notes') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="lg:overflow-y-auto">
            <SummaryView summary={studyKit.summary} />
          </div>
          <div className="lg:overflow-y-auto">
            <NotesView notesId={studyKit.id} />
          </div>
        </div>
      );
    }
    return (
      <>
        {activeView === 'summary' && <SummaryView summary={studyKit.summary} />}
        {activeView === 'flashcards' && <FlashcardsView flashcards={studyKit.flashcards} />}
        {activeView === 'mindmap' && <MindMapView mindMapData={studyKit.mindMap} />}
        {activeView === 'quiz' && <QuizView quiz={studyKit.quiz} />}
        {activeView === 'transcription' && <TranscriptionView transcription={studyKit.transcription} />}
        {activeView === 'youtube' && <YoutubeView videoLinks={studyKit.youtubeLinks} />}
      </>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="bg-sidebar">
          <SidebarHeader>
            <AppLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    tooltip={{ children: item.label, side: 'right' }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" onClick={onReset} className="w-full justify-start">
              <LoaderCircle className="mr-2 h-4 w-4" /> Back to Kits
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <SidebarTrigger>
                    <SidebarTrigger />
                </SidebarTrigger>
                <h2 className="text-xl font-semibold capitalize">
                  {menuItems.find(item => item.id === activeView)?.label}
                </h2>
            </div>
            <p className='text-sm text-muted-foreground truncate max-w-xs' title={studyKit.title}>{studyKit.title}</p>
          </div>
          <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-auto">
            <MainContent />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
