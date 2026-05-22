"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Copy, Check, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonVariant = "icon" | "label" | "code";

interface CopyButtonProps {
  value: string;
  variant?: CopyButtonVariant;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: { btn: "h-6 w-6", icon: 11, text: "text-[10px]" },
  md: { btn: "h-7 w-7", icon: 13, text: "text-xs" },
  lg: { btn: "h-8 w-8", icon: 15, text: "text-xs" },
} as const;

export function CopyButton({
  value,
  variant = "icon",
  label = "Copy",
  size = "md",
  className,
}: CopyButtonProps) {
  const [state, setState] = React.useState<"idle" | "copied">("idle");
  const prefersReduced = useReducedMotion();
  const liveRef = React.useRef<HTMLSpanElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = React.useCallback(async () => {
    if (state === "copied") return;
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      if (liveRef.current) liveRef.current.textContent = "Copied";
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setState("idle");
        if (liveRef.current) liveRef.current.textContent = "";
      }, 2200);
    } catch {
      // Clipboard unavailable — no-op
    }
  }, [value, state]);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const s = SIZE[size];
  const isCopied = state === "copied";

  if (variant === "code") {
    return (
      <>
        <span ref={liveRef} className="sr-only" aria-live="polite" />
        <motion.button
          type="button"
          onClick={handleCopy}
          aria-label={isCopied ? "Copied" : `Copy ${label}`}
          className={cn(
            "flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11px] font-medium transition-colors cursor-pointer",
            isCopied
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-zinc-700/60 bg-zinc-900 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
            className
          )}
          whileTap={prefersReduced ? {} : { scale: 0.93 }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isCopied ? (
              <motion.span
                key="check"
                className="flex items-center gap-1.5"
                initial={prefersReduced ? {} : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, y: -3 }}
                transition={{ duration: 0.14 }}
              >
                <Check size={11} strokeWidth={2.5} />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="flex items-center gap-1.5"
                initial={prefersReduced ? {} : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, y: -3 }}
                transition={{ duration: 0.14 }}
              >
                <Copy size={11} />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </>
    );
  }

  if (variant === "label") {
    return (
      <>
        <span ref={liveRef} className="sr-only" aria-live="polite" />
        <motion.button
          type="button"
          onClick={handleCopy}
          aria-label={isCopied ? "Copied" : `Copy ${label}`}
          className={cn(
            "inline-flex items-center gap-2 h-8 px-3.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer",
            isCopied
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
            className
          )}
          whileTap={prefersReduced ? {} : { scale: 0.94 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isCopied ? (
              <motion.span key="check" className="flex items-center gap-2"
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.16, type: "spring", stiffness: 400, damping: 20 }}
              >
                <Check size={13} strokeWidth={2.5} />
                Copied
              </motion.span>
            ) : (
              <motion.span key="copy" className="flex items-center gap-2"
                initial={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.16, type: "spring", stiffness: 400, damping: 20 }}
              >
                <Clipboard size={13} />
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </>
    );
  }

  // Default: icon-only
  return (
    <>
      <span ref={liveRef} className="sr-only" aria-live="polite" />
      <motion.button
        type="button"
        onClick={handleCopy}
        aria-label={isCopied ? "Copied" : "Copy to clipboard"}
        className={cn(
          "relative inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer",
          s.btn,
          isCopied
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-zinc-700/60 bg-transparent text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
          className
        )}
        whileTap={prefersReduced ? {} : { scale: 0.88 }}
        transition={{ type: "spring", stiffness: 600, damping: 28 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCopied ? (
            <motion.span key="check"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.5, rotate: 15 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 18 }}
            >
              <Check size={s.icon} strokeWidth={2.5} aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span key="copy"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.5, rotate: 15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.5, rotate: -15 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 18 }}
            >
              <Copy size={s.icon} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
