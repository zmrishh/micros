"use client";

import * as React from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type DrawPreset = "checkmark" | "circle" | "underline" | "arrow";
type DrawTrigger = "mount" | "hover" | "visible";

interface DrawPathProps {
  preset?: DrawPreset;
  trigger?: DrawTrigger;
  duration?: number;
  color?: string;
  strokeWidth?: number;
  size?: number;
  loop?: boolean;
  className?: string;
  /** Custom SVG path — overrides preset. Must provide matching viewBox. */
  path?: string;
  viewBox?: string;
}

// Each preset is expressed as an array of independent path segments so
// compound shapes (e.g. arrow = shaft + head) animate correctly.
const PRESETS: Record<DrawPreset, { paths: string[]; viewBox: string }> = {
  checkmark: {
    paths: ["M4 12 L9 17 L20 6"],
    viewBox: "0 0 24 24",
  },
  circle: {
    paths: ["M 12 2 A 10 10 0 1 1 11.99 2"],
    viewBox: "0 0 24 24",
  },
  underline: {
    paths: ["M2 20 L22 20"],
    viewBox: "0 0 24 24",
  },
  arrow: {
    paths: ["M4 12 L20 12", "M14 6 L20 12 L14 18"],
    viewBox: "0 0 24 24",
  },
};

const CUBIC_EASE = [0.4, 0, 0.2, 1] as [number, number, number, number];

export function DrawPath({
  preset = "checkmark",
  trigger = "mount",
  duration = 0.6,
  color = "currentColor",
  strokeWidth = 2,
  size = 24,
  loop = false,
  path,
  viewBox,
  className,
}: DrawPathProps) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: !loop, margin: "-10%" });
  const [hovered, setHovered] = React.useState(false);

  const shouldDraw =
    trigger === "mount" ||
    (trigger === "visible" && isInView) ||
    (trigger === "hover" && hovered);

  // If a custom path string is provided, wrap it in an array; otherwise use preset segments
  const segments: string[] = path ? [path] : PRESETS[preset].paths;
  const resolvedViewBox = viewBox ?? PRESETS[preset].viewBox;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={resolvedViewBox}
      fill="none"
      aria-hidden="true"
      onMouseEnter={() => trigger === "hover" && setHovered(true)}
      onMouseLeave={() => trigger === "hover" && setHovered(false)}
      className={cn("overflow-visible cursor-pointer", className)}
    >
      {segments.map((seg, i) => (
        <motion.path
          key={i}
          d={seg}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            shouldDraw ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
          }
          transition={
            prefersReduced
              ? { duration: 0 }
              : {
                  pathLength: {
                    duration,
                    ease: CUBIC_EASE,
                    repeat: loop ? Infinity : 0,
                    repeatType: "loop" as const,
                    delay: i * 0.12,
                  },
                  opacity: { duration: 0.15, delay: i * 0.12 },
                }
          }
        />
      ))}
    </svg>
  );
}
