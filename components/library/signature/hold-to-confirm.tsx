"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoldState = "idle" | "holding" | "confirming" | "success" | "cancelled";

interface HoldToConfirmProps {
  onConfirm: () => void | Promise<void>;
  holdDuration?: number;
  label?: string;
  holdLabel?: string;
  successLabel?: string;
  variant?: "destructive" | "primary" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

const VARIANT_CONFIG = {
  destructive: {
    idle: "border border-red-500/25 bg-red-500/8 text-red-400 hover:bg-red-500/15 hover:border-red-500/40",
    holding: "border border-red-500/50 bg-red-500/15 text-red-300",
    success: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    fill: "bg-red-500/25",
  },
  primary: {
    idle: "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50",
    holding: "border border-amber-500/60 bg-amber-500/20 text-amber-300",
    success: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    fill: "bg-amber-500/30",
  },
  default: {
    idle: "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600",
    holding: "border border-zinc-600 bg-zinc-800 text-zinc-100",
    success: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    fill: "bg-zinc-700",
  },
} as const;

const SIZE_MAP = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "h-10 px-5 text-sm rounded-lg",
} as const;

export function HoldToConfirm({
  onConfirm,
  holdDuration = 700,
  label = "Hold to delete",
  holdLabel = "Keep holding…",
  successLabel = "Confirmed",
  variant = "destructive",
  size = "md",
  className,
  disabled,
}: HoldToConfirmProps) {
  const prefersReduced = useReducedMotion();
  const [holdState, setHoldState] = React.useState<HoldState>("idle");
  const [fillPercent, setFillPercent] = React.useState(0);
  const startRef = React.useRef<number>(0);
  const rafRef = React.useRef<number>(0);
  const isHolding = React.useRef(false);

  const config = VARIANT_CONFIG[variant];
  const isDisabled = disabled || holdState === "confirming" || holdState === "success";

  const startHold = React.useCallback(() => {
    if (isDisabled) return;
    if (prefersReduced) {
      // Reduced motion: instant confirm
      setHoldState("success");
      void Promise.resolve(onConfirm());
      setTimeout(() => setHoldState("idle"), 1500);
      return;
    }
    isHolding.current = true;
    startRef.current = performance.now();
    setHoldState("holding");

    const tick = (now: number) => {
      if (!isHolding.current) return;
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / holdDuration) * 100, 100);
      setFillPercent(pct);

      if (pct >= 100) {
        isHolding.current = false;
        setHoldState("confirming");
        setFillPercent(100);
        const result = onConfirm();
        Promise.resolve(result).then(() => {
          setHoldState("success");
          setTimeout(() => {
            setHoldState("idle");
            setFillPercent(0);
          }, 1500);
        });
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [holdDuration, onConfirm, isDisabled, prefersReduced]);

  const cancelHold = React.useCallback(() => {
    if (!isHolding.current) return;
    isHolding.current = false;
    cancelAnimationFrame(rafRef.current);
    setHoldState("idle");
    setFillPercent(0);
  }, []);

  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const displayState = holdState === "idle" ? "idle" :
    holdState === "success" ? "success" : "holding";

  return (
    <button
      type="button"
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      disabled={isDisabled}
      aria-label={holdState === "holding" ? holdLabel : label}
      aria-pressed={holdState === "holding"}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-medium overflow-hidden transition-colors duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "disabled:cursor-not-allowed",
        displayState === "success" ? config.success :
        displayState === "holding" ? config.holding : config.idle,
        SIZE_MAP[size],
        className
      )}
    >
      {/* Fill progress */}
      {!prefersReduced && (
        <motion.span
          className={cn("absolute inset-0 rounded-[inherit] origin-left", config.fill)}
          style={{ scaleX: fillPercent / 100, transformOrigin: "left" }}
          aria-hidden="true"
        />
      )}

      {/* Label */}
      <AnimatePresence mode="wait" initial={false}>
        {holdState === "success" ? (
          <motion.span key="success" className="relative z-10 flex items-center gap-1.5"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 20 }}
          >
            {successLabel}
          </motion.span>
        ) : holdState === "holding" || holdState === "confirming" ? (
          <motion.span key="holding" className="relative z-10"
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {holdLabel}
          </motion.span>
        ) : (
          <motion.span key="idle" className="relative z-10"
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
