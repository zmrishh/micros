"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegistryEntry, ComponentCategory } from "@/lib/registry";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface GalleryClientProps {
  registry: RegistryEntry[];
  categories: Record<ComponentCategory, { label: string; description: string }>;
}

export function GalleryClient({ registry, categories }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = (searchParams.get("category") ?? "all") as ComponentCategory | "all";

  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<ComponentCategory | "all">(initialCategory);

  // Update URL on category change
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (query) params.set("q", query);
    const qs = params.toString();
    router.replace(qs ? `/gallery?${qs}` : "/gallery", { scroll: false });
  }, [activeCategory, query, router]);

  const filtered = React.useMemo(() => {
    let result = registry;
    if (activeCategory !== "all") {
      result = result.filter((c) => c.category === activeCategory);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q))
      );
    }
    return result;
  }, [registry, activeCategory, query]);

  const allCategories: { key: ComponentCategory | "all"; label: string }[] = [
    { key: "all", label: "All" },
    ...Object.entries(categories).map(([k, v]) => ({
      key: k as ComponentCategory,
      label: v.label,
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            className="pl-9 h-9"
            aria-label="Search components"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div
          role="listbox"
          aria-label="Filter by category"
          className="flex items-center gap-1.5 flex-wrap"
        >
          {allCategories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "border border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-zinc-600" aria-live="polite" aria-atomic="true">
        {filtered.length === 0
          ? "No components found"
          : `${filtered.length} component${filtered.length !== 1 ? "s" : ""}`}
      </p>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="text-zinc-600 text-sm">No components match your search.</p>
            <button
              type="button"
              onClick={() => { setQuery(""); setActiveCategory("all"); }}
              className="mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((component, i) => (
              <motion.div
                key={component.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                layout
              >
                <GalleryCard component={component} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryCard({ component }: { component: RegistryEntry }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={`/docs/${component.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group flex flex-col rounded-2xl border bg-[#111111] overflow-hidden",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        hovered ? "border-zinc-700 shadow-lg shadow-black/30" : "border-zinc-800"
      )}
      aria-label={`View ${component.name} documentation`}
    >
      {/* Preview area */}
      <div className="relative h-28 flex items-center justify-center bg-[#0d0d0d] overflow-hidden">
        <span className="text-xs text-zinc-700 group-hover:text-zinc-600 transition-colors font-mono">
          {component.name}
        </span>
        {/* Hover hint */}
        <motion.div
          className="absolute top-2.5 right-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ArrowUpRight size={12} className="text-zinc-600" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-50 transition-colors">
            {component.name}
          </h3>
          <Badge variant="default" className="flex-shrink-0 text-zinc-600 border-zinc-800 text-[10px] px-1.5">
            {component.category}
          </Badge>
        </div>
        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
          {component.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {component.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-zinc-700 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
