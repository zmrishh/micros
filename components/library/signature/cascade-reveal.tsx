"use client";

import * as React from "react";
import { motion, useReducedMotion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type CascadeVariant = "blur-in" | "slide-up" | "scale-in";
type CascadeDirection = "ltr" | "center-out";
type CascadeTrigger = "mount" | "visible";

interface CascadeRevealProps {
  text: string;
  variant?: CascadeVariant;
  direction?: CascadeDirection;
  stagger?: number;
  delay?: number;
  trigger?: CascadeTrigger;
  className?: string;
  charClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const CHAR_VARIANTS: Record<CascadeVariant, Variants> = {
  "blur-in": {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.7, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
};

const CHAR_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function CascadeReveal({
  text,
  variant = "blur-in",
  direction = "ltr",
  stagger = 0.025,
  delay = 0,
  trigger = "mount",
  className,
  charClassName,
  as: Tag = "span",
}: CascadeRevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-5%",
  });

  const shouldAnimate = trigger === "mount" || (trigger === "visible" && isInView);
  const charVariant = CHAR_VARIANTS[variant];

  // Build flat list of chars excluding spaces for clean stagger indexing
  const words = text.split(" ");
  const totalNonSpaceChars = words.reduce((sum, w) => sum + w.length, 0);

  function getDelay(flatCharIndex: number): number {
    if (direction === "ltr") return delay + flatCharIndex * stagger;
    const mid = (totalNonSpaceChars - 1) / 2;
    return delay + Math.abs(flatCharIndex - mid) * stagger;
  }

  let flatIndex = 0;

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      aria-label={text}
      className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex" aria-hidden="true">
          {word.split("").map((char, cIdx) => {
            const d = getDelay(flatIndex);
            flatIndex++;
            return (
              <span key={cIdx} className="inline-block overflow-hidden">
                <motion.span
                  className={cn("inline-block", charClassName)}
                  variants={charVariant}
                  initial="hidden"
                  animate={shouldAnimate ? "visible" : "hidden"}
                  transition={{ ease: CHAR_EASE, duration: 0.45, delay: d }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
