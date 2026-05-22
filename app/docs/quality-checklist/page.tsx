import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Quality Checklist",
  description: "The production-readiness checklist every Feel UI component passes before shipping.",
};

type CheckStatus = "required" | "recommended" | "context";

interface CheckItem {
  label: string;
  description: string;
  status: CheckStatus;
}

const SECTIONS: Array<{ title: string; items: CheckItem[] }> = [
  {
    title: "Motion",
    items: [
      { label: "No layout jank", description: "All animations use transform and opacity, not width/height/margin directly.", status: "required" },
      { label: "No inaccessible motion", description: "useReducedMotion() is checked before every animation. The reduced path is functional.", status: "required" },
      { label: "No infinite animation unless meaningful", description: "Loops only run when they communicate real state (live, loading, processing).", status: "required" },
      { label: "No motion without purpose", description: "Each animation answers one of the seven UX questions in Motion Principles.", status: "required" },
      { label: "Spring physics feel natural", description: "Stiffness/damping tuned per interaction type. No cartoon bounce.", status: "recommended" },
      { label: "AnimatePresence used for exits", description: "Leaving elements animate out instead of disappearing.", status: "recommended" },
    ],
  },
  {
    title: "Accessibility",
    items: [
      { label: "Keyboard navigable", description: "All interactive elements reachable and operable with keyboard alone.", status: "required" },
      { label: "Focus visible", description: "Custom focus ring using focus-visible: styles. Never outline: none without replacement.", status: "required" },
      { label: "ARIA attributes correct", description: "aria-expanded, aria-selected, aria-busy, aria-live, aria-label used where needed.", status: "required" },
      { label: "No color-only state", description: "Error/success/warning communicated with icon or text, not just color.", status: "required" },
      { label: "Escape closes overlays", description: "Dialogs, sheets, command palettes close on Escape.", status: "required" },
      { label: "Click outside dismisses modals", description: "Backdrop click closes overlays where expected.", status: "required" },
      { label: "Focus trap in modals", description: "Tab cycles within dialogs and sheets without leaving.", status: "required" },
    ],
  },
  {
    title: "Visual",
    items: [
      { label: "No low-contrast text", description: "All text meets WCAG AA (4.5:1 minimum). zinc-400 on zinc-950 is borderline — test first.", status: "required" },
      { label: "No hover-only critical actions", description: "Actions visible on touch devices. Copy button always present, not just on hover.", status: "required" },
      { label: "Consistent border radius", description: "Cards: rounded-2xl. Inputs: rounded-xl. Buttons: rounded-lg. Pills: rounded-full.", status: "recommended" },
      { label: "Dark mode default", description: "All components designed dark-first. Light mode is opt-in.", status: "recommended" },
    ],
  },
  {
    title: "Code",
    items: [
      { label: "No unused imports", description: "Every import is used. Dead code is removed before merging.", status: "required" },
      { label: "No console logs", description: "All debugging statements removed before release.", status: "required" },
      { label: "TypeScript strict", description: "No implicit any. No type assertions without justification.", status: "required" },
      { label: "Props have clear defaults", description: "Every optional prop has a documented default. No silent magic values.", status: "required" },
      { label: "No hidden project dependencies", description: "Copy-paste code works with only framer-motion, lucide-react, clsx, and tailwind-merge.", status: "required" },
      { label: "forwardRef used where needed", description: "Components that accept refs (inputs, buttons) use React.forwardRef.", status: "recommended" },
    ],
  },
  {
    title: "Mobile",
    items: [
      { label: "No broken mobile states", description: "Test at 375px. Nothing overflows. Touch targets at least 44px.", status: "required" },
      { label: "No hover-only effects on touch", description: "MagneticButton disables on touch. Pointer-reactive components degrade gracefully.", status: "required" },
      { label: "Drag interactions work on iOS", description: "onPointerDown/Up preferred over onMouseDown/Up. Test drag on touch.", status: "recommended" },
    ],
  },
  {
    title: "Copy-paste readiness",
    items: [
      { label: "Self-contained component", description: "No external state management, no context required, no hidden setup.", status: "required" },
      { label: "Imports all resolvable", description: "Every import is from lucide-react, framer-motion, or @/lib/utils.", status: "required" },
      { label: "CSS classes work with Tailwind 4", description: "No custom config required. All classes are standard or in globals.css.", status: "required" },
      { label: "Works without next.js specifically", description: "Components don't use next/navigation, next/image, or server components internally.", status: "context" },
    ],
  },
];

const STATUS_BADGE: Record<CheckStatus, { label: string; class: string }> = {
  required: { label: "Required", class: "bg-red-500/10 border-red-500/20 text-red-400" },
  recommended: { label: "Recommended", class: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  context: { label: "Context", class: "bg-zinc-800 border-zinc-700 text-zinc-500" },
};

export default function QualityChecklistPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Badge variant="amber" className="mb-4">Quality Checklist</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 mb-3">
          Production readiness
        </h1>
        <p className="text-zinc-400 leading-relaxed max-w-2xl">
          Every component in Feel UI passes this checklist before shipping. Use it
          when you copy a component into your project to confirm it meets production
          standards.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {Object.entries(STATUS_BADGE).map(([key, val]) => (
          <span
            key={key}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${val.class}`}
          >
            {val.label}
          </span>
        ))}
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="text-base font-semibold text-zinc-100 mb-4">{section.title}</h2>
          <div className="flex flex-col gap-2">
            {section.items.map((item) => {
              const badge = STATUS_BADGE[item.status];
              return (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-[#111111]"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded flex items-center justify-center border text-[9px] ${badge.class}`}
                      aria-hidden="true"
                    >
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                      <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge.class}`}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Closing note */}
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-6">
        <h2 className="text-sm font-semibold text-zinc-100 mb-2">The final test</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          After checking every box, ask one question:{" "}
          <em className="text-zinc-300 not-italic">
            &ldquo;Would I feel confident shipping this into a $10M product?&rdquo;
          </em>{" "}
          If the answer is no, keep improving. If it is yes, ship it.
        </p>
      </div>
    </div>
  );
}
