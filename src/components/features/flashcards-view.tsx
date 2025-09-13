'use client';

import React, { useState } from 'react';
import type { Flashcard } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface FlashcardsViewProps {
  flashcards: Flashcard[];
}

function FlashcardItem({ flashcard }: { flashcard: Flashcard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="p-1 md:p-6 flex items-center justify-center h-full">
      <div className="w-full h-[30rem] perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
        <Card
          className={cn(
            'w-full h-full relative transition-transform duration-700 transform-style-preserve-3d cursor-pointer flex flex-col',
            { 'rotate-y-180': isFlipped }
          )}
        >
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6">
            <CardContent className="text-center flex-grow flex items-center justify-center pt-6">
              <h3 className="text-3xl font-semibold">{flashcard.term}</h3>
            </CardContent>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-secondary">
            <CardContent className="flex-grow flex items-center justify-center pt-6">
              <p className="text-xl text-muted-foreground text-center">{flashcard.definition}</p>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function FlashcardsView({ flashcards }: FlashcardsViewProps) {
    if (!flashcards || flashcards.length === 0) {
        return (
          <div className="text-center text-muted-foreground">
            <p>No flashcards were generated for this content.</p>
          </div>
        );
      }
      
  return (
    <Carousel className="w-full">
        <CarouselContent>
            {flashcards.map((flashcard, index) => (
                <CarouselItem key={index}>
                    <FlashcardItem flashcard={flashcard} />
                </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="ml-8" />
        <CarouselNext className="mr-8" />
    </Carousel>
  );
}

// Add some CSS for the 3D flip effect
const styles = `
.perspective-1000 { perspective: 1000px; }
.transform-style-preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
`;
const styleSheet = typeof window !== 'undefined' ? document.createElement("style") : null;
if (styleSheet) {
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
