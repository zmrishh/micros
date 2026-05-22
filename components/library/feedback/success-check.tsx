"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SuccessCheckProps {
  size?: number;
  color?: "amber" | "emerald" | "white";
  onComplete?: () => void;
  className?: string;
}

const COLOR_MAP = {
  amber: "#f59e0b",
  emerald: "#10b981",
  white: "#fafafa",
} as const;

export function SuccessCheck({
  size = 48,
  color = "amber",
  onComplete,
  className,
}: SuccessCheckProps) {
  const prefersReduced = useReducedMotion();
  const strokeColor = COLOR_MAP[color];
  const strokeWidth = size / 16;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - strokeWidth * 1.5;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      role="img"
      aria-label="Success"
      className={cn("inline-flex items-center justify-center", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        {/* Circle */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.4, ease: "easeOut" }
          }
          style={{ rotate: -90, transformOrigin: "center" }}
        />
        {/* Check */}
        <motion.path
          d={`M ${cx * 0.55} ${cy} l ${cx * 0.3} ${cy * 0.3} l ${cx * 0.45} -${cy * 0.45}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : {
                  pathLength: { delay: 0.25, duration: 0.45, ease: [0.4, 0, 0.2, 1] },
                  opacity: { delay: 0.25, duration: 0.1 },
                }
          }
          onAnimationComplete={onComplete}
        />
      </svg>
    </div>
  );
}
