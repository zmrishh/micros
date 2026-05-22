"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type BeamState = "idle" | "active" | "processing" | "success" | "warning" | "error";

interface BorderBeamCardProps {
  children: React.ReactNode;
  state?: BeamState;
  duration?: number;
  className?: string;
}

const BEAM_COLORS: Record<BeamState, string> = {
  idle: "transparent",
  active: "#f59e0b",
  processing: "#60a5fa",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};

const BEAM_OPACITY: Record<BeamState, number> = {
  idle: 0,
  active: 0.9,
  processing: 1,
  success: 1,
  warning: 0.8,
  error: 0.9,
};

const BEAM_SPEED: Record<BeamState, number> = {
  idle: 0,
  active: 3.5,
  processing: 2,
  success: 4,
  warning: 2.5,
  error: 1.5,
};

export function BorderBeamCard({
  children,
  state = "idle",
  duration,
  className,
}: BorderBeamCardProps) {
  const prefersReduced = useReducedMotion();
  const isAnimated = state !== "idle" && !prefersReduced;
  const beamColor = BEAM_COLORS[state];
  const speed = duration ?? BEAM_SPEED[state];
  const opacity = BEAM_OPACITY[state];

  return (
    <div className={cn("relative rounded-2xl p-[1px] overflow-hidden", className)}>
      {/* Static border baseline */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl border transition-colors duration-500",
          state === "idle" ? "border-zinc-800" :
          state === "success" ? "border-emerald-500/30" :
          state === "error" ? "border-red-500/30" :
          state === "warning" ? "border-amber-500/30" :
          "border-zinc-700"
        )}
      />

      {/* Animated beam */}
      {isAnimated && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <motion.div
            className="absolute inset-[-100%]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${beamColor} 40deg, transparent 100deg)`,
              opacity,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Mask */}
      <div
        className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-[#111111]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
