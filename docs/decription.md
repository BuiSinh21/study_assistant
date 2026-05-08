# 📘 AI Study Assistant

## 🚀 Giới thiệu

AI Study Assistant là một nền tảng web hỗ trợ học tập thông minh, cho phép người dùng tải lên tài liệu và tương tác với AI để:
- Tóm tắt nội dung
- Giải thích kiến thức
- Tạo quiz tự động
- Chat với tài liệu
- Theo dõi tiến trình học tập

Dự án tập trung vào:
- Frontend architecture (React/Next.js)
- AI integration (OpenAI)
- Xử lý dữ liệu thực tế
- UX giống sản phẩm thật

---

## ✨ Features

### 🔐 Authentication
- Đăng ký / đăng nhập
- Google OAuth
- Session management

---

### 📂 Document Management
- Upload file (PDF, DOCX, TXT)
- Parse nội dung tài liệu
- Lưu trữ và quản lý tài liệu
- Rename / Delete document

---

### 🤖 AI Summary
- Tóm tắt toàn bộ tài liệu
- Tóm tắt theo section
- Highlight ý chính

---

### 💬 AI Chat with Document
- Chat theo nội dung tài liệu
- Context-aware (AI hiểu file)
- Lưu lịch sử hội thoại
- Streaming response (hiển thị text realtime)

---

### 🧠 AI Quiz Generator
- Multiple choice
- True/False
- Flashcards
- Chọn độ khó
- Làm bài trực tiếp trên UI

---

### 📊 Learning Dashboard
- Danh sách tài liệu
- Lịch sử học tập
- Quiz đã làm
- Progress tracking

---

### 🎨 UI/UX
- Responsive
- Dark mode
- Loading skeleton
- Error handling
- Markdown rendering (AI response)

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- TanStack Query
- TailwindCSS
- shadcn/ui
- React Hook Form

---

### Backend
- Next.js API Routes

---

### Database & Auth
- Supabase
  - PostgreSQL
  - Authentication (JWT)
  - Storage (file upload)

---

### AI
- OpenAI API
- Streaming response
- Prompt engineering
- Context handling

---

### File Processing
- PDF parsing
- Text extraction
- Content chunking

---

### Deployment
- Frontend: Vercel
- Backend/API: Vercel
- Database: Supabase

---

## 🏗️ System Architecture

### Upload Flow
1. User upload file
2. File lưu vào storage
3. Backend parse nội dung
4. Chia nhỏ thành chunks
5. Lưu vào database

---

### Chat Flow (RAG cơ bản)
1. User gửi câu hỏi
2. Backend:
   - tìm nội dung liên quan
   - build prompt
3. Gửi OpenAI API
4. Stream response về frontend

---

## 🗄️ Database Schema

### users
- id
- email
- created_at

---

### documents
- id
- user_id
- title
- file_url
- created_at

---

### document_chunks
- id
- document_id
- content

---

### conversations
- id
- user_id
- document_id

---

### messages
- id
- conversation_id
- role (user/assistant)
- content

---

### quizzes
- id
- document_id
- type
- difficulty

---

## 📁 Folder Structure
