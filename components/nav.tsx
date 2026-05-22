"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Layers, GitBranch, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/gallery", label: "Gallery" },
] as const;

export function Nav() {
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur-md">
      <nav
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          aria-label="Feel UI home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 group-hover:bg-amber-400 transition-colors">
            <Layers size={14} className="text-zinc-950" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-50">
            Feel UI
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            v1.0
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-1.5 text-sm rounded-lg transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                  isActive
                    ? "text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-zinc-900 border border-zinc-800"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium",
              "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            )}
            aria-label="View on GitHub (opens in new tab)"
          >
            <GitBranch size={14} aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink size={11} className="opacity-50" aria-hidden="true" />
          </Link>

          <Link
            href="/docs"
            className={cn(
              "flex items-center h-8 px-3.5 rounded-lg text-xs font-semibold",
              "bg-amber-500 text-zinc-950 hover:bg-amber-400",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            )}
          >
            Browse
          </Link>
        </div>
      </nav>
    </header>
  );
}
