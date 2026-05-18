"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Loader2, AlertCircle, Sparkles, BrainCircuit } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentViewer } from "@/components/document/document-viewer";
import { AIChat } from "@/components/document/ai-chat";
import { AISummary } from "@/components/document/ai-summary";
import { AIFlashcards } from "@/components/document/ai-flashcards";
import { Document } from "@/types";

export default function DocumentDetailsPage() {
  const { id } = useParams();

  const { data: docData, isLoading: loading, error } = useQuery<Document>({
    queryKey: ["document", id],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) throw new Error("Failed to fetch document");
      return res.json();
    },
    enabled: !!id,
  });
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
        <p className="text-red-500 font-medium">{(error as any)?.message || "Document not found"}</p>
        <Link href="/dashboard/documents" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
          Back to Documents
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -m-4">
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

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r bg-muted/20 flex flex-col overflow-hidden relative">
          <DocumentViewer docData={docData} />
        </div>

        <div className="w-1/2 flex flex-col bg-background overflow-hidden min-h-0">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-2 border-b shrink-0">
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

            <TabsContent
              value="chat"
              className="flex-1 h-full overflow-hidden mt-0 min-h-0 data-[state=active]:flex-1 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <AIChat
                docId={docData.id}
                docTitle={docData.title}
                initialMessages={docData.conversations?.[0]?.messages || []}
                initialConversationId={docData.conversations?.[0]?.id || null}
              />
            </TabsContent>
            <TabsContent
              value="summary"
              className="flex-1 h-full overflow-hidden mt-0 min-h-0 data-[state=active]:flex-1 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <AISummary docId={docData.id} initialSummary={docData.summary} />
            </TabsContent>
            <TabsContent
              value="flashcards"
              className="flex-1 h-full overflow-hidden mt-0 min-h-0 data-[state=active]:flex-1 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <AIFlashcards docId={docData.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
