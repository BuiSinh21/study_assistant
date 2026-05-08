"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Files, MoreHorizontal, UploadCloud, Search, Trash2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockDocuments = [
  { id: "1", title: "Biology_Chapter_1.pdf", type: "PDF", size: "2.4 MB", date: "2026-05-08" },
  { id: "2", title: "History_Notes.docx", type: "DOCX", size: "1.1 MB", date: "2026-05-07" },
  { id: "3", title: "Physics_Formulas.txt", type: "TXT", size: "12 KB", date: "2026-05-06" },
];

export default function DocumentsPage() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Manage your study materials here. Upload new documents to get started.
          </p>
        </div>

        <Dialog>
          <DialogTrigger className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-700 text-white")}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Upload Document
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Drag and drop your files here or click to browse. Supports PDF, DOCX, and TXT up to 50MB.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center h-48 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                  <UploadCloud className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="font-medium">Click to select files</p>
                <p className="text-sm text-muted-foreground">or drag and drop here</p>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Start Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Files className="h-4 w-4 text-primary" />
                  </div>
                  {doc.title}
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0")}>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer" >
                          <Link href={`/dashboard/documents/${doc.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
