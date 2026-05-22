"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonState = "idle" | "loading" | "success" | "error";

interface LoadingButtonProps {
  state?: ButtonState;
  variant?: "default" | "primary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  successLabel?: string;
  errorLabel?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

const VARIANT_BASE = {
  default: "bg-zinc-800 border border-zinc-700 text-zinc-50 hover:bg-zinc-700 hover:border-zinc-600",
  primary: "bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400",
  outline: "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 hover:border-zinc-600",
  destructive: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
} as const;

const STATE_OVERRIDE: Partial<Record<ButtonState, Record<string, string>>> = {
  success: {
    default: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    primary: "bg-emerald-500 text-white",
    outline: "border-emerald-500/30 text-emerald-400",
    destructive: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  },
  error: {
    default: "bg-red-500/10 border-red-500/30 text-red-400",
    primary: "bg-red-500/15 border border-red-500/30 text-red-400",
    outline: "border-red-500/30 text-red-400",
    destructive: "bg-red-500/20 border-red-500/40 text-red-300",
  },
};

const SIZE_MAP = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
} as const;

function SpinnerIcon({ size }: { size: number }) {
  return <Loader2 size={size} className="animate-spin" aria-hidden="true" />;
}

export function LoadingButton({
  state = "idle",
  variant = "default",
  size = "md",
  children,
  successLabel = "Done",
  errorLabel = "Failed — try again",
  onClick,
  disabled,
  className,
}: LoadingButtonProps) {
  const prefersReduced = useReducedMotion();
  const isDisabled = disabled || state === "loading";
  const iconSize = size === "sm" ? 12 : 14;

  const computedClass = cn(
    "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 cursor-pointer overflow-hidden",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    "disabled:cursor-not-allowed disabled:opacity-50",
    state !== "idle" && state !== "loading"
      ? STATE_OVERRIDE[state]?.[variant]
      : VARIANT_BASE[variant],
    SIZE_MAP[size],
    className
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={state === "loading"}
      aria-live="polite"
      className={computedClass}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "loading" && (
          <motion.span
            key="loading"
            className="flex items-center gap-2"
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <SpinnerIcon size={iconSize} />
            <span>{children}</span>
          </motion.span>
        )}
        {state === "success" && (
          <motion.span
            key="success"
            className="flex items-center gap-2"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.22, type: "spring", stiffness: 400, damping: 20 }}
          >
            <Check size={iconSize} strokeWidth={2.5} aria-hidden="true" />
            <span>{successLabel}</span>
          </motion.span>
        )}
        {state === "error" && (
          <motion.span
            key="error"
            className="flex items-center gap-2"
            initial={prefersReduced ? {} : { opacity: 0, x: -8 }}
            animate={prefersReduced ? { opacity: 1 } : {
              opacity: 1,
              x: [0, -4, 4, -3, 3, 0],
              transition: { opacity: { duration: 0.1 }, x: { duration: 0.35, ease: "easeInOut" } },
            }}
            exit={prefersReduced ? {} : { opacity: 0 }}
          >
            <AlertCircle size={iconSize} aria-hidden="true" />
            <span>{errorLabel}</span>
          </motion.span>
        )}
        {state === "idle" && (
          <motion.span
            key="idle"
            className="flex items-center gap-2"
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
