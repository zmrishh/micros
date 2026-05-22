# Feel UI

**Copy-paste micro-interactions that make interfaces feel expensive, tactile, and alive.**

Not another component library. A feel layer for modern frontend apps.

---

## What is this?

Feel UI is a collection of **35 production-ready micro-interaction primitives** built for developers who care about how their interfaces *feel* — not just how they look.

Every component answers one of seven questions:

1. Did my action work?
2. What is happening right now?
3. What changed?
4. Where should I look?
5. What can I do next?
6. Can I undo this?
7. Can I trust this result?

If an animation doesn't answer one of those, it doesn't ship.

---

## Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.x (App Router) | Framework, SSG |
| React | 19 | UI |
| TypeScript | 5 | Types |
| Tailwind CSS | v4 | Styling |
| Framer Motion | latest | All animation |
| Lucide React | latest | Icons |
| Radix UI | latest | Headless primitives |

---

## Components

### Actions

| Component | Description |
|---|---|
| `CopyButton` | Icon morph on copy — rotate spring transition between Copy and Check. 3 variants: icon, label, code |
| `LoadingButton` | Full state machine: idle → loading → success → error. Width-locked, morph transitions |
| `PressableButton` | Spring compression with shadow reduction on press. Keyboard support |
| `MagneticButton` | Subtle cursor-following effect. Disabled on touch devices |

### Feedback

| Component | Description |
|---|---|
| `UndoToast` | Real undo flow — item collapses, toast appears with countdown, undo reverses it |
| `StatusPulse` | Breathing dot with pulse ring. States: online, processing, error, offline |
| `SuccessCheck` | SVG checkmark path animation. Embeds in buttons, cards, toasts |
| `ErrorShake` | Restrained correction shake — not cartoon. Inline message reveal + focus recovery |

### Cards

| Component | Description |
|---|---|
| `SpotlightCard` | Pointer-following radial light. Depth, CTA reveal on hover |
| `BorderBeamCard` | **State-driven** orbiting beam. Idle = no animation. Processing = blue. Success = green. Error = red |
| `ShineCard` | Material light sweep on hover only. Not infinite loop |
| `ExpandableCard` | Smooth height + content mask + CTA reveal. Keyboard accessible |

### Text

| Component | Description |
|---|---|
| `TextReveal` | Word-by-word reveal. Use for hero headlines |
| `SmoothNumber` | Spring-animated number. Supports currency, percent, compact. Delta flash on change |
| `TypingText` | Realistic typewriter with cursor, pause, and completion |
| `ScrambleText` | Character scramble that resolves cleanly. Accessibility fallback included |

### Loading

| Component | Description |
|---|---|
| `SkeletonShimmer` | Layout-aware shimmer. Variants: card, text, avatar, dashboard |
| `ProgressBeam` | Determinate + indeterminate states. Communicates real progress |

### Navigation

| Component | Description |
|---|---|
| `FluidTabs` | Sliding pill indicator with layoutId. Content transitions. Keyboard nav |
| `CommandReveal` | Premium command surface — open/close spring, keyboard shortcut hint, search |

### Forms

| Component | Description |
|---|---|
| `FloatingInput` | Floating label with spring motion. Validation state, saved state, icon support |
| `FileDropzone` | Drag glow, file chip insert, progress, success, failure/retry |

### Layout

| Component | Description |
|---|---|
| `BottomSheet` | Mobile-grade. Snap points, drag handle, backdrop, escape close |

### AI

| Component | Description |
|---|---|
| `AIStreamingText` | Character-by-character stream with cursor. Speed control, regenerate state |
| `AgentThinkingIndicator` | 7 named phases: thinking, searching, reading, calling, verifying, composing, done. Compact + expanded |

---

## Signature Interactions

Original interaction primitives invented for Feel UI. You won't find these copy-pasted from another library.

| Component | Real use case |
|---|---|
| `HoldToConfirm` | Hold 700ms to confirm delete/revoke/deploy. Progress fills, resets cleanly on release |
| `IntentButton` | Pass an async `onClick` — button manages idle → loading → success/error automatically |
| `SelectionHalo` | Animated halo moves between selections via Framer `layoutId`. For plans, models, options |
| `SmartCopyBlock` | Premium code block — line hover, syntax tokens, copy morph, terminal variant |
| `AttentionDot` | Tuned pulse rates per severity: live (slow green), warning (medium amber), critical (fast red), resolved (fades to check) |
| `TraceBeam` | State-driven border beam. Idle = static. Processing = blue sweep. Success = green. Error = red |
| `RevealStack` | Items enter from depth with blur-settle. For search results, AI outputs, notifications |
| `MicroTimeline` | Compact step timeline: queued → running → done → failed. For deploys, AI tool calls, uploads |
| `SoftCollapse` | Premium height animation. Variants: card, FAQ, bare |

