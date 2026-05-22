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
  /**
   * Custom SVG path — overrides preset.
   * Must be provided with a matching viewBox.
   */
  path?: string;
  viewBox?: string;
}

const PRESETS: Record<DrawPreset, { path: string; viewBox: string }> = {
  checkmark: {
    path: "M4 12 L9 17 L20 6",
    viewBox: "0 0 24 24",
  },
  circle: {
    path: "M12 2 A10 10 0 1 1 11.99 2",
    viewBox: "0 0 24 24",
  },
  underline: {
    path: "M2 20 L22 20",
    viewBox: "0 0 24 24",
  },
  arrow: {
    path: "M4 12 L20 12 M14 6 L20 12 L14 18",
    viewBox: "0 0 24 24",
  },
};

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

  const resolvedPath = path ?? PRESETS[preset].path;
  const resolvedViewBox = viewBox ?? PRESETS[preset].viewBox;

  const shouldDraw =
    trigger === "mount" ||
    (trigger === "visible" && isInView) ||
    (trigger === "hover" && hovered);

  const pathSegments = resolvedPath.split(/(?=[MLCAZa-z])/);

  const cubicEase = [0.4, 0, 0.2, 1] as [number, number, number, number];
  const transition = prefersReduced
    ? { duration: 0 }
    : {
        pathLength: {
          duration,
          ease: cubicEase,
          repeat: loop && !prefersReduced ? Infinity : 0,
          repeatType: "loop" as const,
        },
        opacity: { duration: 0.15 },
      };

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
      className={cn("overflow-visible", className)}
    >
      {/* Render as multiple path segments if the preset has compound paths */}
      {pathSegments.length > 1 && !path ? (
        // Multiple sub-paths (e.g. arrow: body + arrowhead)
        resolvedPath.split(" M ").filter(Boolean).map((seg, i) => (
          <motion.path
            key={i}
            d={`M ${seg.startsWith("M") ? seg.slice(2) : seg}`}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              shouldDraw
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
          transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    pathLength: {
                      duration,
                      ease: cubicEase,
                      repeat: loop ? Infinity : 0,
                      repeatType: "loop" as const,
                      delay: i * 0.12,
                    },
                    opacity: { duration: 0.15 },
                  }
            }
          />
        ))
      ) : (
        <motion.path
          d={resolvedPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            shouldDraw
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={transition}
        />
      )}
    </svg>
  );
}
