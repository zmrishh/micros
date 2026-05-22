"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SoftCollapseProps {
  children: React.ReactNode;
  title?: string;
  summary?: string;
  defaultOpen?: boolean;
  maxCollapsedHeight?: number;
  variant?: "card" | "bare" | "faq";
  className?: string;
}

export function SoftCollapse({
  children,
  title,
  summary,
  defaultOpen = false,
  maxCollapsedHeight = 80,
  variant = "card",
  className,
}: SoftCollapseProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const prefersReduced = useReducedMotion();
  const panelId = React.useId();

  const trigger = (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen((v) => !v)}
      className={cn(
        "w-full flex items-start justify-between gap-4 text-left",
        variant === "card" && "p-5",
        variant === "faq" && "py-4",
        variant === "bare" && "py-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset rounded-lg"
      )}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn(
            "font-semibold leading-snug",
            variant === "faq" ? "text-base text-zinc-100" : "text-sm text-zinc-100"
          )}>
            {title}
          </p>
        )}
        {summary && (
          <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">{summary}</p>
        )}
      </div>
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={prefersReduced ? { duration: 0 } : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 mt-0.5 text-zinc-600"
        aria-hidden="true"
      >
        <ChevronDown size={16} />
      </motion.span>
    </button>
  );

  const content = (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={panelId}
          role="region"
          aria-label={title}
          initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: "hidden" }}
        >
          <div
            className={cn(
              variant === "card" && "px-5 pb-5 pt-0 border-t border-zinc-800",
              variant === "faq" && "pb-4 border-t border-zinc-800/60 pt-4",
              variant === "bare" && "pt-2"
            )}
          >
            <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (variant === "bare") {
    return (
      <div className={cn("flex flex-col", className)}>
        {trigger}
        {content}
      </div>
    );
  }

  if (variant === "faq") {
    return (
      <div
        className={cn(
          "border-b border-zinc-800/60 last:border-0",
          className
        )}
      >
        {trigger}
        {content}
      </div>
    );
  }

  // Card
  return (
    <div
      className={cn(
        "rounded-2xl border bg-[#111111] overflow-hidden transition-colors duration-200",
        open ? "border-zinc-700" : "border-zinc-800 hover:border-zinc-700",
        className
      )}
    >
      {trigger}
      {content}
    </div>
  );
}
