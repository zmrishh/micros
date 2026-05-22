"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Upload, X, File, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(file: File): React.ReactNode {
  if (file.type.startsWith("image/")) return <Image size={14} />;
  return <File size={14} />;
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = true,
  maxSize,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validate = (incoming: File[]): File[] => {
    if (maxSize) {
      const oversized = incoming.filter((f) => f.size > maxSize);
      if (oversized.length > 0) {
        setError(`File too large. Max size: ${formatBytes(maxSize)}`);
        return incoming.filter((f) => f.size <= maxSize);
      }
    }
    setError(null);
    return incoming;
  };

  const addFiles = React.useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming);
      const valid = validate(arr);
      const merged = multiple ? [...files, ...valid] : valid.slice(0, 1);
      setFiles(merged);
      onFiles(merged);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, multiple, onFiles, maxSize]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFiles(next);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        animate={
          prefersReduced
            ? {}
            : dragging
            ? { scale: 1.01, borderColor: "rgba(245,158,11,0.6)" }
            : { scale: 1, borderColor: "rgba(39,39,42,1)" }
        }
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed",
          "h-36 cursor-pointer transition-colors",
          dragging
            ? "border-amber-500/60 bg-amber-500/5"
            : "border-zinc-800 hover:border-zinc-700 bg-[#111111] hover:bg-zinc-900/50"
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
          aria-label="File input"
        />
        <motion.div
          animate={
            prefersReduced ? {} : dragging ? { scale: 1.1, color: "#f59e0b" } : { scale: 1 }
          }
          className="text-zinc-600"
        >
          <Upload size={24} aria-hidden="true" />
        </motion.div>
        <div className="text-center">
          <p className="text-sm text-zinc-400">
            <span className="text-amber-400 font-medium">Click to upload</span>
            {" "}or drag and drop
          </p>
          {accept && (
            <p className="text-xs text-zinc-600 mt-0.5">{accept.replace(/,/g, ", ")}</p>
          )}
        </div>
      </motion.div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}

      <AnimatePresence>
        {files.map((file, i) => (
          <motion.div
            key={`${file.name}-${i}`}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5"
          >
            <span className="text-zinc-500 flex-shrink-0" aria-hidden="true">
              {getFileIcon(file)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{file.name}</p>
              <p className="text-xs text-zinc-600">{formatBytes(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
              className="text-zinc-600 hover:text-zinc-300 transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
              aria-label={`Remove ${file.name}`}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
