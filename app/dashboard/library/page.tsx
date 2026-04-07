"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { apiService } from "@/lib/api"
import type { Document as DocType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload, FileText, FileType, Trash2, MessageSquare,
  BookOpen, Loader2, CheckCircle2, AlertCircle, Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function StatusBadge({ status }: { status: DocType["status"] }) {
  const map = {
    uploading:  { label: "Uploading",   icon: Loader2,      cls: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    processing: { label: "Indexing…",   icon: Loader2,      cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
    ready:      { label: "Ready",       icon: CheckCircle2, cls: "text-green-400 bg-green-400/10 border-green-400/20" },
    failed:     { label: "Failed",      icon: AlertCircle,  cls: "text-red-400 bg-red-400/10 border-red-400/20" },
  }
  const { label, icon: Icon, cls } = map[status] ?? map.failed
  const spin = status === "uploading" || status === "processing"
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border", cls)}>
      <Icon className={cn("h-3 w-3 shrink-0", spin && "animate-spin")} />
      {label}
    </span>
  )
}

function FileIcon({ type }: { type: string }) {
  if (type === "pdf") return <FileText className="h-5 w-5 text-red-400" />
  if (type === "docx" || type === "doc") return <FileType className="h-5 w-5 text-blue-400" />
  return <FileText className="h-5 w-5 text-muted-foreground" />
}

// ─────────────────────────────────────────────────────────────────
// Upload zone
// ─────────────────────────────────────────────────────────────────

function UploadZone({ onUploaded }: { onUploaded: (doc: DocType) => void }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED = [".pdf", ".docx", ".doc", ".txt"]

  function pickFile(f: File) {
    setFile(f)
    setTitle(f.name.replace(/\.[^/.]+$/, ""))
    setError("")
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const { document: doc } = await apiService.uploadDocument(file, title || file.name, setUploadPct)
      onUploaded(doc)
      setFile(null)
      setTitle("")
      setUploadPct(0)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">Upload a Document</h2>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer select-none",
          dragging
            ? "border-[#EAB308]/60 bg-[#EAB308]/5"
            : file
            ? "border-[#EAB308]/40 bg-[#EAB308]/4"
            : "border-border hover:border-border/80 hover:bg-accent/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f) }}
        />

        {file ? (
          <>
            <div className="h-10 w-10 rounded-xl bg-[#EAB308]/12 flex items-center justify-center">
              <FileIcon type={file.name.split(".").pop() || ""} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setTitle("") }}
              className="text-[11px] text-muted-foreground hover:text-foreground underline"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground font-medium">Drop a file or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT — up to 50 MB</p>
            </div>
          </>
        )}
      </div>

      {/* Title field + upload button */}
      {file && (
        <div className="space-y-3">
          <Input
            placeholder="Document title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background"
          />

          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Uploading…</span><span>{uploadPct}%</span>
              </div>
              <Progress value={uploadPct} className="h-1.5" />
            </div>
          )}

          {error && (
            <p className="text-[12px] text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
            </p>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold"
          >
            {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</> : "Upload & Index"}
          </Button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Document card
// ─────────────────────────────────────────────────────────────────

function DocCard({
  doc,
  onDelete,
}: {
  doc: DocType
  onDelete: (id: string) => void
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await apiService.deleteDocument(doc._id)
      onDelete(doc._id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      onClick={() => doc.status === "ready" && router.push(`/dashboard/library/${doc._id}`)}
      className={cn(
        "group relative rounded-2xl border border-border bg-card p-5 transition-all duration-200",
        doc.status === "ready"
          ? "cursor-pointer hover:border-[#EAB308]/30 hover:shadow-[0_0_0_1px_rgba(234,179,8,0.12)] hover:-translate-y-0.5"
          : "opacity-75"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
          <FileIcon type={doc.fileType} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">{doc.title}</h3>
            <StatusBadge status={doc.status} />
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11.5px] text-muted-foreground uppercase">{doc.fileType}</span>
            <span className="text-[11.5px] text-muted-foreground">{formatBytes(doc.fileSize)}</span>
            {doc.status === "ready" && (
              <span className="text-[11.5px] text-muted-foreground">
                {doc.chunkCount} chunks · {doc.totalWords.toLocaleString()} words
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
            </span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {doc.status === "ready" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/library/${doc._id}`) }}
                  className="h-7 px-2.5 text-[11.5px] text-[#EAB308] hover:bg-[#EAB308]/10"
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />Ask AI
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={deleting}
                className="h-7 px-2 text-red-400 hover:bg-red-400/10 hover:text-red-300"
              >
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const [docs, setDocs] = useState<DocType[]>([])
  const [loading, setLoading] = useState(true)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadDocs = useCallback(async () => {
    try {
      const { documents } = await apiService.listDocuments()
      setDocs(documents)
    } catch {
      // silently fail on poll
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDocs()
    // Poll every 4s while any doc is still processing
    pollRef.current = setInterval(() => {
      setDocs((prev) => {
        const hasProcessing = prev.some((d) => d.status === "processing" || d.status === "uploading")
        if (hasProcessing) loadDocs()
        return prev
      })
    }, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [loadDocs])

  function onUploaded(doc: DocType) {
    setDocs((prev) => [doc, ...prev])
  }

  function onDelete(id: string) {
    setDocs((prev) => prev.filter((d) => d._id !== id))
  }

  const readyCount = docs.filter((d) => d.status === "ready").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Document Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload PDFs, books, or notes — then ask AI questions about them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Upload panel */}
        <UploadZone onUploaded={onUploaded} />

        {/* Document list */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />Loading library…
            </div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No documents yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Upload a PDF or book to start asking AI questions about it.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {docs.length} document{docs.length !== 1 ? "s" : ""} · {readyCount} ready
                </p>
              </div>
              <div className="space-y-3">
                {docs.map((doc) => (
                  <DocCard key={doc._id} doc={doc} onDelete={onDelete} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
