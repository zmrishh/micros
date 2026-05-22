"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SlotVariant = "default" | "compact" | "mono-bold";

interface SlotCounterProps {
  value: number;
  /** Padding to ensure a fixed number of digit columns, e.g. 6 → "000042" */
  padStart?: number;
  prefix?: string;
  suffix?: string;
  variant?: SlotVariant;
  /** Stagger delay between digit columns in seconds */
  stagger?: number;
  className?: string;
}

const VARIANT_CLASS: Record<SlotVariant, string> = {
  default: "text-2xl font-semibold tabular-nums text-zinc-50",
  compact: "text-base font-medium tabular-nums text-zinc-50",
  "mono-bold": "text-3xl font-bold font-mono tabular-nums text-zinc-50",
};

const DIGIT_HEIGHT_CLASS: Record<SlotVariant, string> = {
  default: "h-9",
  compact: "h-6",
  "mono-bold": "h-11",
};

/** Single digit column that slots in/out when digit changes */
function DigitColumn({
  digit,
  delay,
  heightClass,
  className,
}: {
  digit: string;
  delay: number;
  heightClass: string;
  className: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden inline-flex items-center", heightClass)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={prefersReduced ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : {
                  y: {
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                    mass: 0.8,
                    delay,
                  },
                  opacity: { duration: 0.12, delay },
                }
          }
          className={cn("inline-block", className)}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function SlotCounter({
  value,
  padStart,
  prefix,
  suffix,
  variant = "default",
  stagger = 0.04,
  className,
}: SlotCounterProps) {
  const digits = String(Math.abs(Math.floor(value))).padStart(padStart ?? 0, "0").split("");
  const isNegative = value < 0;

  return (
    <span
      className={cn("inline-flex items-baseline gap-[1px]", className)}
      aria-label={`${prefix ?? ""}${value}${suffix ?? ""}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {prefix && (
        <span className={cn(VARIANT_CLASS[variant], "mr-0.5")} aria-hidden="true">
          {prefix}
        </span>
      )}
      {isNegative && (
        <span className={cn(VARIANT_CLASS[variant])} aria-hidden="true">
          −
        </span>
      )}
      {digits.map((d, i) => (
        <DigitColumn
          key={i}
          digit={d}
          delay={i * stagger}
          heightClass={DIGIT_HEIGHT_CLASS[variant]}
          className={VARIANT_CLASS[variant]}
        />
      ))}
      {suffix && (
        <span className={cn(VARIANT_CLASS[variant], "ml-0.5")} aria-hidden="true">
          {suffix}
        </span>
      )}
    </span>
  );
}
