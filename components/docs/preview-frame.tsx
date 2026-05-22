import { cn } from "@/lib/utils";

interface PreviewFrameProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  minHeight?: number;
}

export function PreviewFrame({
  children,
  label = "Preview",
  className,
  minHeight = 160,
}: PreviewFrameProps) {
  return (
    <div className={cn("rounded-2xl border border-zinc-800 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        </div>
        <span className="text-xs text-zinc-600 ml-1">{label}</span>
      </div>

      {/* Preview area */}
      <div
        className="flex items-center justify-center bg-[#0d0d0d] p-8"
        style={{ minHeight }}
        role="region"
        aria-label={`${label} preview`}
      >
        {children}
      </div>
    </div>
  );
}
