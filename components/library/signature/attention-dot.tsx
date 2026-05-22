"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type AttentionLevel = "idle" | "live" | "warning" | "critical" | "resolved";

interface AttentionDotProps {
  level?: AttentionLevel;
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const LEVEL_CONFIG: Record<
  AttentionLevel,
  { dot: string; ring: string; text: string; pulseInterval: number; pulseScale: number }
> = {
  idle: {
    dot: "bg-zinc-600",
    ring: "bg-zinc-600",
    text: "text-zinc-600",
    pulseInterval: 0,
    pulseScale: 0,
  },
  live: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500",
    text: "text-emerald-400",
    pulseInterval: 2.5,
    pulseScale: 2.8,
  },
  warning: {
    dot: "bg-amber-400",
    ring: "bg-amber-400",
    text: "text-amber-400",
    pulseInterval: 1.8,
    pulseScale: 2.2,
  },
  critical: {
    dot: "bg-red-500",
    ring: "bg-red-500",
    text: "text-red-400",
    pulseInterval: 0.8,
    pulseScale: 2.5,
  },
  resolved: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500",
    text: "text-emerald-400",
    pulseInterval: 0,
    pulseScale: 0,
  },
};

const DOT_SIZE = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
} as const;

const LABEL_SIZE = {
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
} as const;

export function AttentionDot({
  level = "idle",
  label,
  size = "md",
  showLabel = true,
  className,
}: AttentionDotProps) {
  const prefersReduced = useReducedMotion();
  const config = LEVEL_CONFIG[level];
  const dotClass = DOT_SIZE[size];
  const shouldPulse = config.pulseInterval > 0 && !prefersReduced;

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={label ? `${label}: ${level}` : level}
    >
      <span className="relative inline-flex items-center justify-center">
        {/* Pulse ring */}
        {shouldPulse && (
          <motion.span
            className={cn("absolute rounded-full", dotClass, config.ring)}
            animate={{ scale: [1, config.pulseScale], opacity: [0.7, 0] }}
            transition={{
              duration: config.pulseInterval,
              repeat: Infinity,
              ease: "easeOut",
            }}
            aria-hidden="true"
          />
        )}

        {/* Core dot */}
        <AnimatePresence mode="wait">
          {level === "resolved" ? (
            <motion.span
              key="resolved"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "relative inline-flex items-center justify-center rounded-full",
                dotClass,
                "bg-emerald-500"
              )}
            >
              <Check
                style={{ width: "60%", height: "60%" }}
                strokeWidth={3}
                className="text-white"
                aria-hidden="true"
              />
            </motion.span>
          ) : (
            <motion.span
              key={level}
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 20 }}
              className={cn("relative inline-flex rounded-full", dotClass, config.dot)}
            />
          )}
        </AnimatePresence>
      </span>

      {showLabel && label && (
        <span className={cn("tabular-nums", LABEL_SIZE[size], config.text)}>
          {label}
        </span>
      )}
    </span>
  );
}
