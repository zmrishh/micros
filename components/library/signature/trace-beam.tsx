"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TraceState = "idle" | "active" | "processing" | "success" | "error";

interface TraceBeamProps {
  children: React.ReactNode;
  state?: TraceState;
  /**
   * If true, the trace pauses at 100% on "success" instead of looping
   */
  pauseOnSuccess?: boolean;
  className?: string;
}

const STATE_CONFIG: Record<
  TraceState,
  { color: string; glow: string; speed: number; animate: boolean; opacity: number }
> = {
  idle: {
    color: "rgba(63,63,70,0)",
    glow: "transparent",
    speed: 0,
    animate: false,
    opacity: 0,
  },
  active: {
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
    speed: 3,
    animate: true,
    opacity: 0.85,
  },
  processing: {
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.25)",
    speed: 1.8,
    animate: true,
    opacity: 1,
  },
  success: {
    color: "#10b981",
    glow: "rgba(16,185,129,0.25)",
    speed: 4,
    animate: true,
    opacity: 0.9,
  },
  error: {
    color: "#ef4444",
    glow: "rgba(239,68,68,0.25)",
    speed: 1.2,
    animate: true,
    opacity: 0.9,
  },
};

export function TraceBeam({
  children,
  state = "idle",
  className,
}: TraceBeamProps) {
  const prefersReduced = useReducedMotion();
  const config = STATE_CONFIG[state];
  const showBeam = config.animate && !prefersReduced;

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "transition-shadow duration-500",
        className
      )}
    >
      {/* Border baseline */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl border transition-colors duration-400",
          state === "idle" ? "border-zinc-800" :
          state === "success" ? "border-emerald-500/20" :
          state === "error" ? "border-red-500/20" :
          state === "processing" ? "border-blue-500/20" :
          "border-amber-500/20"
        )}
      />

      {/* Rotating beam — only when active, processing, success, or error */}
      {showBeam && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-[-120%]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${config.color} 30deg, transparent 80deg)`,
              opacity: config.opacity,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: config.speed,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Inner mask to create thin border beam effect */}
          <div className="absolute inset-[1.5px] rounded-[calc(1rem-1.5px)] bg-inherit" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
