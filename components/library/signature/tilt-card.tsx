"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

type TiltVariant = "subtle" | "deep" | "flat";

interface TiltCardProps {
  children: React.ReactNode;
  variant?: TiltVariant;
  className?: string;
  glare?: boolean;
}

const TILT_RANGE: Record<TiltVariant, number> = {
  subtle: 8,
  deep: 15,
  flat: 0,
};

const SPRING = { stiffness: 150, damping: 20, mass: 0.8 };

export function TiltCard({
  children,
  variant = "subtle",
  glare = true,
  className,
}: TiltCardProps) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const range = TILT_RANGE[variant];
  const isDisabled = prefersReduced || variant === "flat";

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateX = useSpring(rawX, SPRING);
  const rotateY = useSpring(rawY, SPRING);
  const glareOpacity = useMotionValue(0);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDisabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      rawX.set(-dy * range);
      rawY.set(dx * range);

      // Glare position (percentage)
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
      glareOpacity.set(0.12);
    },
    [isDisabled, range, rawX, rawY, glareX, glareY, glareOpacity]
  );

  const handleMouseLeave = React.useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    glareOpacity.set(0);
  }, [rawX, rawY, glareOpacity]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.25) 0%, transparent 65%)`
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isDisabled ? {} : { perspective: 800 }}
      className={cn("relative", className)}
    >
      <motion.div
        style={isDisabled ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-2xl overflow-hidden"
      >
        {children}

        {/* Glare overlay */}
        {glare && !isDisabled && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              background: glareBackground,
              opacity: glareOpacity,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
