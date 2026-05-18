"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";

interface DocumentViewerProps {
  docData: Document;
}

export function DocumentViewer({ docData }: DocumentViewerProps) {
  const [previewLoading, setPreviewLoading] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const docxRef = useRef<HTMLDivElement>(null);

  const isPDF = docData.fileType?.toLowerCase() === "pdf" || docData.fileUrl.toLowerCase().endsWith(".pdf");
  const isDocx = docData.fileType?.toLowerCase() === "docx" || docData.fileUrl.toLowerCase().endsWith(".docx");
  const isTxt = docData.fileType?.toLowerCase() === "txt" || docData.fileUrl.toLowerCase().endsWith(".txt");

  useEffect(() => {
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
  }, [docData, isDocx, isTxt]);

  return (
    <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-zinc-900 h-full relative">
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
  );
}
