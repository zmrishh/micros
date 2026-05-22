"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  strength?: number;
  children: React.ReactNode;
  variant?: "ghost" | "outline" | "default";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  "aria-label"?: string;
}

const VARIANT_MAP = {
  ghost: "text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800",
  outline: "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 hover:border-zinc-600",
  default: "bg-zinc-800 border border-zinc-700 text-zinc-50 hover:bg-zinc-700",
} as const;

export function MagneticButton({
  strength = 0.4,
  children,
  className,
  variant = "ghost",
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawX.set((e.clientX - (rect.left + rect.width / 2)) * strength);
      rawY.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [prefersReduced, rawX, rawY, strength]
  );

  const handleMouseLeave = React.useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReduced ? {} : { x, y }}
      className="inline-block"
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-lg px-4 h-9 text-sm font-medium transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          VARIANT_MAP[variant],
          className
        )}
      >
        {children}
      </button>
    </motion.div>
  );
}
