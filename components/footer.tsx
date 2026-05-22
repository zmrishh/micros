import Link from "next/link";
import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 group-hover:bg-amber-400 transition-colors">
                <Layers size={14} className="text-zinc-950" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold text-zinc-50">Feel UI</span>
            </Link>
            <p className="text-sm text-zinc-600 max-w-xs">
              Copy-paste micro-interactions that make any frontend feel premium.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              {[
                { href: "/docs", label: "Documentation" },
                { href: "/gallery", label: "Gallery" },
                { href: "https://github.com", label: "GitHub", external: true },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} Feel UI. Built for developers who care about feel.
          </p>
          <p className="text-xs text-zinc-700">
            MIT License — free to use and copy.
          </p>
        </div>
      </div>
    </footer>
  );
}
