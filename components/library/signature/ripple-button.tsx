"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RippleVariant = "default" | "primary" | "ghost" | "outline";

interface RippleEntry {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps {
  children: React.ReactNode;
  variant?: RippleVariant;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
}

const VARIANT_BASE: Record<RippleVariant, string> = {
  default:
    "bg-zinc-800 border border-zinc-700 text-zinc-50 hover:bg-zinc-700 hover:border-zinc-600",
  primary:
    "bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400",
  ghost:
    "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60",
  outline:
    "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 hover:border-zinc-600",
};

const RIPPLE_COLOR: Record<RippleVariant, string> = {
  default: "bg-zinc-500/30",
  primary: "bg-zinc-950/20",
  ghost: "bg-zinc-100/10",
  outline: "bg-zinc-500/20",
};

const SIZE_MAP: Record<string, string> = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "h-10 px-5 text-sm rounded-lg",
  xl: "h-12 px-6 text-base rounded-xl",
};

let rippleIdCounter = 0;

export function RippleButton({
  children,
  variant = "default",
  size = "md",
  onClick,
  disabled,
  type = "button",
  className,
  "aria-label": ariaLabel,
}: RippleButtonProps) {
  const prefersReduced = useReducedMotion();
  const [ripples, setRipples] = React.useState<RippleEntry[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const spawnRipple = React.useCallback(
    (x: number, y: number) => {
      if (prefersReduced || disabled) return;
      const id = ++rippleIdCounter;
      setRipples((prev) => [...prev, { id, x, y }]);
      // Clean up after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    },
    [prefersReduced, disabled]
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
    }
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        spawnRipple(rect.width / 2, rect.height / 2);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-medium overflow-hidden",
        "transition-colors duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_BASE[variant],
        SIZE_MAP[size],
        className
      )}
    >
      {/* Ripple layer */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]" aria-hidden="true">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              className={cn("absolute rounded-full", RIPPLE_COLOR[variant])}
              style={{
                left: r.x,
                top: r.y,
                width: 8,
                height: 8,
                marginLeft: -4,
                marginTop: -4,
                transformOrigin: "center",
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 28, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                scale: {
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                  mass: 0.6,
                },
                opacity: {
                  duration: 0.55,
                  ease: "easeOut",
                  delay: 0.1,
                },
              }}
            />
          ))}
        </AnimatePresence>
      </span>

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
