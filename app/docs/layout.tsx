import type { ReactNode } from "react";
import { Nav } from "@/components/nav";
import { Sidebar } from "@/components/docs/sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-8 pt-8 pb-20">
          {/* Sidebar — desktop only */}
          <aside
            className="hidden lg:block w-56 flex-shrink-0 sticky top-[5.5rem] self-start max-h-[calc(100vh-6.5rem)] overflow-y-auto"
            aria-label="Documentation sidebar"
          >
            <Sidebar />
          </aside>

          {/* Content */}
          <main
            className="flex-1 min-w-0"
            id="main-content"
          >
            <div className="max-w-2xl xl:max-w-3xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
