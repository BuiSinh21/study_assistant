import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_KEY || "";
export const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const getGeminiResponse = async (prompt: string, context?: string) => {
  try {
    const fullPrompt = context
      ? `Context: ${context}\n\nQuestion/Task: ${prompt}`
      : prompt;

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
