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

const COLOR_MAP: Record<PulseColor, string> = {
  amber: "rgba(245,158,11,VAR)",
  blue: "rgba(96,165,250,VAR)",
  green: "rgba(16,185,129,VAR)",
  critical: "rgba(239,68,68,VAR)",
  violet: "rgba(139,92,246,VAR)",
};

const INTENSITY_RANGE: Record<
  "soft" | "medium" | "strong",
  [number, number]
> = {
  soft: [0.12, 0.28],
  medium: [0.18, 0.42],
  strong: [0.28, 0.6],
};

function resolveColor(template: string, opacity: number): string {
  return template.replace("VAR", String(opacity));
}

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
  const colorTemplate = COLOR_MAP[color];
  const [minOpacity, maxOpacity] = INTENSITY_RANGE[intensity];
  const shouldBreathe = breathe && !prefersReduced;

  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Glow layer — sits behind content */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-[inherit] pointer-events-none"
        style={{
          inset: -radius / 2,
          borderRadius: "inherit",
          filter: `blur(${radius}px)`,
          background: resolveColor(colorTemplate, maxOpacity),
          zIndex: -1,
        }}
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
