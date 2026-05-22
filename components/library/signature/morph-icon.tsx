"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MorphPair = "menu-close" | "play-pause" | "plus-check" | "eye-toggle";

interface MorphIconProps {
  pair: MorphPair;
  active: boolean;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

// All path data uses the same SVG viewBox (24 × 24) with identical point counts
// so Framer Motion can interpolate the d attribute cleanly.
const PATHS: Record<MorphPair, { a: string; b: string }> = {
  "menu-close": {
    // Hamburger (3 horizontal lines) → X
    // encoded as a single compound path with matching segment count
    a: "M4 6 L20 6 M4 12 L20 12 M4 18 L20 18",
    b: "M6 6 L18 18 M12 12 L12 12 M6 18 L18 6",
  },
  "play-pause": {
    // Play triangle → Pause two bars (same path structure)
    a: "M6 4 L6 20 L20 12 Z",
    b: "M7 4 L7 20 M17 4 L17 20",
  },
  "plus-check": {
    // Plus sign → Checkmark
    a: "M12 5 L12 19 M5 12 L19 12",
    b: "M4 12 L9 17 L20 6",
  },
  "eye-toggle": {
    // Open eye → Eye with slash
    a: "M1 12 C1 12 5 5 12 5 C19 5 23 12 23 12 C23 12 19 19 12 19 C5 19 1 12 1 12 Z M12 9 A3 3 0 1 1 12 15 A3 3 0 1 1 12 9 Z",
    b: "M17.94 17.94 A10.07 10.07 0 0 1 12 20 C5 20 1 12 1 12 A18.45 18.45 0 0 1 5.06 5.96 M9.9 4.24 A9.12 9.12 0 0 1 12 4 C19 4 23 12 23 12 A18.5 18.5 0 0 1 20.71 15.8 M1 1 L23 23",
  },
};

// For pairs that need multiple paths rendered separately (menu-close, play-pause)
// we handle them differently — drawing each line/shape as a separate path element
// so the morph is geometrically clean.

function MenuClose({
  active,
  strokeWidth,
  color,
  prefersReduced,
}: {
  active: boolean;
  strokeWidth: number;
  color: string;
  prefersReduced: boolean | null;
}) {
  const ease = [0.4, 0, 0.2, 1] as const;
  const dur = prefersReduced ? 0 : 0.25;
  return (
    <>
      {/* Top line → first diagonal */}
      <motion.line
        x1="4" y1="6" x2="20" y2="6"
        animate={active ? { x1: 6, y1: 6, x2: 18, y2: 18 } : { x1: 4, y1: 6, x2: 20, y2: 6 }}
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* Middle line → fades out */}
      <motion.line
        x1="4" y1="12" x2="20" y2="12"
        animate={{ opacity: active ? 0 : 1 }}
        transition={{ duration: dur * 0.5, ease }}
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* Bottom line → second diagonal */}
      <motion.line
        x1="4" y1="18" x2="20" y2="18"
        animate={active ? { x1: 6, y1: 18, x2: 18, y2: 6 } : { x1: 4, y1: 18, x2: 20, y2: 18 }}
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </>
  );
}

function PlayPause({
  active,
  strokeWidth,
  color,
  prefersReduced,
}: {
  active: boolean;
  strokeWidth: number;
  color: string;
  prefersReduced: boolean | null;
}) {
  const dur = prefersReduced ? 0 : 0.28;
  const ease = [0.4, 0, 0.2, 1] as const;
  // Play: filled triangle. Pause: two rectangles.
  // We use paths that share the same number of commands for clean morph.
  return (
    <>
      {/* Left bar / left edge of play */}
      <motion.line
        x1="7" y1="4" x2="7" y2="20"
        animate={active ? { x1: 7, y1: 4, x2: 7, y2: 20 } : { x1: 6, y1: 4, x2: 6, y2: 20, opacity: 0 }}
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={active ? strokeWidth : 0} strokeLinecap="round"
      />
      {/* Right bar / apex of play */}
      <motion.line
        x1="17" y1="4" x2="17" y2="20"
        animate={active ? { x1: 17, y1: 4, x2: 17, y2: 20 } : { x1: 20, y1: 12, x2: 20, y2: 12, opacity: 0 }}
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={active ? strokeWidth : 0} strokeLinecap="round"
      />
      {/* Play triangle polygon, hidden in pause mode */}
      <motion.polygon
        points="6,4 6,20 20,12"
        animate={{ opacity: active ? 0 : 1 }}
        transition={{ duration: dur * 0.6 }}
        fill={color}
      />
    </>
  );
}

