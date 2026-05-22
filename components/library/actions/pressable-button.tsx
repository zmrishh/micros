"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PressableButtonProps {
  variant?: "primary" | "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

const VARIANT_MAP = {
  primary:
    "bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400",
  default:
    "bg-zinc-800 text-zinc-50 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600",
  outline:
    "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 hover:border-zinc-600",
  ghost:
    "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60",
} as const;

const SIZE_MAP = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "h-10 px-5 text-sm rounded-lg",
  xl: "h-12 px-6 text-base rounded-xl",
} as const;

export function PressableButton({
  variant = "primary",
  size = "md",
  children,
  className,
  onClick,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
}: PressableButtonProps) {
  const prefersReduced = useReducedMotion();
  const [pressed, setPressed] = React.useState(false);

  // Keyboard press support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") setPressed(true);
  };
  const handleKeyUp = () => setPressed(false);

  return (
    <motion.span
      className="inline-block"
      animate={
        prefersReduced
          ? {}
          : pressed
          ? { scale: 0.94 }
          : { scale: 1 }
      }
      whileHover={prefersReduced ? {} : { scale: 1.025 }}
      whileTap={prefersReduced ? {} : { scale: 0.94 }}
      transition={{
        type: "spring",
        stiffness: 550,
        damping: 26,
        mass: 0.7,
      }}
    >
      <button
        type={type}
        onClick={onClick}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          VARIANT_MAP[variant],
          SIZE_MAP[size],
          className
        )}
      >
        {children}
      </button>
    </motion.span>
  );
}
