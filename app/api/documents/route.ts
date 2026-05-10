import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const BUCKET_NAME = "documents"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(documents)
  } catch (error: any) {
    console.error("[DOCUMENTS] GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOCX, and TXT are allowed." },
        { status: 400 }
      )
    }

    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const uniqueName = `${session.user.id}/${Date.now()}-${file.name}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log(11111);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("[DOCUMENTS] Supabase upload error:", uploadError)
      return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadData.path)

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const ext = file.name.split(".").pop()?.toUpperCase() || ""

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        title: file.name,
        fileUrl: urlData.publicUrl,
        fileSize: formatSize(file.size),
        fileType: ext,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error: any) {
    console.error("[DOCUMENTS] POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
