'use client';

import React, { useState } from 'react';
import type { QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface QuizViewProps {
  quiz: QuizQuestion[];
}

export default function QuizView({ quiz }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(quiz.length).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = value;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };
  
  const handleRetake = () => {
    setUserAnswers(Array(quiz.length).fill(''));
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  }

  const score = userAnswers.reduce((acc, answer, index) => {
    return answer === quiz[index].correctAnswer ? acc + 1 : acc;
  }, 0);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No quiz was generated for this content.</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>You scored {score} out of {quiz.length}!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {quiz.map((q, index) => (
              <div key={index}>
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <p className={cn("text-sm mt-2", userAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600')}>
                  Your answer: {userAnswers[index] || 'Not answered'}
                </p>
                {userAnswers[index] !== q.correctAnswer && (
                  <p className="text-sm text-green-600">Correct answer: {q.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleRetake}>Retake Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Time!</CardTitle>
        <div className='pt-2'>
            <Progress value={progress} />
            <p className='text-sm text-muted-foreground mt-2'>Question {currentQuestionIndex + 1} of {quiz.length}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg font-semibold">{currentQuestion.question}</p>
          <RadioGroup value={userAnswers[currentQuestionIndex]} onValueChange={handleAnswerChange}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                <Label htmlFor={`q${currentQuestionIndex}-o${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        {currentQuestionIndex === quiz.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!userAnswers[currentQuestionIndex]}>Submit</Button>
        ) : (
          <Button onClick={handleNext} disabled={!userAnswers[currentQuestionIndex]}>Next</Button>
        )}
      </CardFooter>
    </Card>
  );
}
