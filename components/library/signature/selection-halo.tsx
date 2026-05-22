"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectionOption {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  price?: string;
}

interface SelectionHaloProps {
  options: SelectionOption[];
  defaultSelected?: string;
  onChange?: (id: string) => void;
  layout?: "horizontal" | "grid";
  className?: string;
}

export function SelectionHalo({
  options,
  defaultSelected,
  onChange,
  layout = "horizontal",
  className,
}: SelectionHaloProps) {
  const [selected, setSelected] = React.useState(
    defaultSelected ?? options[0]?.id
  );
  const prefersReduced = useReducedMotion();

  const handleSelect = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <div
      role="radiogroup"
      className={cn(
        "relative flex",
        layout === "grid"
          ? "grid grid-cols-2 gap-3"
          : "flex-row gap-2 flex-wrap",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <div key={opt.id} className="relative">
            {/* Selection halo — moves via layoutId */}
            {isSelected && (
              <motion.div
                layoutId="selection-halo"
                className="absolute inset-0 rounded-xl border border-amber-500/50"
                style={{
                  boxShadow: "0 0 0 1px rgba(245,158,11,0.5), 0 0 14px -2px rgba(245,158,11,0.2)",
                }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 340, damping: 28 }
                }
                aria-hidden="true"
              />
            )}

            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "relative w-full flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                "cursor-pointer",
                isSelected
                  ? "border-transparent bg-zinc-900"
                  : "border-zinc-800 bg-[#111111] hover:border-zinc-700 hover:bg-zinc-900/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isSelected ? "text-zinc-50" : "text-zinc-300"
                  )}
                >
                  {opt.label}
                </span>
                {opt.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                      isSelected
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-500"
                    )}
                  >
                    {opt.badge}
                  </span>
                )}
              </div>
              {opt.description && (
                <span
                  className={cn(
                    "text-xs leading-relaxed transition-colors",
                    isSelected ? "text-zinc-400" : "text-zinc-600"
                  )}
                >
                  {opt.description}
                </span>
              )}
              {opt.price && (
                <span
                  className={cn(
                    "text-xs font-mono transition-colors",
                    isSelected ? "text-amber-400" : "text-zinc-600"
                  )}
                >
                  {opt.price}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
