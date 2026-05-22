import { cn } from "@/lib/utils";
import type { PropDef } from "@/lib/registry";

interface PropsTableProps {
  props: PropDef[];
  className?: string;
}

export function PropsTable({ props, className }: PropsTableProps) {
  if (props.length === 0) {
    return <p className="text-sm text-zinc-600">No props defined.</p>;
  }

  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-zinc-800", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Prop
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">
              Default
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60 bg-[#111111]">
          {props.map((prop) => (
            <tr key={prop.name} className="hover:bg-zinc-900/40 transition-colors">
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-xs text-zinc-200">
                  {prop.name}
                  {prop.required && (
                    <span className="text-amber-500 ml-0.5" title="Required">
                      *
                    </span>
                  )}
                </code>
              </td>
              <td className="px-4 py-3 align-top">
                <code className="font-mono text-xs text-sky-400/80 whitespace-nowrap">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3 align-top hidden sm:table-cell">
                {prop.default ? (
                  <code className="font-mono text-xs text-amber-300/80">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-zinc-700 text-xs">—</span>
                )}
              </td>
              <td className="px-4 py-3 align-top hidden md:table-cell">
                <span className="text-zinc-500 text-xs leading-relaxed">
                  {prop.description}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
