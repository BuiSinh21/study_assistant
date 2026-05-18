"use client";

import { useState } from "react";
import { Sparkles, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AISummaryProps {
  docId: string;
  initialSummary?: string | null;
}

import { useQueryClient } from "@tanstack/react-query";

export function AISummary({ docId, initialSummary }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(initialSummary || null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const queryClient = useQueryClient();

  const generateSummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, action: "summary" }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to generate summary" }));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.response) {
        setSummary(data.response);
        // Làm mới dữ liệu document trong cache để các tab khác (và khi quay lại tab này) đều thấy summary mới
        queryClient.invalidateQueries({ queryKey: ["document", docId] });
      }
    } catch (error: any) {
      console.error("Summary error:", error);
      alert(error.message || "An error occurred while generating the summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 pb-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles className="h-5 w-5" />
          <h3 className="m-0 font-bold text-lg">Document Summary</h3>
        </div>
        {/* {summary && (
          <Button
            variant="ghost"
            size="sm"
            onClick={generateSummary}
            disabled={isSummarizing}
            className="text-xs h-8"
          >
            {isSummarizing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
            Regenerate
          </Button>
        )} */}
      </div>

      <div className="flex-1 w-full">
        <div className="p-6">
          {summary ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="bg-indigo-500/5 p-6 rounded-2xl border  custom-scrollbar overflow-auto max-h-[calc(100vh-320px)] border-indigo-100 dark:border-indigo-900/30">
                <div className="text-sm leading-relaxed text-foreground/90 markdown-content prose-p:leading-relaxed prose-li:my-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summary}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">No Summary Yet</h4>
              <p className="text-muted-foreground text-sm max-w-[250px] mb-8">
                Generate an AI summary to quickly understand the key points of this document.
              </p>
              <Button
                onClick={generateSummary}
                disabled={isSummarizing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-xl"
              >
                {isSummarizing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  "Generate Summary"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
