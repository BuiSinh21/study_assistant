"use client";

import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIFlashcardsProps {
  docId: string;
}

export function AIFlashcards({ docId }: AIFlashcardsProps) {
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFlashcards = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, action: "flashcards" }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await res.json();
      if (data.response) {
        // Find JSON in the response if Gemini included markdown
        const jsonStr = data.response.match(/\[[\s\S]*\]/)?.[0] || data.response;
        try {
          const parsed = JSON.parse(jsonStr);
          setFlashcards(parsed);
        } catch (e) {
          console.error("Failed to parse flashcards JSON:", e);
          alert("Failed to parse flashcards. Please try again.");
        }
      }
    } catch (error) {
      console.error("Flashcards error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {flashcards.length > 0 ? (
        <div className="flex-1">
          <div className="grid gap-4 p-1">
            {flashcards.map((card, i) => (
              <div key={i} className="group perspective-1000 h-40">
                <div className="relative w-full h-full text-center transition-transform duration-500 preserve-3d group-hover:rotate-y-180">
                  <div className="absolute w-full h-full backface-hidden bg-card border rounded-2xl flex items-center justify-center p-4">
                    <p className="font-medium">{card.question}</p>
                  </div>
                  <div className="absolute w-full h-full backface-hidden bg-indigo-600 text-white rounded-2xl flex items-center justify-center p-4 rotate-y-180">
                    <p className="text-sm">{card.answer}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => setFlashcards([])} className="mt-4">
              Clear Flashcards
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <BrainCircuit className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold">Test Your Knowledge</h3>
          <p className="text-muted-foreground mt-2 mb-8">Generate flashcards based on this document.</p>
          <Button
            size="lg"
            onClick={generateFlashcards}
            disabled={isGenerating}
            className="bg-orange-500 hover:bg-orange-600 text-white px-10"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              "Generate Flashcards"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
