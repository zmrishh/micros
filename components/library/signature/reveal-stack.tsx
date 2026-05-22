"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealStackItem {
  id: string;
  content: React.ReactNode;
}

interface RevealStackProps {
  items: RevealStackItem[];
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
}

export function RevealStack({
  items,
  staggerDelay = 0.07,
  className,
  itemClassName,
}: RevealStackProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className={cn("flex flex-col gap-2", className)} role="list">
      <AnimatePresence initial={true}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            role="listitem"
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.97, filter: "blur(2px)" }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: -6, scale: 0.97 }
            }
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    delay: i * staggerDelay,
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            className={cn(itemClassName)}
          >
            {item.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
