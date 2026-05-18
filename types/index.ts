export interface Document {
  id: string;
  userId: string;
  title: string;
  fileUrl: string;
  fileSize: string | null;
  fileType: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  summary: string | null;
  conversations?: Conversation[];
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
}

export interface Conversation {
  id: string;
  userId: string;
  documentId: string;
  createdAt: string | Date;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string | Date;
}
