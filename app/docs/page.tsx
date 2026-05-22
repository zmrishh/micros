import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { REGISTRY, CATEGORIES, type ComponentCategory } from "@/lib/registry";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Explore 25 premium micro-interaction components across 9 categories.",
};

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <Badge variant="amber" className="mb-4">Documentation</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 mb-3">
          Feel UI Components
        </h1>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          25 copy-paste micro-interaction primitives across 9 categories. Each
          component is fully typed, accessible, and includes reduced-motion
          support. Browse by category below or use the sidebar to jump to a
          specific component.
        </p>
      </div>

      {/* Quick start */}
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
        <h2 className="text-base font-semibold text-zinc-100 mb-1">Quick start</h2>
        <p className="text-sm text-zinc-500 mb-4">
          Feel UI is copy-paste first. No npm install required — just copy the
          component source and drop it in your project. Make sure you have these
          dependencies installed:
        </p>
        <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-zinc-400">
          <p className="text-zinc-600 mb-1"># Install peer dependencies</p>
          <p>npm install framer-motion lucide-react clsx tailwind-merge class-variance-authority</p>
        </div>
        <p className="text-sm text-zinc-600 mt-4">
          Then copy any component from its docs page and paste it into{" "}
          <code className="text-amber-400 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5">
            components/library/
          </code>
          .
        </p>
      </div>

      {/* Categories */}
      {(Object.entries(CATEGORIES) as [ComponentCategory, { label: string; description: string }][]).map(
        ([cat, meta]) => {
          const components = REGISTRY.filter((c) => c.category === cat);
          return (
            <div key={cat}>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-100">{meta.label}</h2>
                <span className="text-xs text-zinc-600">
                  {components.length} component{components.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {components.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/docs/${c.slug}`}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-[#111111] p-4 hover:border-zinc-700 hover:bg-zinc-900/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors">
                        {c.name}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="flex-shrink-0 text-zinc-700 group-hover:text-zinc-400 transition-colors mt-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
