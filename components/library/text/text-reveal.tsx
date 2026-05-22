"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function TextReveal({
  children,
  delay = 0,
  stagger = 0.05,
  className,
  as: Tag = "p",
}: TextRevealProps) {
  const prefersReduced = useReducedMotion();
  const words = children.split(" ");

  if (prefersReduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={cn("flex flex-wrap gap-x-[0.25em]", className)} aria-label={children}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * stagger,
            duration: 0.45,
            ease: [0.4, 0, 0.2, 1],
          }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
