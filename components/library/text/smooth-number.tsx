"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type NumberFormat = "integer" | "currency" | "percent" | "compact";

interface SmoothNumberProps {
  value: number;
  format?: NumberFormat;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  flash?: boolean;
  className?: string;
}

function formatNumber(
  value: number,
  format: NumberFormat,
  decimals: number,
  prefix: string,
  suffix: string,
  locale: string
): string {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "decimal",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    case "percent":
      return value.toFixed(decimals);
    case "compact":
      if (Math.abs(value) >= 1_000_000)
        return `${(value / 1_000_000).toFixed(1)}M`;
      if (Math.abs(value) >= 1_000)
        return `${(value / 1_000).toFixed(1)}K`;
      return value.toFixed(decimals);
    default:
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
  }
}

export function SmoothNumber({
  value,
  format = "integer",
  prefix = "",
  suffix = "",
  decimals = 0,
  locale = "en-US",
  flash = false,
  className,
}: SmoothNumberProps) {
  const prefersReduced = useReducedMotion();
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, {
    stiffness: prefersReduced ? 10000 : 80,
    damping: prefersReduced ? 100 : 28,
    mass: 0.8,
  });

  const [display, setDisplay] = React.useState(() =>
    formatNumber(value, format, decimals, prefix, suffix, locale)
  );
  const [flashState, setFlashState] = React.useState<"up" | "down" | null>(null);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    if (flash && !prefersReduced) {
      if (value > prevValue.current) setFlashState("up");
      else if (value < prevValue.current) setFlashState("down");
      const t = setTimeout(() => setFlashState(null), 800);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value, flash, prefersReduced]);

  React.useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  React.useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(formatNumber(v, format, decimals, prefix, suffix, locale));
    });
    return unsub;
  }, [spring, format, decimals, prefix, suffix, locale]);

  const flashColor =
    flashState === "up"
      ? "text-emerald-400"
      : flashState === "down"
      ? "text-red-400"
      : "";

  return (
    <span
      className={cn(
        "tabular-nums inline-block transition-colors duration-500",
        flashColor,
        className
      )}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}
    >
      <span aria-hidden="true">
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  );
}
