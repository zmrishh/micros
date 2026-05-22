"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProximityVariant = "glow" | "depth" | "minimal";

interface ProximityCardProps {
  children: React.ReactNode;
  cta?: React.ReactNode;
  activationRadius?: number;
  variant?: ProximityVariant;
  glowColor?: string;
  className?: string;
}

const VARIANT_GLOW: Record<ProximityVariant, string> = {
  glow: "rgba(245,158,11,0.18)",
  depth: "rgba(139,92,246,0.15)",
  minimal: "rgba(255,255,255,0.07)",
};

const SPRING_CONFIG = { stiffness: 120, damping: 18, mass: 0.9 };

export function ProximityCard({
  children,
  cta,
  activationRadius = 180,
  variant = "glow",
  glowColor,
  className,
}: ProximityCardProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const rawGlow = useMotionValue(0);
  const rawScale = useMotionValue(1);
  const ctaOpacity = useMotionValue(0);

  const glowIntensity = useSpring(rawGlow, SPRING_CONFIG);
  const cardScale = useSpring(rawScale, SPRING_CONFIG);

  const [isHovered, setIsHovered] = React.useState(false);

  const resolvedColor = glowColor ?? VARIANT_GLOW[variant];

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (prefersReduced || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();

      // Nearest point on card boundary
      const nearestX = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const nearestY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
      const distance = Math.sqrt(
        (e.clientX - nearestX) ** 2 + (e.clientY - nearestY) ** 2
      );

      const intensity = Math.max(0, 1 - distance / activationRadius);
      rawGlow.set(intensity);

      if (distance === 0) {
        // Cursor is inside card
        setIsHovered(true);
        rawScale.set(1.02);
        ctaOpacity.set(1);
      } else {
        setIsHovered(false);
        rawScale.set(1 + intensity * 0.012);
        ctaOpacity.set(0);
      }
    },
    [prefersReduced, activationRadius, rawGlow, rawScale, ctaOpacity]
  );

  const handleMouseLeave = React.useCallback(() => {
    rawGlow.set(0);
    rawScale.set(1);
    ctaOpacity.set(0);
    setIsHovered(false);
  }, [rawGlow, rawScale, ctaOpacity]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    // Outer container catches mouse events at activation radius
    <div
      ref={containerRef}
      className="relative"
      style={{ padding: prefersReduced ? 0 : activationRadius / 4 }}
    >
      <motion.div
        ref={cardRef}
        style={prefersReduced ? {} : { scale: cardScale }}
        className={cn(
          "relative rounded-2xl border bg-[#111111] overflow-hidden transition-colors duration-300",
          isHovered ? "border-zinc-600" : "border-zinc-800",
          className
        )}
      >
        {/* Glow overlay */}
        {!prefersReduced && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: resolvedColor,
              opacity: glowIntensity,
            }}
          />
        )}

        {children}

        {/* CTA reveal on actual hover */}
        {cta && (
          <motion.div
            style={prefersReduced ? {} : { opacity: ctaOpacity }}
            className={cn(
              "transition-opacity",
              prefersReduced && (isHovered ? "opacity-100" : "opacity-0")
            )}
          >
            {cta}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
