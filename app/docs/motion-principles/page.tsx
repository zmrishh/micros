import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Motion Principles",
  description: "How Feel UI thinks about motion: purposeful, restrained, and performance-first.",
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Motion must answer a question",
    body: "Every animation in Feel UI answers one of seven questions: Did my action work? What is happening? What changed? Where should I look? What can I do next? Can I undo it? Can I trust this result? If the motion doesn't answer one of these, we remove it.",
    tags: ["Purpose", "UX"],
  },
  {
    number: "02",
    title: "Feedback over decoration",
    body: "Animations that communicate state are worth keeping. Animations that exist because they look cool are worth removing. A spinner that shows loading is useful. A border that rotates for no reason is noise.",
    tags: ["Restraint", "Signal"],
  },
  {
    number: "03",
    title: "Continuity, not jump cuts",
    body: "UI should feel spatially continuous. When an element moves from one state to another, it should travel through space, not blink in and out. Framer Motion's layoutId, spring physics, and AnimatePresence make this possible at low cost.",
    tags: ["Continuity", "Space"],
  },
  {
    number: "04",
    title: "Tactile response",
    body: "Buttons should compress when pressed. Cards should lift when hovered. Inputs should react to focus. These are not decorative — they communicate that the interface is listening. Spring physics (stiffness 400–600, damping 25–35) feel closest to real materials.",
    tags: ["Tactile", "Physics"],
  },
  {
    number: "05",
    title: "State transition IS the interaction",
    body: "In premium interfaces, the way a button moves from idle to success is itself the product moment. Don't make state changes snap — let them morph. The user should feel confidence from the quality of the transition.",
    tags: ["State", "Quality"],
  },
  {
    number: "06",
    title: "Restraint by default",
    body: "Every component defaults to subtle. Developers who want more intensity can increase it. The baseline should never make a page feel busy. One well-placed spring > five random fades.",
    tags: ["Restraint", "Default"],
  },
  {
    number: "07",
    title: "Performance is non-negotiable",
    body: "Only animate transform and opacity unless there's a strong reason. Do not animate width, height, margin, or padding directly — use scaleX/scaleY or layout animations. Never run animations on scroll without throttling. Avoid expensive pointer effects on long lists.",
    tags: ["Performance", "GPU"],
  },
  {
    number: "08",
    title: "Respect reduced motion",
    body: "Every component checks useReducedMotion() before running any animation. The reduced-motion path should be functional and readable, not a broken fallback. It is not optional.",
    tags: ["Accessibility", "Motion"],
  },
];

const DO_NOTS = [
  "No infinite spin unless content is loading",
  "No layout-thrashing animations (width, height, margin)",
  "No simultaneous animations on the same element",
  "No motion triggered by scroll unless intentional and throttled",
  "No hover-only actions on touch devices",
  "No animation loops unless they communicate live state",
  "No cartoon easing on UI components (bounce, elastic)",
  "No multiple simultaneous AnimatePresence on the same DOM node",
  "No animations that delay time-to-interactive",
];

const EASING = [
  { name: "Spring: tactile", config: "stiffness: 500, damping: 28, mass: 0.8", use: "Button press, card lift" },
  { name: "Spring: settle", config: "stiffness: 350, damping: 30", use: "Sheet open, modal enter" },
  { name: "Spring: snap", config: "stiffness: 600, damping: 35", use: "Tab indicator, selection halo" },
  { name: "Ease out: content", config: "duration: 0.25, ease: [0.4, 0, 0.2, 1]", use: "Expand, reveal" },
  { name: "Ease in-out: overlap", config: "duration: 0.2, ease: [0.4, 0, 0.6, 1]", use: "Crossfade, morph" },
];

export default function MotionPrinciplesPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div>
        <Badge variant="amber" className="mb-4">Motion Principles</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 mb-3">
          Motion with purpose
        </h1>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          Feel UI has a strong point of view about motion. Every animation earns its
          place by communicating something useful. Here is how we think about it.
        </p>
      </div>

      {/* Principles */}
      <div className="flex flex-col gap-6">
        {PRINCIPLES.map((p) => (
          <div
            key={p.number}
            className="flex gap-5 p-6 rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-colors"
          >
            <span className="text-2xl font-mono font-bold text-zinc-800 flex-shrink-0 leading-none mt-0.5">
              {p.number}
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-semibold text-zinc-100">{p.title}</h2>
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Don'ts */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Rules we never break</h2>
        <ul className="flex flex-col gap-2">
          {DO_NOTS.map((rule) => (
            <li key={rule} className="flex items-start gap-3 text-sm text-zinc-500">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/60 flex-shrink-0" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* Easing guide */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Recommended easing</h2>
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Config</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Use for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-[#111111]">
              {EASING.map((e) => (
                <tr key={e.name}>
                  <td className="px-4 py-3 text-xs font-medium text-zinc-300">{e.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <code className="text-[11px] font-mono text-amber-300/80">{e.config}</code>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{e.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
