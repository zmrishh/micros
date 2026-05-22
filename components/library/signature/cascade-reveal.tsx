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

const CHAR_TRANSITION = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: 0.45,
};

function getStaggerOrder(
  chars: string[],
  direction: CascadeDirection
): number[] {
  if (direction === "ltr") return chars.map((_, i) => i);
  // center-out: characters near center get smallest delay
  const mid = (chars.length - 1) / 2;
  return chars.map((_, i) => Math.abs(i - mid));
}

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

  // Split by word to preserve natural word-spacing, then by char within each word
  const words = text.split(" ");
  const charVariant = CHAR_VARIANTS[variant];

  // Build flat char list for stagger calculation
  const allChars = text.replace(/ /g, "\u00A0").split("");
  const staggerOrder = getStaggerOrder(allChars, direction);
  let charIdx = 0;

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      aria-label={text}
      className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}
    >
      {words.map((word, wIdx) => {
        const wordChars = word.split("");
        return (
          <span key={wIdx} className="inline-flex" aria-hidden="true">
            {wordChars.map((char) => {
              const order = staggerOrder[charIdx];
              charIdx++;
              return (
                <span
                  key={charIdx}
                  className="inline-block overflow-hidden"
                >
                  <motion.span
                    className={cn("inline-block", charClassName)}
                    variants={charVariant}
                    initial="hidden"
                    animate={shouldAnimate ? "visible" : "hidden"}
                    transition={{
                      ...CHAR_TRANSITION,
                      delay: delay + order * stagger,
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
