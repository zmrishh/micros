import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryClient } from "@/components/gallery/gallery-client";
import { REGISTRY, CATEGORIES } from "@/lib/registry";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Component Gallery",
  description: "Browse all 25 Feel UI micro-interaction components with live previews.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 mb-2">
            Component Gallery
          </h1>
          <p className="text-zinc-500">
            {REGISTRY.length} components across {Object.keys(CATEGORIES).length} categories.
            Click any card to view the full docs.
          </p>
        </div>
        <Suspense fallback={<div className="text-sm text-zinc-600 py-8">Loading gallery...</div>}>
          <GalleryClient registry={REGISTRY} categories={CATEGORIES} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
