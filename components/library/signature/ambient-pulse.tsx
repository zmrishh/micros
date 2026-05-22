"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type PulseColor = "amber" | "blue" | "green" | "critical" | "violet";

interface AmbientPulseProps {
  children: React.ReactNode;
  color?: PulseColor;
  /** Glow spread radius in pixels */
  radius?: number;
  /** Duration of one breath cycle in seconds */
  speed?: number;
  /** If false, the glow is static (no loop) */
  breathe?: boolean;
  intensity?: "soft" | "medium" | "strong";
  className?: string;
}

// Solid base color (opacity=1) — element opacity handles the breathing effect
const COLOR_MAP: Record<PulseColor, string> = {
  amber: "rgb(245,158,11)",
  blue: "rgb(96,165,250)",
  green: "rgb(16,185,129)",
  critical: "rgb(239,68,68)",
  violet: "rgb(139,92,246)",
};

const INTENSITY_RANGE: Record<
  "soft" | "medium" | "strong",
  [number, number]
> = {
  soft: [0.15, 0.35],
  medium: [0.22, 0.5],
  strong: [0.35, 0.7],
};

export function AmbientPulse({
  children,
  color = "amber",
  radius = 32,
  speed = 3,
  breathe = true,
  intensity = "soft",
  className,
}: AmbientPulseProps) {
  const prefersReduced = useReducedMotion();
  const baseColor = COLOR_MAP[color];
  const [minOpacity, maxOpacity] = INTENSITY_RANGE[intensity];
  const shouldBreathe = breathe && !prefersReduced;

  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Glow layer — sits behind content via z-index -1 */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: -radius / 2,
          left: -radius / 2,
          right: -radius / 2,
          bottom: -radius / 2,
          borderRadius: "inherit",
          filter: `blur(${radius}px)`,
          background: baseColor,
          zIndex: -1,
        }}
        initial={{ opacity: minOpacity, scale: 1 }}
        animate={
          shouldBreathe
            ? {
                opacity: [minOpacity, maxOpacity, minOpacity],
                scale: [1, 1.06, 1],
              }
            : { opacity: minOpacity, scale: 1 }
        }
        transition={
          shouldBreathe
            ? {
                duration: speed,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }
            : { duration: 0 }
        }
      />

      {/* Content sits on top */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
