"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface FluidTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}

export function FluidTabs({
  tabs,
  defaultTab,
  onChange,
  variant = "pill",
  className,
}: FluidTabsProps) {
  const [active, setActive] = React.useState(defaultTab ?? tabs[0]?.id);
  const prefersReduced = useReducedMotion();

  const handleSelect = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      const next = tabs[(index + 1) % tabs.length];
      handleSelect(next.id);
    } else if (e.key === "ArrowLeft") {
      const prev = tabs[(index - 1 + tabs.length) % tabs.length];
      handleSelect(prev.id);
    }
  };

  if (variant === "underline") {
    return (
      <div
        role="tablist"
        aria-label="Navigation tabs"
        className={cn("flex items-center gap-1 border-b border-zinc-800", className)}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            onClick={() => handleSelect(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            tabIndex={active === tab.id ? 0 : -1}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-zinc-950",
              active === tab.id ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.icon && <span className="mr-1.5" aria-hidden="true">{tab.icon}</span>}
            {tab.label}
            {active === tab.id && (
              <motion.div
                layoutId="underline-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 rounded-t-full"
                transition={
                  prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }
                }
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label="Navigation tabs"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 p-1",
        className
      )}
    >
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          id={`tab-${tab.id}`}
          aria-controls={`panel-${tab.id}`}
          onClick={() => handleSelect(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          tabIndex={active === tab.id ? 0 : -1}
          className={cn(
            "relative px-3.5 py-1.5 text-sm font-medium rounded-lg z-10 transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
            active === tab.id ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {active === tab.id && (
            <motion.span
              layoutId="pill-indicator"
              className="absolute inset-0 rounded-lg bg-zinc-800 border border-zinc-700 shadow-sm"
              transition={
                prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }
              }
              aria-hidden="true"
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
