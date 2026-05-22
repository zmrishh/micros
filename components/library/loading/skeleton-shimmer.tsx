"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonShimmerProps {
  variant?: "card" | "text" | "avatar" | "table";
  lines?: number;
  className?: string;
}

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-zinc-800",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-zinc-700/50 before:to-transparent",
        "before:animate-shimmer",
        className
      )}
      aria-hidden="true"
    />
  );
}

function CardSkeleton() {
  return (
    <div className="p-5 flex flex-col gap-4">
      <SkeletonBase className="h-36 rounded-xl" />
      <div className="flex flex-col gap-2.5">
        <SkeletonBase className="h-4 w-3/4" />
        <SkeletonBase className="h-3 w-full" />
        <SkeletonBase className="h-3 w-5/6" />
      </div>
      <div className="flex gap-2 pt-1">
        <SkeletonBase className="h-8 w-20 rounded-lg" />
        <SkeletonBase className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

function TextSkeleton({ lines }: { lines: number }) {
  const widths = ["w-full", "w-11/12", "w-4/5", "w-3/4", "w-2/3", "w-1/2"];
  return (
    <div className="p-5 flex flex-col gap-2.5">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBase
          key={i}
          className={cn(
            "h-3.5",
            widths[Math.min(i, widths.length - 1)]
          )}
        />
      ))}
    </div>
  );
}

function AvatarSkeleton() {
  return (
    <div className="p-4 flex items-center gap-3">
      <SkeletonBase className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBase className="h-3.5 w-1/3" />
        <SkeletonBase className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex gap-4 pb-2 border-b border-zinc-800">
        {["w-1/4", "w-1/3", "w-1/4", "w-1/6"].map((w, i) => (
          <SkeletonBase key={i} className={cn("h-3 rounded", w)} />
        ))}
      </div>
      {Array.from({ length: 4 }, (_, row) => (
        <div key={row} className="flex gap-4">
          {["w-1/4", "w-1/3", "w-1/4", "w-1/6"].map((w, i) => (
            <SkeletonBase
              key={i}
              className={cn(
                "h-3 rounded",
                w,
                i === 0 ? "opacity-90" : "opacity-70"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonShimmer({
  variant = "card",
  lines = 3,
  className,
}: SkeletonShimmerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      aria-busy="true"
      className={cn(
        "rounded-2xl border border-zinc-800 bg-[#111111]",
        className
      )}
    >
      {variant === "card" && <CardSkeleton />}
      {variant === "text" && <TextSkeleton lines={lines} />}
      {variant === "avatar" && <AvatarSkeleton />}
      {variant === "table" && <TableSkeleton />}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
