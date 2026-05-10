import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

const BUCKET_NAME = "documents"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    if (document.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    try {
      const url = new URL(document.fileUrl)
      const storagePath = url.pathname.split(`/object/public/${BUCKET_NAME}/`)[1]
      if (storagePath) {
        await supabase.storage.from(BUCKET_NAME).remove([decodeURIComponent(storagePath)])
      }
    } catch {
    }

    await prisma.document.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[DOCUMENTS] DELETE error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
