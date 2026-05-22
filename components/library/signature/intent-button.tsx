"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type IntentState = "idle" | "loading" | "success" | "error";

interface IntentButtonProps {
  /**
   * Pass an async function — the button manages loading/success/error automatically.
   * Or pass a sync function + control state externally via `state`.
   */
  onClick?: () => void | Promise<void>;
  state?: IntentState;
  variant?: "primary" | "default" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  successLabel?: string;
  errorLabel?: string;
  successDuration?: number;
  errorDuration?: number;
  disabled?: boolean;
  className?: string;
}

const VARIANT = {
  primary: {
    idle: "bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 shadow-sm",
    loading: "bg-amber-500/80 text-zinc-950 cursor-wait",
    success: "bg-emerald-500 text-white",
    error: "bg-red-500/15 border border-red-500/30 text-red-300",
  },
  default: {
    idle: "bg-zinc-800 border border-zinc-700 text-zinc-50 hover:bg-zinc-700 hover:border-zinc-600",
    loading: "bg-zinc-800 border border-zinc-700 text-zinc-400 cursor-wait",
    success: "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
    error: "bg-red-500/10 border border-red-500/20 text-red-400",
  },
  outline: {
    idle: "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600",
    loading: "border border-zinc-700 text-zinc-500 cursor-wait",
    success: "border border-emerald-500/30 text-emerald-400",
    error: "border border-red-500/30 text-red-400",
  },
} as const;

const SIZE = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "h-10 px-5 text-sm rounded-lg",
  xl: "h-12 px-6 text-base rounded-xl",
} as const;

export function IntentButton({
  onClick,
  state: externalState,
  variant = "primary",
  size = "md",
  children,
  successLabel = "Done",
  errorLabel = "Try again",
  successDuration = 1800,
  errorDuration = 2500,
  disabled,
  className,
}: IntentButtonProps) {
  const prefersReduced = useReducedMotion();
  const [internalState, setInternalState] = React.useState<IntentState>("idle");
  const state = externalState ?? internalState;
  const isDisabled = disabled || state === "loading";

  const handleClick = async () => {
    if (!onClick || isDisabled) return;
    if (externalState) { onClick(); return; }

    setInternalState("loading");
    try {
      await onClick();
      setInternalState("success");
      setTimeout(() => setInternalState("idle"), successDuration);
    } catch {
      setInternalState("error");
      setTimeout(() => setInternalState("idle"), errorDuration);
    }
  };

  const v = VARIANT[variant];
  const stateClass = v[state];

  const iconSize = size === "sm" ? 12 : size === "xl" ? 16 : 14;

  return (
    <motion.span
      className="inline-block"
      whileHover={
        prefersReduced || state !== "idle" ? {} : { scale: 1.02 }
      }
      whileTap={prefersReduced ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 26, mass: 0.7 }}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        aria-busy={state === "loading"}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium overflow-hidden",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          "disabled:cursor-not-allowed",
          stateClass,
          SIZE[size],
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "loading" && (
            <motion.span key="loading" className="flex items-center gap-2"
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
            >
              <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />
              <span>{children}</span>
            </motion.span>
          )}
          {state === "success" && (
            <motion.span key="success" className="flex items-center gap-2"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.22, type: "spring", stiffness: 500, damping: 22 }}
            >
              <Check size={iconSize} strokeWidth={2.5} aria-hidden="true" />
              <span>{successLabel}</span>
            </motion.span>
          )}
          {state === "error" && (
            <motion.span key="error" className="flex items-center gap-2"
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={
                prefersReduced
                  ? { opacity: 1 }
                  : { opacity: 1, x: [0, -5, 5, -4, 4, -2, 2, 0] }
              }
              transition={{
                opacity: { duration: 0.1 },
                x: { duration: 0.38, ease: "easeInOut" },
              }}
              exit={prefersReduced ? {} : { opacity: 0 }}
            >
              <AlertCircle size={iconSize} aria-hidden="true" />
              <span>{errorLabel}</span>
            </motion.span>
          )}
          {state === "idle" && (
            <motion.span key="idle"
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.span>
  );
}