function PlusCheck({
  active,
  strokeWidth,
  color,
  prefersReduced,
}: {
  active: boolean;
  strokeWidth: number;
  color: string;
  prefersReduced: boolean | null;
}) {
  const dur = prefersReduced ? 0 : 0.3;
  const ease = [0.22, 1, 0.36, 1] as const;
  return (
    <>
      {/* Vertical arm → disappears for check */}
      <motion.line
        x1="12" y1="5" x2="12" y2="19"
        animate={{ opacity: active ? 0 : 1, scaleY: active ? 0 : 1 }}
        transition={{ duration: dur * 0.5 }}
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        style={{ transformOrigin: "12px 12px" }}
      />
      {/* Horizontal arm → morphs to check short arm */}
      <motion.line
        animate={
          active
            ? { x1: 4, y1: 12, x2: 9, y2: 17 }
            : { x1: 5, y1: 12, x2: 19, y2: 12 }
        }
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
      {/* Check long arm — hidden on plus */}
      <motion.line
        x1="9" y1="17" x2="20" y2="6"
        animate={{ opacity: active ? 1 : 0, pathLength: active ? 1 : 0 }}
        transition={{ duration: dur, ease, delay: active ? 0.08 : 0 }}
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </>
  );
}

function EyeToggle({
  active,
  strokeWidth,
  color,
  prefersReduced,
}: {
  active: boolean;
  strokeWidth: number;
  color: string;
  prefersReduced: boolean | null;
}) {
  const dur = prefersReduced ? 0 : 0.3;
  const ease = [0.4, 0, 0.2, 1] as const;
  return (
    <>
      {/* Outer eye shape */}
      <motion.path
        d="M1 12 C5 5 19 5 23 12 C19 19 5 19 1 12 Z"
        animate={{ opacity: active ? 0.4 : 1 }}
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
      />
      {/* Pupil — shrinks on close */}
      <motion.circle
        cx="12" cy="12"
        animate={{ r: active ? 0 : 3 }}
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={strokeWidth} fill="none"
      />
      {/* Slash — appears when eye closed */}
      <motion.line
        x1="3" y1="3" x2="21" y2="21"
        animate={{ opacity: active ? 1 : 0, pathLength: active ? 1 : 0 }}
        transition={{ duration: dur, ease }}
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </>
  );
}

export function MorphIcon({
  pair,
  active,
  size = 24,
  strokeWidth = 2,
  color = "currentColor",
  className,
  onClick,
  "aria-label": ariaLabel,
}: MorphIconProps) {
  const prefersReduced = useReducedMotion();

  const content = {
    "menu-close": (
      <MenuClose active={active} strokeWidth={strokeWidth} color={color} prefersReduced={prefersReduced} />
    ),
    "play-pause": (
      <PlayPause active={active} strokeWidth={strokeWidth} color={color} prefersReduced={prefersReduced} />
    ),
    "plus-check": (
      <PlusCheck active={active} strokeWidth={strokeWidth} color={color} prefersReduced={prefersReduced} />
    ),
    "eye-toggle": (
      <EyeToggle active={active} strokeWidth={strokeWidth} color={color} prefersReduced={prefersReduced} />
    ),
  }[pair];

  const label = ariaLabel ?? (active ? "active" : "inactive");

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center justify-center cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded",
          className
        )}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {content}
        </svg>
      </button>
    );
  }

  return (
    <span aria-label={label} className={cn("inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {content}
      </svg>
    </span>
  );
}
