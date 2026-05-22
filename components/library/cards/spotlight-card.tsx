"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export function SpotlightCard({
  children,
  spotlightColor = "rgba(245,158,11,0.08)",
  className,
}: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden transition-border-color duration-300",
        "hover:border-zinc-700",
        className
      )}
      style={{
        background: isHovering
          ? `radial-gradient(300px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%), #111111`
          : "#111111",
      }}
    >
      {children}
    </div>
  );
}
