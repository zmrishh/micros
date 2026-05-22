"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, BookOpen, Wrench, CheckCircle2, Pen, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentPhase =
  | "thinking"
  | "searching"
  | "reading"
  | "calling"
  | "verifying"
  | "composing"
  | "done";

interface AgentThinkingIndicatorProps {
  phase?: AgentPhase;
  label?: string;
  messages?: string[];
  interval?: number;
  variant?: "compact" | "expanded";
  className?: string;
}

const PHASE_CONFIG: Record<
  AgentPhase,
  { label: string; icon: React.ReactNode; color: string; pulse: boolean }
> = {
  thinking: {
    label: "Thinking",
    icon: null,
    color: "bg-zinc-500",
    pulse: true,
  },
  searching: {
    label: "Searching",
    icon: <Search size={11} aria-hidden="true" />,
    color: "bg-blue-400",
    pulse: true,
  },
  reading: {
    label: "Reading",
    icon: <BookOpen size={11} aria-hidden="true" />,
    color: "bg-violet-400",
    pulse: true,
  },
  calling: {
    label: "Calling tool",
    icon: <Wrench size={11} aria-hidden="true" />,
    color: "bg-amber-400",
    pulse: true,
  },
  verifying: {
    label: "Verifying",
    icon: <Shield size={11} aria-hidden="true" />,
    color: "bg-cyan-400",
    pulse: true,
  },
  composing: {
    label: "Composing",
    icon: <Pen size={11} aria-hidden="true" />,
    color: "bg-amber-400",
    pulse: false,
  },
  done: {
    label: "Done",
    icon: <CheckCircle2 size={11} aria-hidden="true" />,
    color: "bg-emerald-400",
    pulse: false,
  },
};

const STAGGER = [0, 0.12, 0.24];

function ThinkingDots({ prefersReduced }: { prefersReduced: boolean | null }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {STAGGER.map((delay, i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-zinc-500"
          animate={
            prefersReduced
              ? { opacity: 0.5 }
              : { y: [0, -4, 0], opacity: [0.3, 0.9, 0.3] }
          }
          transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function AgentThinkingIndicator({
  phase,
  label,
  messages,
  interval = 2000,
  variant = "compact",
  className,
}: AgentThinkingIndicatorProps) {
  const prefersReduced = useReducedMotion();
  const [msgIdx, setMsgIdx] = React.useState(0);

  React.useEffect(() => {
    if (!messages || messages.length <= 1) return;
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % messages.length), interval);
    return () => clearInterval(t);
  }, [messages, interval]);

  // Auto-cycling through messages mode
  if (messages && !phase) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={messages[msgIdx]}
        className={cn("inline-flex items-center gap-2.5", className)}
      >
        <ThinkingDots prefersReduced={prefersReduced} />
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIdx}
            initial={prefersReduced ? {} : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, x: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="text-sm text-zinc-500"
          >
            {messages[msgIdx]}
          </motion.span>
        </AnimatePresence>
      </div>
    );
  }

  const currentPhase = phase ?? "thinking";
  const config = PHASE_CONFIG[currentPhase];
  const displayLabel = label ?? config.label;

  if (variant === "compact") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={displayLabel}
        className={cn("inline-flex items-center gap-2", className)}
      >
        {currentPhase === "thinking" ? (
          <ThinkingDots prefersReduced={prefersReduced} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex items-center justify-center"
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
              {config.pulse && !prefersReduced && (
                <motion.span
                  className={cn("absolute h-1.5 w-1.5 rounded-full", config.color)}
                  animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPhase}
            className="text-sm text-zinc-500 flex items-center gap-1.5"
            initial={prefersReduced ? {} : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {config.icon && <span className="text-zinc-600">{config.icon}</span>}
            {displayLabel}
          </motion.span>
        </AnimatePresence>
      </div>
    );
  }

  // Expanded variant
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5",
        className
      )}
    >
      {currentPhase === "thinking" ? (
        <ThinkingDots prefersReduced={prefersReduced} />
      ) : (
        <motion.div
          key={currentPhase}
          initial={prefersReduced ? {} : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "h-6 w-6 rounded-lg flex items-center justify-center text-zinc-900",
            config.color === "bg-zinc-500" ? "bg-zinc-600" : config.color
          )}
          aria-hidden="true"
        >
          {config.icon}
        </motion.div>
      )}
      <div className="flex flex-col gap-0.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPhase}
            className="text-xs font-medium text-zinc-200"
            initial={prefersReduced ? {} : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -3 }}
            transition={{ duration: 0.18 }}
          >
            {displayLabel}
          </motion.span>
        </AnimatePresence>
        {messages && (
          <AnimatePresence mode="wait">
            <motion.span
              key={msgIdx}
              className="text-xs text-zinc-600 max-w-[200px] truncate"
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReduced ? {} : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {messages[msgIdx]}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
