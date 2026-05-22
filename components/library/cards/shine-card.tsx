"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ShineCardProps {
  children: React.ReactNode;
  shineColor?: string;
  className?: string;
}

export function ShineCard({
  children,
  shineColor = "rgba(255,255,255,0.06)",
  className,
}: ShineCardProps) {
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setStyle({
        background: `radial-gradient(circle at ${x}% ${y}%, ${shineColor}, transparent 60%)`,
        opacity: 1,
      });
    },
    [shineColor]
  );

  const handleMouseLeave = React.useCallback(() => {
    setStyle({ opacity: 0 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden",
        "hover:border-zinc-700 transition-colors duration-300",
        className
      )}
    >
      {/* Shine overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
        style={style}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
