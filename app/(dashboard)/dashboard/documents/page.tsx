"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { Files, MoreHorizontal, UploadCloud, Search, Trash2, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  fileType: string | null;
  fileSize: string | null;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const data = await res.json();
          setDocuments(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      if (res.ok) {
        setSelectedFile(null);
        setDialogOpen(false);
        fetchDocuments();
      } else if (contentType?.includes("application/json")) {
        const data = await res.json();
        alert(data.error || "Upload failed");
      } else {
        const text = await res.text();
        console.error("Server returned HTML:", res.status, text.substring(0, 200));
        alert(`Upload failed (${res.status}). Check console for details.`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Filter documents by search
  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Manage your study materials here. Upload new documents to get started.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-48 transition-colors cursor-pointer",
                  dragActive
                    ? "border-indigo-500 bg-indigo-500/10"
                    : selectedFile
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-muted-foreground/25 hover:bg-muted/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {selectedFile ? (
                  <>
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="font-medium text-emerald-600">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                      <UploadCloud className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="font-medium">Click to select files</p>
                    <p className="text-sm text-muted-foreground">or drag and drop here</p>
                  </>
                )}
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isUploading || !selectedFile}
                onClick={handleUpload}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Start Upload"
                )}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading documents...</p>
                </TableCell>
              </TableRow>
            ) : filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Files className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">
                    {searchQuery ? "No documents match your search" : "No documents yet"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Try a different search term" : "Upload your first document to get started"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <Files className="h-4 w-4 text-primary" />
                    </div>
                    {doc.title}
                  </TableCell>
                  <TableCell>{doc.fileType || "—"}</TableCell>
                  <TableCell>{doc.fileSize || "—"}</TableCell>
                  <TableCell>{formatDate(doc.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0")}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Link href={`/dashboard/documents/${doc.id}`} className="flex">
                              <div className="flex">
                                <FileText className="mr-2 h-4 w-4" />
                                <p>View Details</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 font-semibold hover:opacity-80 cursor-pointer"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
