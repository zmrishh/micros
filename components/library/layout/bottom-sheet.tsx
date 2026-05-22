"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  children,
  title,
  className,
}: BottomSheetProps) {
  const prefersReduced = useReducedMotion();

  // Trap focus within the sheet
  const sheetRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const focusable = sheet.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleDragEnd = (_: never, info: PanInfo) => {
    if (info.velocity.y > 200 || info.offset.y > 100) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Bottom sheet"}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg",
              "rounded-t-3xl border border-zinc-800 border-b-0 bg-zinc-950",
              "shadow-2xl shadow-black/80",
              className
            )}
            initial={prefersReduced ? { opacity: 0 } : { y: "100%" }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { y: "100%" }}
            transition={
              prefersReduced
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 350, damping: 35 }
            }
            drag={prefersReduced ? false : "y"}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div className="flex items-center justify-center pt-3 pb-2" aria-hidden="true">
              <div
                className="w-10 h-1 rounded-full bg-zinc-700 cursor-grab active:cursor-grabbing"
                aria-label="Drag to dismiss"
              />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 pb-3 pt-1">
                <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Close"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-5 pb-8 pt-2 overflow-y-auto max-h-[60vh]">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
