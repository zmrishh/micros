"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface UndoToastProps {
  open: boolean;
  message: string;
  onUndo: () => void;
  onClose: () => void;
  duration?: number;
  position?: "bottom-center" | "bottom-right" | "top-center";
  className?: string;
}

export function UndoToast({
  open,
  message,
  onUndo,
  onClose,
  duration = 5000,
  position = "bottom-center",
  className,
}: UndoToastProps) {
  const prefersReduced = useReducedMotion();
  const [progress, setProgress] = React.useState(100);
  const startRef = React.useRef(0);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (!open) { setProgress(100); return; }
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
      else onClose();
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [open, duration, onClose]);

  const handleUndo = () => {
    cancelAnimationFrame(rafRef.current);
    onUndo();
    onClose();
  };

  const positionClass = {
    "bottom-center": "fixed bottom-5 left-1/2 -translate-x-1/2 z-50",
    "bottom-right": "fixed bottom-5 right-5 z-50",
    "top-center": "fixed top-5 left-1/2 -translate-x-1/2 z-50",
  }[position];

  return (
    <div className={cn(positionClass)}>
      <AnimatePresence>
        {open && (
          <motion.div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className={cn(
              "relative overflow-hidden flex items-center gap-3",
              "min-w-[300px] max-w-sm px-4 py-3",
              "rounded-xl border border-zinc-700 bg-zinc-900",
              "shadow-xl shadow-black/40",
              className
            )}
          >
            {/* Countdown bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-amber-500 origin-left"
              initial={{ scaleX: 1 }}
              style={{ width: `${progress}%`, transformOrigin: "left" }}
              aria-hidden="true"
            />

            <p className="flex-1 text-sm text-zinc-200 font-medium leading-snug">
              {message}
            </p>

            <button
              type="button"
              onClick={handleUndo}
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg",
                "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              )}
              aria-label="Undo last action"
            >
              <RotateCcw size={11} aria-hidden="true" />
              Undo
            </button>

            <button
              type="button"
              onClick={onClose}
              className={cn(
                "text-zinc-600 hover:text-zinc-300 transition-colors rounded",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              )}
              aria-label="Dismiss"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── UndoFlow: wraps a collapsible item with an integrated undo gesture ─── */

interface UndoFlowProps {
  onDelete: () => void;
  onRestore: () => void;
  toastMessage?: string;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export function UndoFlow({
  onDelete,
  onRestore,
  toastMessage = "Item removed",
  duration = 5000,
  children,
  className,
}: UndoFlowProps) {
  const prefersReduced = useReducedMotion();
  const [deleted, setDeleted] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);

  const handleDelete = () => {
    setDeleted(true);
    setToastOpen(true);
    onDelete();
  };

  const handleUndo = () => {
    setDeleted(false);
    setToastOpen(false);
    onRestore();
  };

  return (
    <>
      <AnimatePresence>
        {!deleted && (
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, height: 0, marginBottom: 0 }
            }
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
            className={className}
          >
            {React.isValidElement(children)
              ? React.cloneElement(children as React.ReactElement<{ onDelete?: () => void }>, {
                  onDelete: handleDelete,
                })
              : children}
          </motion.div>
        )}
      </AnimatePresence>

      <UndoToast
        open={toastOpen}
        message={toastMessage}
        onUndo={handleUndo}
        onClose={() => setToastOpen(false)}
        duration={duration}
      />
    </>
  );
}
