"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Copy, Check, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartCopyBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  variant?: "default" | "terminal" | "minimal";
  className?: string;
}

const KEYWORDS = new Set([
  "import","export","from","const","let","var","function","return","type",
  "interface","default","extends","class","new","if","else","for","while",
  "async","await","try","catch","void","string","number","boolean","true",
  "false","null","undefined","readonly","implements",
]);

function tokenizeLine(line: string): React.ReactNode[] {
  const parts = line.split(
    /((?:"[^"]*"|'[^']*'|`[^`]*`)|\b(?:import|export|from|const|let|var|function|return|type|interface|default|extends|class|new|if|else|for|while|async|await|try|catch|void|string|number|boolean|true|false|null|undefined|readonly|implements|React)\b)/g
  );
  return parts.map((part, i) => {
    if (!part) return null;
    if (part[0] === '"' || part[0] === "'" || part[0] === "`")
      return <span key={i} className="text-amber-300/80">{part}</span>;
    if (part === "React" || part === "import" || part === "export" || part === "from")
      return <span key={i} className="text-emerald-400/80">{part}</span>;
    if (KEYWORDS.has(part))
      return <span key={i} className="text-sky-400/85">{part}</span>;
    return part;
  });
}

export function SmartCopyBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = true,
  highlightLines = [],
  variant = "default",
  className,
}: SmartCopyBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null);
  const prefersReduced = useReducedMotion();
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const liveRef = React.useRef<HTMLSpanElement>(null);

  const lines = code.trim().split("\n");

  const handleCopy = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      if (liveRef.current) liveRef.current.textContent = "Copied";
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
        if (liveRef.current) liveRef.current.textContent = "";
      }, 2200);
    } catch { /* silent */ }
  };

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  if (variant === "terminal") {
    return (
      <div
        className={cn(
          "rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden",
          className
        )}
      >
        {/* Terminal title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </div>
            <Terminal size={11} className="text-zinc-600 ml-1" aria-hidden="true" />
            <span className="text-[11px] text-zinc-600">{filename ?? "Terminal"}</span>
          </div>
          <CopyBtn copied={copied} onCopy={handleCopy} prefersReduced={prefersReduced} liveRef={liveRef} />
        </div>

        <div className="overflow-x-auto p-4">
          {lines.map((line, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-zinc-600 text-xs font-mono select-none pt-[1px] flex-shrink-0" aria-hidden="true">
                $
              </span>
              <span className="text-xs font-mono text-emerald-300/90 leading-relaxed">{line}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "group relative rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden",
          className
        )}
      >
        <span ref={liveRef} className="sr-only" aria-live="polite" />
        <pre className="overflow-x-auto px-4 py-3 text-xs font-mono text-zinc-300 leading-relaxed">
          <code>{code.trim()}</code>
        </pre>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyBtn copied={copied} onCopy={handleCopy} prefersReduced={prefersReduced} liveRef={liveRef} />
        </div>
      </div>
    );
  }

  // Default: full featured
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden",
        className
      )}
    >
      <span ref={liveRef} className="sr-only" aria-live="polite" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-zinc-800 border border-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-800 border border-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-800 border border-zinc-700" />
          </div>
          {filename ? (
            <span className="text-[11px] text-zinc-500 font-mono ml-1">{filename}</span>
          ) : (
            <span className="text-[10px] uppercase tracking-widest text-zinc-700 ml-1">
              {language}
            </span>
          )}
        </div>
        <CopyBtn copied={copied} onCopy={handleCopy} prefersReduced={prefersReduced} liveRef={liveRef} />
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="py-4 text-xs leading-[1.75] font-mono">
          <code>
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const isHighlighted = highlightLines.includes(lineNum);
              const isHovered = hoveredLine === lineNum;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredLine(lineNum)}
                  onMouseLeave={() => setHoveredLine(null)}
                  className={cn(
                    "flex px-4 gap-4 transition-colors duration-75",
                    isHighlighted && "bg-amber-500/8 border-l-2 border-amber-500/60",
                    isHovered && !isHighlighted && "bg-zinc-800/40"
                  )}
                  aria-label={`Line ${lineNum}`}
                >
                  {showLineNumbers && (
                    <span
                      className={cn(
                        "select-none w-5 text-right flex-shrink-0 transition-colors",
                        isHovered || isHighlighted ? "text-zinc-600" : "text-zinc-800"
                      )}
                      aria-hidden="true"
                    >
                      {lineNum}
                    </span>
                  )}
                  <span className="text-zinc-300">{tokenizeLine(line)}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Shared copy button
function CopyBtn({
  copied,
  onCopy,
  prefersReduced,
  liveRef,
}: {
  copied: boolean;
  onCopy: () => void;
  prefersReduced: boolean | null;
  liveRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <motion.button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "flex items-center gap-1.5 h-6 px-2 rounded border text-[10px] font-medium transition-colors cursor-pointer",
        copied
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-zinc-700/60 bg-zinc-900 text-zinc-600 hover:text-zinc-200 hover:border-zinc-600",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
      )}
      whileTap={prefersReduced ? {} : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 600, damping: 28 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" className="flex items-center gap-1"
            initial={prefersReduced ? {} : { opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -2 }}
            transition={{ duration: 0.14 }}
          >
            <Check size={10} strokeWidth={2.5} />
            Copied
          </motion.span>
        ) : (
          <motion.span key="copy" className="flex items-center gap-1"
            initial={prefersReduced ? {} : { opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -2 }}
            transition={{ duration: 0.14 }}
          >
            <Copy size={10} />
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
