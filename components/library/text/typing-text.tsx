"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  phrases: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

type Phase = "typing" | "pausing" | "deleting";

export function TypingText({
  phrases,
  typingSpeed = 60,
  deleteSpeed = 30,
  pauseDuration = 2000,
  className,
}: TypingTextProps) {
  const prefersReduced = useReducedMotion();
  const [displayText, setDisplayText] = React.useState("");
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("typing");
  const liveRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (prefersReduced) return;
    const currentPhrase = phrases[phraseIndex];

    if (phase === "typing") {
      if (displayText.length < currentPhrase.length) {
        const t = setTimeout(
          () => setDisplayText(currentPhrase.slice(0, displayText.length + 1)),
          typingSpeed
        );
        return () => clearTimeout(t);
      } else {
        if (liveRef.current) liveRef.current.textContent = currentPhrase;
        const t = setTimeout(() => setPhase("pausing"), pauseDuration);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 0);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayText.length > 0) {
        const t = setTimeout(
          () => setDisplayText(displayText.slice(0, -1)),
          deleteSpeed
        );
        return () => clearTimeout(t);
      } else {
        setPhraseIndex((i) => (i + 1) % phrases.length);
        setPhase("typing");
      }
    }
  }, [
    displayText,
    phase,
    phraseIndex,
    phrases,
    typingSpeed,
    deleteSpeed,
    pauseDuration,
    prefersReduced,
  ]);

  if (prefersReduced) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={cn("inline", className)} aria-live="off">
      <span ref={liveRef} className="sr-only" aria-live="polite" />
      <span aria-hidden="true">
        {displayText}
        <span
          className="animate-cursor-blink inline-block w-[2px] h-[1em] bg-amber-400 ml-0.5 align-text-bottom"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
