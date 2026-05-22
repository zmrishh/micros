"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AIStreamingTextProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function AIStreamingText({
  text,
  speed = 20,
  showCursor = true,
  onComplete,
  className,
}: AIStreamingTextProps) {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = React.useState("");
  const [done, setDone] = React.useState(false);
  const indexRef = React.useRef(0);

  React.useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    if (prefersReduced) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
      return;
    }

    if (!text) return;

    const interval = setInterval(() => {
      indexRef.current += 1;
      const next = text.slice(0, indexRef.current);
      setDisplayed(next);
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, prefersReduced, onComplete]);

  return (
    <span
      className={cn("inline", className)}
      aria-live="polite"
      aria-atomic="false"
    >
      {displayed}
      {showCursor && !done && (
        <span
          className="animate-cursor-blink inline-block w-[2px] h-[1em] bg-amber-400 ml-0.5 align-text-bottom"
          aria-hidden="true"
        />
      )}
      {showCursor && done && (
        <span
          className="animate-cursor-blink inline-block w-[2px] h-[1em] bg-amber-400/40 ml-0.5 align-text-bottom"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
