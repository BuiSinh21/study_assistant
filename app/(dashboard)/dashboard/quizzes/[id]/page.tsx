"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const mockQuestions = [
  {
    id: 1,
    question: "What is the main function of the mitochondria?",
    options: [
      { id: "a", text: "Protein synthesis" },
      { id: "b", text: "Cellular respiration and energy production" },
      { id: "c", text: "Storage of genetic material" },
      { id: "d", text: "Photosynthesis" },
    ],
    answer: "b",
  },
  {
    id: 2,
    question: "Which of the following is found in plant cells but NOT in animal cells?",
    options: [
      { id: "a", text: "Nucleus" },
      { id: "b", text: "Cell membrane" },
      { id: "c", text: "Chloroplast" },
      { id: "d", text: "Ribosome" },
    ],
    answer: "c",
  },
  {
    id: 3,
    question: "Prokaryotic cells lack a true nucleus.",
    options: [
      { id: "a", text: "True" },
      { id: "b", text: "False" },
    ],
    answer: "a",
  },
];

export default function QuizTakingPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / mockQuestions.length) * 100;

  const handleNext = () => {
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <CheckCircle2 className="h-20 w-20 text-emerald-500" />
        <h2 className="text-4xl font-bold">Quiz Completed!</h2>
        <p className="text-xl text-muted-foreground">
          You scored <span className="font-bold text-foreground">{score}</span> out of {mockQuestions.length}
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/quizzes" className={buttonVariants({ variant: "outline" })}>
            Back to Quizzes
          </Link>
          <Button onClick={() => {
            setIsFinished(false);
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
          }}>Retake Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/quizzes" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold">Biology Chapter 1: Cell Structure</h2>
          <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {mockQuestions.length}</p>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="mt-8 border-2">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl leading-normal font-medium">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswer || ""} 
            onValueChange={setSelectedAnswer}
            className="space-y-4"
          >
            {currentQuestion.options.map((option) => (
              <div 
                key={option.id} 
                className={`flex items-center space-x-3 border p-4 rounded-xl transition-colors ${selectedAnswer === option.id ? 'border-indigo-500 bg-indigo-500/5' : 'hover:bg-muted/50'}`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer text-base">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="pt-6 flex justify-between border-t mt-4 bg-muted/20">
          <Button variant="ghost" disabled={currentQuestionIndex === 0} onClick={() => {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedAnswer(null);
          }}>
            Previous
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white" 
            disabled={!selectedAnswer}
            onClick={handleNext}
          >
            {currentQuestionIndex === mockQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
