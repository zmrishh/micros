"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrambleTextProps {
  text: string;
  duration?: number;
  characters?: string;
  trigger?: boolean;
  className?: string;
  triggerOnHover?: boolean;
}

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";

export function ScrambleText({
  text,
  duration = 800,
  characters = DEFAULT_CHARS,
  trigger = true,
  className,
  triggerOnHover = false,
}: ScrambleTextProps) {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = React.useState(text);
  const [hovering, setHovering] = React.useState(false);
  const rafRef = React.useRef<number>(0);

  const scramble = React.useCallback(() => {
    if (prefersReduced) {
      setDisplayed(text);
      return;
    }
    const start = performance.now();
    const totalChars = text.length;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * totalChars);

      const result = text.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < revealedCount) return char;
        return characters[Math.floor(Math.random() * characters.length)];
      });
      setDisplayed(result.join(""));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayed(text);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, duration, characters, prefersReduced]);

  React.useEffect(() => {
    if (triggerOnHover) return;
    if (trigger) scramble();
  }, [trigger, scramble, triggerOnHover]);

  React.useEffect(() => {
    if (!triggerOnHover) return;
    if (hovering) {
      return scramble();
    }
  }, [hovering, triggerOnHover, scramble]);

  // Sync to new text when text prop changes
  React.useEffect(() => {
    setDisplayed(text);
  }, [text]);

  return (
    <span
      className={cn("font-mono", className)}
      aria-label={text}
      onMouseEnter={() => triggerOnHover && setHovering(true)}
      onMouseLeave={() => triggerOnHover && setHovering(false)}
    >
      <span aria-hidden="true">{displayed}</span>
    </span>
  );
}
