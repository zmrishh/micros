"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "queued" | "running" | "done" | "failed" | "skipped";

interface TimelineStep {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
  duration?: string;
}

interface MicroTimelineProps {
  steps: TimelineStep[];
  variant?: "vertical" | "horizontal";
  size?: "sm" | "md";
  className?: string;
}

const STATUS_CONFIG: Record<
  StepStatus,
  { icon: React.ReactNode; dot: string; text: string; lineColor: string }
> = {
  queued: {
    icon: <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />,
    dot: "border border-zinc-700 bg-zinc-900",
    text: "text-zinc-600",
    lineColor: "bg-zinc-800",
  },
  running: {
    icon: <Loader2 size={10} className="animate-spin text-amber-400" aria-hidden="true" />,
    dot: "border border-amber-500/40 bg-amber-500/10",
    text: "text-zinc-200",
    lineColor: "bg-zinc-800",
  },
  done: {
    icon: <Check size={10} strokeWidth={2.5} className="text-emerald-400" aria-hidden="true" />,
    dot: "border border-emerald-500/30 bg-emerald-500/10",
    text: "text-zinc-400",
    lineColor: "bg-emerald-500/20",
  },
  failed: {
    icon: <X size={10} strokeWidth={2.5} className="text-red-400" aria-hidden="true" />,
    dot: "border border-red-500/30 bg-red-500/10",
    text: "text-red-400",
    lineColor: "bg-red-500/20",
  },
  skipped: {
    icon: <span className="h-1 w-1 rounded-full bg-zinc-700" />,
    dot: "border border-zinc-800 bg-zinc-900",
    text: "text-zinc-700",
    lineColor: "bg-zinc-800",
  },
};

export function MicroTimeline({
  steps,
  variant = "vertical",
  size = "md",
  className,
}: MicroTimelineProps) {
  const prefersReduced = useReducedMotion();
  const dotSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const labelSize = size === "sm" ? "text-xs" : "text-sm";
  const detailSize = "text-[11px]";

  if (variant === "horizontal") {
    return (
      <div
        className={cn("flex items-start gap-0", className)}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, i) => {
          const config = STATUS_CONFIG[step.status];
          const isLast = i === steps.length - 1;
          return (
            <div key={step.id} role="listitem" className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center w-full">
                {/* Connecting line before */}
                {i > 0 && (
                  <div className={cn("flex-1 h-px", STATUS_CONFIG[steps[i - 1].status].lineColor)} aria-hidden="true" />
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.status}
                    initial={prefersReduced ? {} : { scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.22, type: "spring", stiffness: 400, damping: 20 }}
                    className={cn(
                      "flex-shrink-0 flex items-center justify-center rounded-full",
                      dotSize,
                      config.dot
                    )}
                    aria-label={`${step.label}: ${step.status}`}
                  >
                    {config.icon}
                  </motion.div>
                </AnimatePresence>
                {/* Connecting line after */}
                {!isLast && (
                  <div className={cn("flex-1 h-px", config.lineColor)} aria-hidden="true" />
                )}
              </div>
              <span className={cn("text-center truncate w-full", detailSize, config.text)}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical
  return (
    <div className={cn("flex flex-col", className)} role="list" aria-label="Progress steps">
      {steps.map((step, i) => {
        const config = STATUS_CONFIG[step.status];
        const isLast = i === steps.length - 1;
        return (
          <motion.div
            key={step.id}
            role="listitem"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="flex gap-3"
          >
            {/* Dot + line column */}
            <div className="flex flex-col items-center gap-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.status}
                  initial={prefersReduced ? {} : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 20 }}
                  className={cn(
                    "flex-shrink-0 flex items-center justify-center rounded-full mt-0.5",
                    dotSize,
                    config.dot
                  )}
                  aria-label={`${step.label}: ${step.status}`}
                >
                  {config.icon}
                </motion.div>
              </AnimatePresence>
              {!isLast && (
                <div
                  className={cn("w-px flex-1 min-h-[20px] my-1 transition-colors duration-300", config.lineColor)}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-4", isLast && "pb-0")}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(labelSize, "font-medium leading-[1.4]", config.text)}>
                  {step.label}
                </span>
                {step.duration && (
                  <span className={cn(detailSize, "text-zinc-700 font-mono")}>
                    {step.duration}
                  </span>
                )}
              </div>
              {step.detail && (
                <p className={cn(detailSize, "mt-0.5 text-zinc-600 leading-relaxed")}>
                  {step.detail}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
