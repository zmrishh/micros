"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ErrorShakeProps {
  error: boolean;
  children: React.ReactNode;
  onAnimationComplete?: () => void;
  className?: string;
}

const SHAKE_KEYFRAMES = [0, -6, 6, -5, 5, -3, 3, 0];

export function ErrorShake({
  error,
  children,
  onAnimationComplete,
  className,
}: ErrorShakeProps) {
  const prefersReduced = useReducedMotion();
  const [key, setKey] = React.useState(0);

  const prevError = React.useRef(false);
  React.useEffect(() => {
    if (error && !prevError.current) {
      setKey((k) => k + 1);
    }
    prevError.current = error;
  }, [error]);

  return (
    <motion.div
      key={key}
      animate={
        prefersReduced || !error
          ? { x: 0 }
          : {
              x: SHAKE_KEYFRAMES,
              transition: {
                duration: 0.5,
                ease: "easeInOut",
              },
            }
      }
      onAnimationComplete={onAnimationComplete}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
