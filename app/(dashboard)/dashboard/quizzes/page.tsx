"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Play, CheckCircle2, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockQuizzes = [
  { id: "1", title: "Biology Chapter 1: Cell Structure", questions: 15, score: "12/15", status: "Completed", document: "Biology_Chapter_1.pdf" },
  { id: "2", title: "History Notes: WWII", questions: 20, score: "18/20", status: "Completed", document: "History_Notes.docx" },
  { id: "3", title: "Physics Formulas: Kinematics", questions: 10, score: "-", status: "Pending", document: "Physics_Formulas.txt" },
];

export default function QuizzesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
          <p className="text-muted-foreground">
            Test your knowledge. Generate quizzes automatically from your documents.
          </p>
        </div>

        <Dialog>
          <DialogTrigger className={cn(buttonVariants(), "bg-orange-500 hover:bg-orange-600 text-white")}>
            <BrainCircuit className="mr-2 h-4 w-4" />
            Generate Quiz
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate New Quiz</DialogTitle>
              <DialogDescription>
                Select a document and let AI create a practice quiz for you.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="document">Select Document</Label>
                <select id="document" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="1">Biology_Chapter_1.pdf</option>
                  <option value="2">History_Notes.docx</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Quiz Type</Label>
                <select id="type" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="mcq">Multiple Choice</option>
                  <option value="tf">True / False</option>
                  <option value="flashcards">Flashcards</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select id="difficulty" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Generate with AI</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockQuizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="truncate">{quiz.document}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-medium">{quiz.questions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium flex items-center gap-1 ${quiz.status === "Completed" ? "text-emerald-500" : "text-amber-500"}`}>
                    {quiz.status === "Completed" ? <CheckCircle2 className="h-3 w-3" /> : null}
                    {quiz.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-medium">{quiz.score}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full py-3" variant={quiz.status === "Completed" ? "outline" : "default"}>
                <Link href={`/dashboard/quizzes/${quiz.id}`} className="flex ">
                  <Play className="mr-2 h-4 w-4" />
                  {quiz.status === "Completed" ? "Review Quiz" : "Start Quiz"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
