"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
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

const EASE = [0.4, 0, 0.2, 1] as const;
const EASE_SPRING = [0.22, 1, 0.36, 1] as const;

// ── MenuClose: 3 lines → X ────────────────────────────────────────────────────

function MenuClose({
  active, sw, color, dur,
}: { active: boolean; sw: number; color: string; dur: number }) {
  return (
    <>
      <motion.line
        initial={false}
        animate={active ? { x1: 6, y1: 6, x2: 18, y2: 18 } : { x1: 4, y1: 6, x2: 20, y2: 6 }}
        transition={{ duration: dur, ease: EASE }}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
      <motion.line
        x1="4" y1="12" x2="20" y2="12"
        initial={false}
        animate={{ opacity: active ? 0 : 1 }}
        transition={{ duration: dur * 0.5, ease: EASE }}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
      <motion.line
        initial={false}
        animate={active ? { x1: 6, y1: 18, x2: 18, y2: 6 } : { x1: 4, y1: 18, x2: 20, y2: 18 }}
        transition={{ duration: dur, ease: EASE }}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
    </>
  );
}

// ── PlayPause: play triangle ↔ pause bars ─────────────────────────────────────
// Uses path-based crossfade so both icons are geometrically independent.

function PlayPause({
  active, sw, color, dur,
}: { active: boolean; sw: number; color: string; dur: number }) {
  return (
    <>
      {/* Play icon */}
      <motion.path
        d="M6 4 L6 20 L20 12 Z"
        fill={color}
        stroke="none"
        initial={false}
        animate={{ opacity: active ? 0 : 1, scale: active ? 0.8 : 1 }}
        transition={{ duration: dur, ease: EASE }}
        style={{ transformOrigin: "13px 12px" }}
      />
      {/* Pause left bar */}
      <motion.line
        x1="7" y1="4" x2="7" y2="20"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: dur, ease: EASE }}
        stroke={color} strokeWidth={sw * 2.2} strokeLinecap="round"
      />
      {/* Pause right bar */}
      <motion.line
        x1="17" y1="4" x2="17" y2="20"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: dur, ease: EASE }}
        stroke={color} strokeWidth={sw * 2.2} strokeLinecap="round"
      />
    </>
  );
}

// ── PlusCheck: plus sign → checkmark ─────────────────────────────────────────

function PlusCheck({
  active, sw, color, dur,
}: { active: boolean; sw: number; color: string; dur: number }) {
  return (
    <>
      {/* Vertical arm → hides for check */}
      <motion.line
        x1="12" y1="5" x2="12" y2="19"
        initial={false}
        animate={{ opacity: active ? 0 : 1 }}
        transition={{ duration: dur * 0.4 }}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
      {/* Horizontal arm → morphs to check short leg */}
      <motion.line
        initial={false}
        animate={active ? { x1: 4, y1: 12, x2: 9, y2: 17 } : { x1: 5, y1: 12, x2: 19, y2: 12 }}
        transition={{ duration: dur, ease: EASE_SPRING }}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
      {/* Check long leg — hidden on plus */}
      <motion.line
        x1="9" y1="17" x2="20" y2="6"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: dur * 0.6, delay: active ? dur * 0.25 : 0 }}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
    </>
  );
}

// ── EyeToggle: open eye ↔ eye-off ────────────────────────────────────────────

function EyeToggle({
  active, sw, color, dur,
}: { active: boolean; sw: number; color: string; dur: number }) {
  return (
    <>
      {/* Outer eye */}
      <motion.path
        d="M1 12 C5 5 19 5 23 12 C19 19 5 19 1 12 Z"
        initial={false}
        animate={{ opacity: active ? 0.3 : 1 }}
        transition={{ duration: dur, ease: EASE }}
        stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round"
      />
      {/* Pupil */}
      <motion.circle
        cx="12" cy="12"
        initial={false}
        animate={{ r: active ? 0 : 3 }}
        transition={{ duration: dur, ease: EASE }}
        stroke={color} strokeWidth={sw} fill="none"
      />
      {/* Slash — visible when eye is closed (active=true) */}
      <motion.line
        x1="3" y1="3" x2="21" y2="21"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: dur * 0.7 }}
        stroke={color} strokeWidth={sw} strokeLinecap="round"
      />
    </>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

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
  const dur = prefersReduced ? 0 : 0.28;

  const sharedProps = { active, sw: strokeWidth, color, dur };

  const content = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {pair === "menu-close" && <MenuClose {...sharedProps} />}
      {pair === "play-pause" && <PlayPause {...sharedProps} />}
      {pair === "plus-check" && <PlusCheck {...sharedProps} />}
      {pair === "eye-toggle" && <EyeToggle {...sharedProps} />}
    </svg>
  );

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
        {content}
      </button>
    );
  }

  return (
    <span
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {content}
    </span>
  );
}
