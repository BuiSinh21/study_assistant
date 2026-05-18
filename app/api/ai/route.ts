import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"
import { genAI, geminiModel } from "@/lib/gemini"
import mammoth from "mammoth"
// --- 1. POLYFILLS (Must be before require pdf-parse) ---
if (typeof global.DOMMatrix === 'undefined') {
  (global as any).DOMMatrix = class DOMMatrix { constructor() { } };
}
if (typeof global.ImageData === 'undefined') {
  (global as any).ImageData = class ImageData { constructor() { } };
}
if (typeof global.Path2D === 'undefined') {
  (global as any).Path2D = class Path2D { constructor() { } };
}

export const runtime = "nodejs"
const SmartParser = require("pdf-parse-new/lib/SmartPDFParser");

export async function POST(req: NextRequest) {
  try {

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json();
    const { documentId, action, message, history = [] } = body;
    console.log(`[AI_API] Start - Action: ${action}, Document: ${documentId}`);

    if (!documentId || !action) {
      return NextResponse.json({ error: "Missing documentId or action" }, { status: 400 })
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId, userId: session.user.id },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // 2. Extract text (only if not already cached)
    let textContent = document.extractedText || "";

    if (textContent) {
      console.log(`[AI_API] Using cached text for ${document.fileType} (Length: ${textContent.length})`);
    } else {
      console.log(`[AI_API] No cached text found. Extracting from ${document.fileType}...`);
      let buffer: Buffer;
      try {
        const fileResponse = await fetch(document.fileUrl);
        if (!fileResponse.ok) throw new Error("Failed to download file.");
        buffer = Buffer.from(await fileResponse.arrayBuffer());
      } catch (e: any) {
        return NextResponse.json({ error: `Failed to download file: ${e.message}` }, { status: 500 });
      }

      try {
        const type = document.fileType?.toLowerCase() || "";
        if (type.includes("pdf")) {
          const parser = new SmartParser();
          const result = await parser.parse(buffer);
          textContent = result.text;
        } else if (type.includes("docx")) {
          const result = await mammoth.extractRawText({ buffer });
          textContent = result.value;
        } else {
          textContent = buffer.toString("utf-8");
        }

        if (!textContent || textContent.trim().length === 0) {
          throw new Error("Extracted text is empty.");
        }

        // Cache the extracted text in DB
        await prisma.document.update({
          where: { id: documentId },
          data: { extractedText: textContent }
        });
      } catch (e: any) {
        console.error("[AI_API] Extraction failed:", e);
        return NextResponse.json({ error: `Failed to read document: ${e.message}` }, { status: 500 });
      }
    }

    // 3. Handle Conversation & History
    let currentConvId = body.conversationId;

    if (!currentConvId) {
      const existingConv = await prisma.conversation.findFirst({
        where: { userId: session.user.id, documentId: documentId }
      });
      if (existingConv) {
        currentConvId = existingConv.id;
      } else {
        const newConv = await prisma.conversation.create({
          data: { userId: session.user.id, documentId: documentId }
        });
        currentConvId = newConv.id;
      }
    }

    if (action === "chat") {
      await prisma.message.create({
        data: {
          conversationId: currentConvId,
          role: "user",
          content: message
        }
      });
    }

    const dbMessages = await prisma.message.findMany({
      where: { conversationId: currentConvId },
      orderBy: { createdAt: 'asc' }
    });

    // 4. Prepare AI with System Instruction
    const truncatedContent = textContent.slice(0, 500000);

    const chatModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a professional study assistant. 
      Analyze the following document and answer questions accurately:
      ---
      TITLE: ${document.title}
      CONTENT: ${truncatedContent}
      ---
      
      CRITICAL FORMATTING RULES:
      1. Use clear, descriptive headings with "###" for each main section.
      2. Use "**bold text**" for key terms, metrics, or important actions.
      3. Always use DOUBLE LINE BREAKS between paragraphs and sections to ensure a clean look.
      4. Use bullet points or numbered lists whenever possible instead of long paragraphs.
      5. Keep sentences concise and easy to scan.
      6. Use "---" (horizontal rules) to separate completely different topics if needed.
      
      Your goal is to make the information as readable and professional as possible.`
    });

    let prompt = "";
    if (action === "chat") {
      prompt = message;
    } else if (action === "summary") {
      prompt = "Provide a comprehensive and clear summary of this document. Use markdown for better formatting.";
    } else if (action === "flashcards") {
      prompt = "Generate 5-10 study flashcards based on this document. Return ONLY a JSON array: [{\"question\": \"...\", \"answer\": \"...\"}]";
    }

    try {
      const historyForGemini = dbMessages
        .filter(m => m.content !== message || m.role !== "user")
        .map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      const chatSession = chatModel.startChat({
        history: historyForGemini,
      });

      const result = await chatSession.sendMessage(prompt);
      let responseText = result.response.text();

      if (action === "chat") {
        await prisma.message.create({
          data: {
            conversationId: currentConvId,
            role: "assistant",
            content: responseText
          }
        });
      }

      if (action === "summary") {
        await prisma.document.update({
          where: { id: documentId },
          data: { summary: responseText }
        });
      }

      if (action === "flashcards") {
        try {
          const jsonStr = responseText.match(/\[[\s\S]*\]/)?.[0] || responseText;
          return NextResponse.json({ response: JSON.parse(jsonStr) });
        } catch (e) {
          return NextResponse.json({ response: responseText });
        }
      }

      return NextResponse.json({
        response: responseText,
        conversationId: currentConvId
      });
    } catch (geminiError: any) {
      console.error("[AI_API] Gemini Error:", geminiError);
      return NextResponse.json({ error: `AI Error: ${geminiError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[AI_API] Global Catch:", error);
    return NextResponse.json({ error: "A fatal error occurred on the server." }, { status: 500 });
  }
}
