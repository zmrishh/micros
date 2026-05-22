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

// rgba values used for box-shadow — avoids any z-index / overflow-clip issues
const COLOR_RGBA: Record<PulseColor, string> = {
  amber: "245,158,11",
  blue: "96,165,250",
  green: "16,185,129",
  critical: "239,68,68",
  violet: "139,92,246",
};

const INTENSITY_RANGE: Record<"soft" | "medium" | "strong", [number, number]> =
  {
    soft: [0.18, 0.38],
    medium: [0.28, 0.55],
    strong: [0.42, 0.75],
  };

function buildShadow(rgba: string, opacity: number, radius: number): string {
  return `0 0 ${radius * 1.5}px ${radius * 0.5}px rgba(${rgba},${opacity})`;
}

export function AmbientPulse({
  children,
  color = "amber",
  radius = 28,
  speed = 3,
  breathe = true,
  intensity = "soft",
  className,
}: AmbientPulseProps) {
  const prefersReduced = useReducedMotion();
  const rgba = COLOR_RGBA[color];
  const [minOp, maxOp] = INTENSITY_RANGE[intensity];
  const shouldBreathe = breathe && !prefersReduced;

  return (
    <motion.div
      className={cn("relative inline-flex rounded-[inherit]", className)}
      initial={{ boxShadow: buildShadow(rgba, minOp, radius) }}
      animate={
        shouldBreathe
          ? {
              boxShadow: [
                buildShadow(rgba, minOp, radius),
                buildShadow(rgba, maxOp, radius * 1.4),
                buildShadow(rgba, minOp, radius),
              ],
              scale: [1, 1.01, 1],
            }
          : { boxShadow: buildShadow(rgba, minOp, radius) }
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
      aria-hidden="true"
    >
      {/* Children — rendered naturally on top, no z-index needed */}
      <div className="w-full">{children}</div>
    </motion.div>
  );
}
