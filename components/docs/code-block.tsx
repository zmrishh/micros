"use client";

import * as React from "react";
import { CopyButton } from "@/components/library/actions/copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = "tsx", filename, className }: CodeBlockProps) {
  const lines = code.trim().split("\n");

  return (
    <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-xs text-zinc-500 font-mono">{filename}</span>
          )}
          {!filename && (
            <span className="text-xs text-zinc-600 font-mono uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>
        <CopyButton value={code.trim()} size="sm" />
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-xs leading-relaxed font-mono">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span
                  className="select-none w-8 text-right text-zinc-700 mr-6 flex-shrink-0 leading-relaxed"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-zinc-300">{renderLine(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

const KEYWORDS = new Set([
  "import","export","from","const","let","var","function","return",
  "type","interface","default","extends","implements","class","new",
  "if","else","for","while","async","await","try","catch","void",
  "string","number","boolean","true","false","null","undefined",
]);

// Lightweight syntax highlighter for TSX — handles undefined split parts safely
function renderLine(line: string): React.ReactNode {
  const parts = line.split(
    /((?:"[^"]*"|'[^']*'|`[^`]*`)|\b(?:import|export|from|const|let|var|function|return|type|interface|default|extends|implements|class|new|if|else|for|while|async|await|try|catch|void|string|number|boolean|React|true|false|null|undefined)\b)/g
  );

  return parts.map((part, i) => {
    if (!part) return null;
    if (part[0] === '"' || part[0] === "'" || part[0] === "`") {
      return <span key={i} className="text-amber-300/90">{part}</span>;
    }
    if (part === "React") {
      return <span key={i} className="text-emerald-400/80">{part}</span>;
    }
    if (KEYWORDS.has(part)) {
      return <span key={i} className="text-sky-400/90">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}
