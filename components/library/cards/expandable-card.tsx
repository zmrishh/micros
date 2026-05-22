"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  title: string;
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ExpandableCard({
  title,
  summary,
  children,
  defaultOpen = false,
  className,
}: ExpandableCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const prefersReduced = useReducedMotion();
  const contentId = React.useId();

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden",
        "hover:border-zinc-700 transition-colors duration-200",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        className={cn(
          "w-full flex items-start justify-between gap-4 p-5 text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
        )}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-zinc-100 truncate">
            {title}
          </span>
          <span className="text-sm text-zinc-500 leading-relaxed">{summary}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.2, ease: "easeInOut" }}
          className="mt-0.5 text-zinc-500 flex-shrink-0"
          aria-hidden="true"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            role="region"
            aria-label={title}
            initial={prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pt-0 border-t border-zinc-800">
              <div className="pt-4 text-sm text-zinc-400 leading-relaxed">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