---

## Copy-paste usage

Every component is a single file. No CLI, no abstraction layer.

**Step 1** — Install the two required packages:

```bash
npm install framer-motion lucide-react
```

**Step 2** — Copy the `cn` utility:

```ts
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```bash
npm install clsx tailwind-merge
```

**Step 3** — Browse a component at `/docs/[slug]`, copy the source, paste into your project.

That's it.

---

## Quick example

```tsx
import { IntentButton } from "@/components/library/signature/intent-button";

// Automatically handles loading → success → error
export function SaveButton() {
  return (
    <IntentButton
      onClick={async () => {
        await saveDocument();
      }}
      successLabel="Saved"
      errorLabel="Failed — retry"
    >
      Save changes
    </IntentButton>
  );
}
```

```tsx
import { HoldToConfirm } from "@/components/library/signature/hold-to-confirm";

// User must hold 700ms — prevents accidental deletes
export function DeleteButton() {
  return (
    <HoldToConfirm
      onConfirm={handleDelete}
      variant="destructive"
      label="Hold to delete"
      holdLabel="Keep holding…"
      successLabel="Deleted"
    />
  );
}
```

```tsx
import { AttentionDot } from "@/components/library/signature/attention-dot";

// Pulse rate communicates urgency
export function StatusBadge() {
  return (
    <>
      <AttentionDot level="live"     label="API connected" />
      <AttentionDot level="warning"  label="High latency" />
      <AttentionDot level="critical" label="Deploy failed" />
      <AttentionDot level="resolved" label="Incident closed" />
    </>
  );
}
```

---

## Design principles

**Motion must answer a question.**
Every animation communicates something — state change, feedback, location, progress. If it doesn't, it's removed.

**Restraint by default.**
Components default to subtle. Intensity can be increased, never assumed.

**Tactile physics.**
Spring curves everywhere. stiffness 400–600, damping 25–35. Buttons compress. Cards lift. Tabs glide.

**Accessibility is non-negotiable.**
`useReducedMotion()` checked before every animation. ARIA attributes, keyboard navigation, and focus management on every interactive component.

**Dark-first.**
Off-black backgrounds, zinc neutrals, amber accent. Premium SaaS/dashboard visual language.

---

## Docs pages

| Page | Path |
|---|---|
| Component overview | `/docs` |
| Individual component | `/docs/[slug]` |
| All components | `/gallery` |
| Motion Principles | `/docs/motion-principles` |
| Quality Checklist | `/docs/quality-checklist` |

---

## Project structure

```
/app
  /(marketing)        Homepage
  /docs               Docs overview
  /docs/[slug]        Component pages (SSG)
  /docs/motion-principles
  /docs/quality-checklist
  /gallery            Searchable component grid

/components
  /ui                 Base primitives (Button, Badge, Card, Input, Tabs)
  /library
    /actions          CopyButton, LoadingButton, PressableButton, MagneticButton
    /feedback         UndoToast, StatusPulse, SuccessCheck, ErrorShake
    /cards            SpotlightCard, BorderBeamCard, ShineCard, ExpandableCard
    /text             TextReveal, SmoothNumber, TypingText, ScrambleText
    /loading          SkeletonShimmer, ProgressBeam
    /navigation       FluidTabs, CommandReveal
    /forms            FloatingInput, FileDropzone
    /layout           BottomSheet
    /ai               AIStreamingText, AgentThinkingIndicator
    /signature        HoldToConfirm, IntentButton, SelectionHalo, SmartCopyBlock,
                      AttentionDot, TraceBeam, RevealStack, MicroTimeline, SoftCollapse
  /docs               Sidebar, CodeBlock, PropsTable, PreviewFrame

/lib
  utils.ts            cn, lerp, clamp, slugify
  registry.ts         Component metadata — source of truth for docs
  code-snippets.ts    Full source strings for copy-paste
```

---

## Standards every component meets

- TypeScript strict — no implicit `any`
- `useReducedMotion()` before every animation
- ARIA attributes where needed
- Keyboard navigable
- Focus visible (custom ring, never `outline: none`)
- No color-only state communication
- Escape closes overlays
- No `console.log` in source
- No unused imports
- Single-file copy-paste (no hidden setup)
- Works with Tailwind 4 out of the box

---

## License

MIT — copy everything, use it in production, ship it in your product.

---

Built with taste. Designed for developers who know the difference.
