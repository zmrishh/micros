"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { REGISTRY, CATEGORIES, type ComponentCategory } from "@/lib/registry";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname() ?? "";
  const [expanded, setExpanded] = React.useState<ComponentCategory[]>(
    Object.keys(CATEGORIES) as ComponentCategory[]
  );

  const toggle = (cat: ComponentCategory) => {
    setExpanded((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <nav
      className={cn("flex flex-col gap-0.5", className)}
      aria-label="Documentation navigation"
    >
      {/* Overview */}
      <Link
        href="/docs"
        className={cn(
          "flex items-center h-8 px-3 rounded-lg text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
          pathname === "/docs"
            ? "bg-zinc-800 text-zinc-50 font-medium"
            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
        )}
        aria-current={pathname === "/docs" ? "page" : undefined}
      >
        Overview
      </Link>

      {/* Static pages */}
      {[
        { href: "/docs/motion-principles", label: "Motion Principles" },
        { href: "/docs/quality-checklist", label: "Quality Checklist" },
      ].map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center h-8 px-3 rounded-lg text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
            pathname === link.href
              ? "bg-zinc-800 text-zinc-50 font-medium"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
          )}
        >
          {link.label}
        </Link>
      ))}

      <div className="h-px bg-zinc-800 my-2" />

      {/* Categories */}
      {(Object.entries(CATEGORIES) as [ComponentCategory, { label: string; description: string }][]).map(
        ([cat, meta]) => {
          const items = REGISTRY.filter((c) => c.category === cat);
          const isOpen = expanded.includes(cat);

          return (
            <div key={cat}>
              <button
                type="button"
                onClick={() => toggle(cat)}
                aria-expanded={isOpen}
                className={cn(
                  "w-full flex items-center justify-between h-8 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                  "text-zinc-600 hover:text-zinc-400"
                )}
              >
                <span>{meta.label}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-zinc-700"
                  aria-hidden="true"
                >
                  <ChevronDown size={12} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    {items.map((item) => {
                      const href = `/docs/${item.slug}`;
                      const isActive = pathname === href;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={href}
                            className={cn(
                              "flex items-center h-8 pl-5 pr-3 rounded-lg text-sm transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                              isActive
                                ? "bg-amber-500/10 text-amber-400 font-medium"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                            )}
                          >
                            {isActive && (
                              <span
                                className="absolute left-0 w-[2px] h-5 bg-amber-500 rounded-r-full"
                                aria-hidden="true"
                              />
                            )}
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        }
      )}
    </nav>
  );
}
