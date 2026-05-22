"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Status = "online" | "processing" | "offline" | "error";

interface StatusPulseProps {
  status?: Status;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const STATUS_CONFIG: Record<
  Status,
  { dot: string; ring: string; label: string; animate: boolean }
> = {
  online: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500",
    label: "Online",
    animate: true,
  },
  processing: {
    dot: "bg-amber-400",
    ring: "bg-amber-400",
    label: "Processing",
    animate: true,
  },
  offline: {
    dot: "bg-zinc-600",
    ring: "bg-zinc-600",
    label: "Offline",
    animate: false,
  },
  error: {
    dot: "bg-red-500",
    ring: "bg-red-500",
    label: "Error",
    animate: true,
  },
};

const DOT_SIZE = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
} as const;

export function StatusPulse({
  status = "online",
  label,
  size = "md",
  className,
}: StatusPulseProps) {
  const prefersReduced = useReducedMotion();
  const config = STATUS_CONFIG[status];
  const displayLabel = label ?? config.label;
  const shouldAnimate = config.animate && !prefersReduced;

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={`Status: ${displayLabel}`}
    >
      <span className="relative flex items-center justify-center">
        {shouldAnimate && (
          <span
            className={cn(
              "absolute inline-flex rounded-full opacity-75",
              DOT_SIZE[size],
              config.ring
            )}
            style={{
              animation: "pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
            }}
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full",
            DOT_SIZE[size],
            config.dot
          )}
          aria-hidden="true"
        />
      </span>
      {label && (
        <span className="text-sm text-zinc-400 tabular-nums">{displayLabel}</span>
      )}
    </span>
  );
}
