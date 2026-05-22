"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function FloatingInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  disabled,
  className,
}: FloatingInputProps) {
  const [focused, setFocused] = React.useState(false);
  const prefersReduced = useReducedMotion();
  const isFloating = focused || value.length > 0;
  const errorId = `${id}-error`;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "peer h-14 w-full rounded-xl bg-zinc-900 border px-4 pt-5 pb-2 text-sm text-zinc-50",
            "placeholder-transparent",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-500/60 focus:border-red-400"
              : "border-zinc-800 hover:border-zinc-700 focus:border-amber-500/60"
          )}
          placeholder={label}
        />
        <motion.label
          htmlFor={id}
          animate={
            prefersReduced
              ? {}
              : isFloating
              ? { y: -10, scale: 0.78, x: 0 }
              : { y: 0, scale: 1, x: 0 }
          }
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-sm origin-left pointer-events-none transition-colors",
            focused && !error ? "text-amber-400" : error ? "text-red-400" : "text-zinc-500"
          )}
        >
          {label}
        </motion.label>

        {/* Focus ring glow */}
        {focused && !error && (
          <div
            className="absolute inset-0 rounded-xl border border-amber-500/30 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-400 pl-1">
          {error}
        </p>
      )}
    </div>
  );
}
