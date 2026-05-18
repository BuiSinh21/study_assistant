"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useQueryClient } from "@tanstack/react-query";
interface AIChatProps {
  docId: string;
  docTitle: string;
  initialMessages?: { role: string; content: string }[];
  initialConversationId?: string | null;
}
export function AIChat({
  docId,
  docTitle,
  initialMessages = [],
  initialConversationId = null
}: AIChatProps) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatting]);

  const handleChat = async () => {
    if (!inputMessage.trim() || isChatting) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsChatting(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: docId,
          action: "chat",
          message: inputMessage,
          conversationId: conversationId,
        }),
      });

      const data = await res.json();
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        queryClient.invalidateQueries({ queryKey: ["document", docId] });
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar w-full min-h-0">
        <div className="p-4 space-y-6 max-w-4xl mx-auto w-full">
          {/* Initial AI Message */}
          <div className="flex items-start gap-3 w-full">
            <Avatar className="w-8 h-8 border bg-indigo-500/10 shrink-0">
              <AvatarFallback className="bg-transparent text-indigo-500">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid gap-1 min-w-0">
              <div className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Study Assistant</div>
              <div className="bg-muted/40 p-4 rounded-2xl rounded-tl-none border border-border/40 shadow-sm">
                <p className="text-sm m-0 leading-relaxed text-foreground">Hi! I'm ready to help you study <strong>{docTitle}</strong>. What would you like to know?</p>
              </div>
            </div>
          </div>

          {/* Chat History */}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex items-start gap-3 w-full", m.role === "user" ? "flex-row-reverse" : "")}>
              <Avatar className={cn("w-8 h-8 border shrink-0", m.role === "user" ? "bg-indigo-600 shadow-sm" : "bg-indigo-500/10")}>
                <AvatarFallback className={cn("bg-transparent", m.role === "user" ? "text-white" : "text-indigo-500")}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={cn("flex-1 grid gap-1 max-w-[85%] min-w-0", m.role === "user" ? "items-end" : "items-start")}>
                <div className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground px-1">
                  {m.role === "user" ? "You" : "Study Assistant"}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl border shadow-sm w-full",
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none border-indigo-500"
                    : "bg-muted/80 rounded-tl-none border-border/40 text-foreground"
                )}>
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap m-0 text-sm leading-relaxed break-words">{m.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-3 prose-headings:mt-5 prose-headings:mb-2 prose-headings:text-foreground prose-headings:text-base prose-headings:font-bold overflow-hidden break-words prose-li:my-1 prose-ul:my-2">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isChatting && (
            <div className="flex items-start gap-3 w-full">
              <Avatar className="w-8 h-8 border bg-indigo-500/10 shrink-0">
                <AvatarFallback className="bg-transparent text-indigo-500">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/40 p-4 rounded-2xl rounded-tl-none border border-border/40 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background shrink-0">
        <form
          className="relative flex items-center max-w-4xl mx-auto w-full"
          onSubmit={(e) => { e.preventDefault(); handleChat(); }}
        >
          <Textarea
            placeholder="Ask a question..."
            className="min-h-[52px] max-h-[150px] py-3 resize-none pr-12 rounded-xl bg-muted/30 border-border/60 focus-visible:ring-indigo-500/50 shadow-inner custom-scrollbar"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChat();
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isChatting || !inputMessage.trim()}
            className="absolute right-2 bottom-2 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-lg transition-all active:scale-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
