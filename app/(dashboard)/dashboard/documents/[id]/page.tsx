"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Send, Bot, User, FileText, Sparkles, BrainCircuit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DocumentDetailsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-4">
      {/* Header */}
      <div className="flex items-center gap-4 border-b p-4">
        <Link href="/dashboard/documents" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            Biology_Chapter_1.pdf
          </h2>
          <p className="text-xs text-muted-foreground">Uploaded on May 08, 2026 • 2.4 MB</p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Document Viewer */}
        <div className="w-1/2 border-r bg-muted/20 flex flex-col p-4 overflow-y-auto">
          <div className="flex-1 bg-background border rounded-lg shadow-sm p-8 max-w-3xl mx-auto w-full prose dark:prose-invert">
            <h2>1. Introduction to Cell Structure</h2>
            <p>
              The cell is the basic structural, functional, and biological unit of all known organisms. 
              A cell is the smallest unit of life. Cells are often called the "building blocks of life".
            </p>
            <h3>1.1 Prokaryotic vs Eukaryotic</h3>
            <p>
              Prokaryotic cells do not have a true nucleus, meaning their DNA is not enclosed within a membrane. 
              Eukaryotic cells contain membrane-bound organelles, such as the nucleus, mitochondria, and chloroplasts.
            </p>
            <div className="h-40 bg-muted rounded flex items-center justify-center my-4">
              [Image: Cell Diagram]
            </div>
            <p>
              In multicellular organisms, cells specialize to perform specific functions. A group of cells working together forms a tissue.
            </p>
            {/* Mock long content */}
            {Array.from({ length: 5 }).map((_, i) => (
              <p key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            ))}
          </div>
        </div>

        {/* Right: AI Tools */}
        <div className="w-1/2 flex flex-col bg-background">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <div className="px-4 pt-2 border-b">
              <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger 
                  value="chat" 
                  className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="summary"
                  className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="flashcards"
                  className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-indigo-500 data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Flashcards
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col mt-0 border-none outline-none">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {/* AI Message */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-8 h-8 border bg-indigo-500/10">
                      <AvatarFallback className="bg-transparent text-indigo-500"><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-semibold text-sm">Study Assistant</div>
                      <div className="prose prose-sm dark:prose-invert">
                        <p>Hi! I'm ready to help you study <strong>Biology_Chapter_1.pdf</strong>. What would you like to know?</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Message */}
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 text-right">
                      <div className="font-semibold text-sm">You</div>
                      <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[80%] inline-block">
                        What is the main difference between prokaryotic and eukaryotic cells?
                      </div>
                    </div>
                  </div>

                  {/* AI Message */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-8 h-8 border bg-indigo-500/10">
                      <AvatarFallback className="bg-transparent text-indigo-500"><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-semibold text-sm">Study Assistant</div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                        Based on the document, the main difference is:
                        <ul className="list-disc ml-4 mt-2 space-y-1">
                          <li><strong>Prokaryotic cells</strong> do not have a true nucleus, meaning their DNA is not enclosed within a membrane.</li>
                          <li><strong>Eukaryotic cells</strong> contain membrane-bound organelles, such as the nucleus, mitochondria, and chloroplasts.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t bg-background">
                <div className="relative flex items-center">
                  <Textarea 
                    placeholder="Ask a question about this document..." 
                    className="min-h-[60px] resize-none pr-12 rounded-xl"
                  />
                  <Button size="icon" className="absolute right-2 bottom-2 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">Try asking:</span>
                  <button className="text-xs text-indigo-500 hover:underline">Summarize section 1.1</button>
                  <button className="text-xs text-indigo-500 hover:underline">What are tissues?</button>
                </div>
              </div>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="prose dark:prose-invert max-w-none">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="m-0 text-indigo-600">AI Generated Summary</h3>
                </div>
                <p>
                  This chapter introduces the fundamental concepts of cell structure. It defines the cell as the basic structural, functional, and biological unit of all known organisms.
                </p>
                <h4>Key Takeaways:</h4>
                <ul>
                  <li>Cells are the smallest unit of life.</li>
                  <li>There are two main types of cells: Prokaryotic and Eukaryotic.</li>
                  <li>Prokaryotic cells lack a nucleus and membrane-bound organelles.</li>
                  <li>Eukaryotic cells contain a nucleus and organelles like mitochondria.</li>
                  <li>In complex organisms, cells form tissues to perform specific functions.</li>
                </ul>
              </div>
              <Button className="mt-6 w-full" variant="outline">Regenerate Summary</Button>
            </TabsContent>

            {/* Flashcards Tab */}
            <TabsContent value="flashcards" className="flex-1 flex flex-col items-center justify-center p-6 mt-0">
              <div className="text-center mb-8">
                <BrainCircuit className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Ready to test your knowledge?</h3>
                <p className="text-muted-foreground mt-2">Generate flashcards based on the contents of this document.</p>
              </div>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Generate 10 Flashcards
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
