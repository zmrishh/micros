"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBeamProps {
  progress?: number;
  indeterminate?: boolean;
  color?: "amber" | "blue" | "emerald" | "white";
  height?: number;
  className?: string;
}

const COLOR_MAP = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  white: "bg-zinc-100",
} as const;

const GLOW_MAP = {
  amber: "shadow-amber-500/60",
  blue: "shadow-blue-500/60",
  emerald: "shadow-emerald-500/60",
  white: "shadow-white/60",
} as const;

export function ProgressBeam({
  progress = 0,
  indeterminate = false,
  color = "amber",
  height = 2,
  className,
}: ProgressBeamProps) {
  const prefersReduced = useReducedMotion();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={indeterminate ? "Loading" : `${clampedProgress}% complete`}
      className={cn("relative w-full overflow-hidden rounded-full bg-zinc-800", className)}
      style={{ height }}
    >
      {indeterminate && !prefersReduced ? (
        <motion.div
          className={cn(
            "absolute h-full rounded-full",
            COLOR_MAP[color],
            `shadow-sm ${GLOW_MAP[color]}`
          )}
          initial={{ left: "-35%", right: "100%" }}
          animate={{
            left: ["−35%", "100%"],
            right: ["100%", "-90%"],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            times: [0, 1],
          }}
          style={{ width: "35%" }}
        />
      ) : (
        <motion.div
          className={cn(
            "h-full rounded-full",
            COLOR_MAP[color],
            `shadow-sm ${GLOW_MAP[color]}`
          )}
          initial={{ width: "0%" }}
          animate={{ width: `${clampedProgress}%` }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
          }
        />
      )}
    </div>
  );
}
