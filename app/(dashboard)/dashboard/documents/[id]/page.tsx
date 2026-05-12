"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Send, Bot, User, FileText, Sparkles, BrainCircuit, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@/types";

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const [textContent, setTextContent] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const docxRef = useRef<HTMLDivElement>(null);

  const { data: docData, isLoading: loading, error } = useQuery<Document>({
    queryKey: ["document", id],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error("Failed to fetch document");
      return res.json();
    },
    enabled: !!id,
  });


  useEffect(() => {
    if (!docData) return;

    const isDocx = docData.fileType?.toLowerCase() === "docx" || docData.fileUrl.toLowerCase().endsWith(".docx");
    const isTxt = docData.fileType?.toLowerCase() === "txt" || docData.fileUrl.toLowerCase().endsWith(".txt");

    if (isDocx && docxRef.current) {
      const renderDocx = async () => {
        try {
          setPreviewLoading(true);
          const response = await fetch(docData.fileUrl);
          const arrayBuffer = await response.arrayBuffer();

          const docx = await import("docx-preview");
          if (docxRef.current) {
            docxRef.current.innerHTML = "";
            await docx.renderAsync(arrayBuffer, docxRef.current, undefined, {
              className: "docx-preview",
              inWrapper: false,
              ignoreWidth: false,
              ignoreHeight: false,
            });
          }
        } catch (err) {
          console.error("Error rendering docx:", err);
        } finally {
          setPreviewLoading(false);
        }
      };
      renderDocx();
    } else if (isTxt) {
      const fetchTxt = async () => {
        try {
          setPreviewLoading(true);
          const response = await fetch(docData.fileUrl);
          const text = await response.text();
          setTextContent(text);
        } catch (err) {
          console.error("Error fetching txt:", err);
        } finally {
          setPreviewLoading(false);
        }
      };
      fetchTxt();
    }
  }, [docData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading document...</p>
      </div>
    );
  }

  if (error || !docData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-red-500 font-medium">{error?.message || "Document not found"}</p>
        <Link href="/dashboard/documents" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
          Back to Documents
        </Link>
      </div>
    );
  }

  const isPDF = docData.fileType?.toLowerCase() === "pdf" || docData.fileUrl.toLowerCase().endsWith(".pdf");
  const isDocx = docData.fileType?.toLowerCase() === "docx" || docData.fileUrl.toLowerCase().endsWith(".docx");
  const isTxt = docData.fileType?.toLowerCase() === "txt" || docData.fileUrl.toLowerCase().endsWith(".txt");

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
            {docData.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            Uploaded on {new Date(docData.createdAt).toLocaleDateString()} • {docData.fileSize}
          </p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Document Viewer */}
        <div className="w-1/2 border-r bg-muted/20 flex flex-col overflow-hidden relative">

          <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-zinc-900 h-full">
            {isPDF ? (
              <iframe
                src={`${docData.fileUrl}#toolbar=0&navpanes=0&view=FitH&zoom=100`}
                className="w-full h-full border-none"
                title={docData.title}
                loading="lazy"
              />
            ) : isDocx ? (
              <div className="relative min-h-full">
                {previewLoading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
                    <p className="text-sm text-muted-foreground animate-pulse">Rendering document...</p>
                  </div>
                )}
                <div ref={docxRef} className="p-4 md:p-8" />
              </div>
            ) : isTxt ? (
              <div className="relative min-h-full">
                {previewLoading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
                    <p className="text-sm text-muted-foreground animate-pulse">Reading file...</p>
                  </div>
                )}
                <div className="p-8">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {textContent}
                  </pre>
                </div>
              </div>
            ) : previewLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
                <p className="text-muted-foreground animate-pulse">Preparing preview...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">Preview not available</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2">
                  We cannot preview this file type yet. You can still use the AI tools on the right.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.open(docData.fileUrl, "_blank")}
                >
                  Download {docData.fileType} File
                </Button>
              </div>
            )}
          </div>

          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e2e8f0;
              border-radius: 10px;
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #334155;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #cbd5e1;
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #475569;
            }
            /* Styling for docx-preview elements */
            .docx-preview {
              background: white !important;
              box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
              margin: 0 auto !important;
              padding: 40px !important;
              min-height: auto !important;
              width: 100% !important;
              max-width: 800px !important;
            }
            .dark .docx-preview {
              background: #f8fafc !important;
              color: black !important;
            }
          `}</style>
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
            <TabsContent value="chat" className="flex-1 flex flex-col mt-0 border-none outline-none overflow-hidden">
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
                        <p>Hi! I'm ready to help you study <strong>{docData.title}</strong>. What would you like to know?</p>
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
              </div>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="prose dark:prose-invert max-w-none">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="m-0 text-indigo-600">AI Generated Summary</h3>
                </div>
                <p className="text-muted-foreground">Click the button below to generate a summary of this document.</p>
              </div>
              <Button className="mt-6 w-full" variant="outline">Generate Summary</Button>
            </TabsContent>

            {/* Flashcards Tab */}
            <TabsContent value="flashcards" className="flex-1 flex flex-col items-center justify-center p-6 mt-0">
              <div className="text-center mb-8">
                <BrainCircuit className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Ready to test your knowledge?</h3>
                <p className="text-muted-foreground mt-2">Generate flashcards based on the contents of this document.</p>
              </div>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Generate Flashcards
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
