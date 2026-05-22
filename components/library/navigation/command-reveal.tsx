"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Command, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandRevealProps {
  items: CommandItem[];
  placeholder?: string;
  trigger?: "keyboard" | "button" | "both";
  className?: string;
}

export function CommandReveal({
  items,
  placeholder = "Search commands...",
  trigger = "both",
  className,
}: CommandRevealProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const prefersReduced = useReducedMotion();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [query, items]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const openPalette = React.useCallback(() => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  React.useEffect(() => {
    if (trigger === "button") return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? close() : openPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close, openPalette, trigger]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      close();
    }
  };

  return (
    <>
      {(trigger === "button" || trigger === "both") && (
        <button
          type="button"
          onClick={openPalette}
          className={cn(
            "inline-flex items-center gap-2 h-9 px-3 rounded-lg text-sm",
            "bg-zinc-900 border border-zinc-800 text-zinc-500",
            "hover:border-zinc-700 hover:text-zinc-300 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
            className
          )}
          aria-label="Open command palette"
        >
          <Search size={14} aria-hidden="true" />
          <span>Search</span>
          <span className="ml-1 flex items-center gap-0.5 text-xs text-zinc-600">
            <Command size={11} aria-hidden="true" />
            <span>K</span>
          </span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.15 }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              onKeyDown={handleKeyDown}
            >
              <div className="rounded-2xl border border-zinc-700 bg-zinc-950/95 shadow-2xl shadow-black/60 overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <Search size={16} className="text-zinc-500 flex-shrink-0" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                    aria-label="Search commands"
                    aria-activedescendant={filtered[selectedIndex] ? `cmd-item-${filtered[selectedIndex].id}` : undefined}
                    aria-autocomplete="list"
                    aria-controls="cmd-list"
                    role="combobox"
                    aria-expanded="true"
                  />
                  <button
                    type="button"
                    onClick={close}
                    className="text-zinc-600 hover:text-zinc-300 transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                    aria-label="Close command palette"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Results */}
                <ul
                  ref={listRef}
                  id="cmd-list"
                  role="listbox"
                  aria-label="Command results"
                  className="max-h-72 overflow-y-auto py-2"
                >
                  {filtered.length === 0 ? (
                    <li className="px-4 py-8 text-center text-sm text-zinc-600">
                      No commands found
                    </li>
                  ) : (
                    filtered.map((item, i) => (
                      <li
                        key={item.id}
                        id={`cmd-item-${item.id}`}
                        role="option"
                        aria-selected={i === selectedIndex}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                          i === selectedIndex
                            ? "bg-amber-500/10 text-zinc-50"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        )}
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => {
                          item.action();
                          close();
                        }}
                      >
                        {item.icon && (
                          <span
                            className={cn(
                              "flex-shrink-0",
                              i === selectedIndex ? "text-amber-400" : "text-zinc-600"
                            )}
                            aria-hidden="true"
                          >
                            {item.icon}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-zinc-600 truncate">{item.description}</div>
                          )}
                        </div>
                        {item.shortcut && (
                          <kbd className="text-xs text-zinc-600 font-mono bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded">
                            {item.shortcut}
                          </kbd>
                        )}
                      </li>
                    ))
                  )}
                </ul>

                {/* Footer hint */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800">
                  <span className="text-xs text-zinc-700">
                    {filtered.length} command{filtered.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-zinc-700">
                    ↵ select · ↑↓ navigate · esc close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
