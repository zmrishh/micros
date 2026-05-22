import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getComponentBySlug, getAllSlugs, CATEGORIES } from "@/lib/registry";
import { CODE_SNIPPETS } from "@/lib/code-snippets";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/docs/props-table";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreviewSection } from "@/components/docs/component-preview-section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) return { title: "Not Found" };
  return {
    title: component.name,
    description: component.description,
  };
}

export default async function ComponentDocPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);
  if (!component) notFound();

  const code = CODE_SNIPPETS[slug] ?? `// Component source: components/library/${component.category}/${slug}.tsx`;
  const category = CATEGORIES[component.category];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="default" className="capitalize">{category.label}</Badge>
          {component.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="capitalize text-zinc-600">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 mb-3">
          {component.name}
        </h1>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">{component.description}</p>
      </div>

      {/* Live Preview */}
      <ComponentPreviewSection slug={slug} />

      {/* Code */}
      <section>
        <h2 className="text-base font-semibold text-zinc-100 mb-3">Code</h2>
        <CodeBlock
          code={code}
          filename={`components/library/${component.category}/${slug}.tsx`}
        />
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-base font-semibold text-zinc-100 mb-3">Usage</h2>
        <CodeBlock code={component.usageExample} language="tsx" />
      </section>

      {/* Props */}
      <section>
        <h2 className="text-base font-semibold text-zinc-100 mb-3">Props</h2>
        <PropsTable props={component.props} />
      </section>

      {/* Variants */}
      {component.variants.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-zinc-100 mb-3">Variants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {component.variants.map((v) => (
              <div
                key={v.name}
                className="rounded-xl border border-zinc-800 bg-[#111111] px-4 py-3"
              >
                <p className="text-sm font-medium text-zinc-200">{v.name}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Accessibility */}
      <section>
        <h2 className="text-base font-semibold text-zinc-100 mb-3">Accessibility</h2>
        <ul className="flex flex-col gap-2">
          {component.accessibilityNotes.map((note) => (
            <li key={note} className="flex items-start gap-2.5 text-sm text-zinc-500">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500/60 flex-shrink-0" aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
