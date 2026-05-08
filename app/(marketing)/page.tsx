import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BrainCircuit, FileText, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 flex items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
        
        <div className="container px-4 md:px-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              ✨ Introducing AI Study Assistant
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              Master your materials with <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">
                intelligent learning
              </span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Upload your documents and let our AI summarize, explain, and test your knowledge. Study smarter, not harder.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8")}>
                Start Learning
              </Link>
              <Link href="#features" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full px-8")}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 bg-muted/50 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Supercharge your studies</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to digest information faster and retain it longer.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 bg-background p-6 rounded-2xl shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">Smart Summaries</h3>
              <p className="text-muted-foreground">
                Instantly generate concise summaries of long PDFs, DOCX, or TXT files. Highlight key concepts effortlessly.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4 bg-background p-6 rounded-2xl shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">Chat with Documents</h3>
              <p className="text-muted-foreground">
                Ask questions and get answers directly extracted from your study materials with contextual understanding.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4 bg-background p-6 rounded-2xl shadow-sm border">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">AI Quizzes</h3>
              <p className="text-muted-foreground">
                Automatically generate practice tests, flashcards, and multiple-choice questions to test your knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
