import type { ComponentType } from "react";

export type ComponentCategory =
  | "actions"
  | "feedback"
  | "cards"
  | "text"
  | "loading"
  | "navigation"
  | "forms"
  | "layout"
  | "ai"
  | "signature";

export type ComponentTag =
  | "button"
  | "card"
  | "text"
  | "form"
  | "loading"
  | "navigation"
  | "ai"
  | "feedback"
  | "motion"
  | "dashboard"
  | "mobile"
  | "signature"
  | "status"
  | "selection";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ComponentVariant {
  name: string;
  description: string;
  props?: Record<string, unknown>;
}

export interface RegistryEntry {
  name: string;
  slug: string;
  category: ComponentCategory;
  description: string;
  tags: ComponentTag[];
  props: PropDef[];
  variants: ComponentVariant[];
  accessibilityNotes: string[];
  usageExample: string;
  // Preview component ref — injected after all components are loaded
  Preview?: ComponentType;
}

export const CATEGORIES: Record<ComponentCategory, { label: string; description: string }> = {
  signature: {
    label: "Signature",
    description: "Original interactions that make Feel UI different from every other library",
  },
  actions: {
    label: "Actions",
    description: "Buttons and interactive controls that feel tactile",
  },
  feedback: {
    label: "Feedback",
    description: "Status indicators, toasts, and response states",
  },
  cards: {
    label: "Cards",
    description: "Surface components with premium hover interactions",
  },
  text: {
    label: "Text",
    description: "Animated typography and text reveal effects",
  },
  loading: {
    label: "Loading",
    description: "Skeleton screens and progress indicators",
  },
  navigation: {
    label: "Navigation",
    description: "Tabs, command palettes, and navigational primitives",
  },
  forms: {
    label: "Forms",
    description: "Input fields and file interactions with premium feel",
  },
  layout: {
    label: "Layout",
    description: "Motion-driven layout and overlay primitives",
  },
  ai: {
    label: "AI Interfaces",
    description: "Streaming text and agent thinking indicators",
  },
};

export const REGISTRY: RegistryEntry[] = [
  // ─── Actions ────────────────────────────────────────────────────────────────
  {
    name: "CopyButton",
    slug: "copy-button",
    category: "actions",
    description:
      "A button that copies text to the clipboard with an animated check-mark success state.",
    tags: ["button", "motion"],
    props: [
      { name: "value", type: "string", required: true, description: "Text to copy to clipboard" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Default", description: "Icon-only copy button" },
      { name: "With label", description: "Includes a text label" },
    ],
    accessibilityNotes: [
      "Uses aria-label to announce copy action",
      "Success state is announced via aria-live region",
    ],
    usageExample: `<CopyButton value="npm install feel-ui" />`,
  },
  {
    name: "LoadingButton",
    slug: "loading-button",
    category: "actions",
    description:
      "A button with an integrated loading spinner that preserves its width during the loading state.",
    tags: ["button", "loading", "motion"],
    props: [
      { name: "loading", type: "boolean", default: "false", description: "Shows loading state" },
      { name: "variant", type: '"default" | "primary" | "outline"', default: '"default"', description: "Visual variant" },
      { name: "children", type: "React.ReactNode", required: true, description: "Button label" },
    ],
    variants: [
      { name: "Default", description: "Default style with spinner" },
      { name: "Primary", description: "Amber accent with spinner" },
    ],
    accessibilityNotes: [
      "Sets aria-busy when loading",
      "Disables pointer events while loading",
    ],
    usageExample: `<LoadingButton loading={isLoading}>Save changes</LoadingButton>`,
  },
  {
    name: "PressableButton",
    slug: "pressable-button",
    category: "actions",
    description:
      "A button with a satisfying spring-based press animation using Framer Motion.",
    tags: ["button", "motion"],
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Button content" },
      { name: "variant", type: '"default" | "primary" | "outline"', default: '"primary"', description: "Visual variant" },
      { name: "onClick", type: "() => void", description: "Click handler" },
    ],
    variants: [
      { name: "Primary", description: "Amber fill with press spring" },
      { name: "Outline", description: "Border variant" },
    ],
    accessibilityNotes: [
      "Uses a native button element",
      "Focus ring is preserved",
      "Reduced motion disables the spring",
    ],
    usageExample: `<PressableButton onClick={handleSubmit}>Get started</PressableButton>`,
  },
  {
    name: "MagneticButton",
    slug: "magnetic-button",
    category: "actions",
    description:
      "A button that follows the cursor magnetically on hover using spring physics.",
    tags: ["button", "motion"],
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Button content" },
      { name: "strength", type: "number", default: "0.4", description: "Magnetic pull strength (0–1)" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Default", description: "Ghost variant with magnetic pull" },
      { name: "Outlined", description: "Border variant" },
    ],
    accessibilityNotes: [
      "Motion is disabled with prefers-reduced-motion",
      "Keyboard navigation is unaffected",
    ],
    usageExample: `<MagneticButton>Explore</MagneticButton>`,
  },
  // ─── Feedback ────────────────────────────────────────────────────────────────
  {
    name: "UndoToast",
    slug: "undo-toast",
    category: "feedback",
    description:
      "A toast notification with a countdown progress bar and an undo action.",
    tags: ["feedback", "motion"],
    props: [
      { name: "message", type: "string", required: true, description: "Toast message" },
      { name: "onUndo", type: "() => void", required: true, description: "Undo callback" },
      { name: "duration", type: "number", default: "5000", description: "Auto-dismiss duration (ms)" },
      { name: "open", type: "boolean", required: true, description: "Visibility state" },
      { name: "onClose", type: "() => void", required: true, description: "Close callback" },
    ],
    variants: [
      { name: "Default", description: "Standard undo toast" },
    ],
    accessibilityNotes: [
      "Uses role=status for live region",
      "Undo button is keyboard accessible",
      "Escape key dismisses the toast",
    ],
    usageExample: `<UndoToast open={open} message="Item deleted" onUndo={restore} onClose={() => setOpen(false)} />`,
  },
  {
    name: "StatusPulse",
    slug: "status-pulse",
    category: "feedback",
    description:
      "An animated status dot with a pulsing ring for live/online/processing states.",
    tags: ["feedback", "dashboard", "motion"],
    props: [
      { name: "status", type: '"online" | "processing" | "offline" | "error"', default: '"online"', description: "Status type" },
      { name: "label", type: "string", description: "Optional text label" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Dot size" },
    ],
    variants: [
      { name: "Online", description: "Green pulsing dot" },
      { name: "Processing", description: "Amber pulsing dot" },
      { name: "Offline", description: "Gray static dot" },
      { name: "Error", description: "Red pulsing dot" },
    ],
    accessibilityNotes: [
      "Uses aria-label to describe the status",
      "Color is not the only status indicator (pulse animation varies)",
      "Reduced motion hides the pulse",
    ],
    usageExample: `<StatusPulse status="online" label="API connected" />`,
  },
  {
    name: "SuccessCheck",
    slug: "success-check",
    category: "feedback",
    description:
      "An animated SVG checkmark that draws itself on mount with a spring path animation.",
    tags: ["feedback", "motion"],
    props: [
      { name: "size", type: "number", default: "48", description: "SVG size in pixels" },
      { name: "color", type: "string", default: '"amber"', description: "Checkmark color" },
      { name: "onComplete", type: "() => void", description: "Called when animation completes" },
    ],
    variants: [
      { name: "Default", description: "Amber checkmark" },
      { name: "Success green", description: "Emerald checkmark" },
    ],
    accessibilityNotes: [
      "Uses aria-label='Success'",
      "role='img' on SVG",
    ],
    usageExample: `<SuccessCheck size={56} />`,
  },
  {
    name: "ErrorShake",
    slug: "error-shake",
    category: "feedback",
    description:
      "A container that shakes horizontally when an error prop is triggered.",
    tags: ["feedback", "form", "motion"],
    props: [
      { name: "error", type: "boolean", required: true, description: "Triggers shake animation" },
      { name: "children", type: "React.ReactNode", required: true, description: "Content to shake" },
      { name: "onAnimationComplete", type: "() => void", description: "Called after shake ends" },
    ],
    variants: [
      { name: "Default", description: "Standard horizontal shake" },
    ],
    accessibilityNotes: [
      "Uses aria-invalid on child inputs",
      "Shake is disabled with prefers-reduced-motion",
    ],
    usageExample: `<ErrorShake error={hasError}><Input /></ErrorShake>`,
  },
  // ─── Cards ────────────────────────────────────────────────────────────────
  {
    name: "SpotlightCard",
    slug: "spotlight-card",
    category: "cards",
    description:
      "A card with a radial gradient spotlight that follows the cursor on hover.",
    tags: ["card", "motion"],
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Card content" },
      { name: "spotlightColor", type: "string", default: '"rgba(245,158,11,0.08)"', description: "Spotlight gradient color" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Amber spotlight", description: "Default warm glow" },
      { name: "Blue spotlight", description: "Cool electric blue" },
    ],
    accessibilityNotes: [
      "Spotlight is decorative — not announced",
      "All content inside is fully accessible",
    ],
    usageExample: `<SpotlightCard><p>Hover over me</p></SpotlightCard>`,
  },
  {
    name: "BorderBeamCard",
    slug: "border-beam-card",
    category: "cards",
    description:
      "A card with an animated beam of light that orbits the border continuously.",
    tags: ["card", "motion", "dashboard"],
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Card content" },
      { name: "beamColor", type: "string", default: '"#f59e0b"', description: "Beam color" },
      { name: "duration", type: "number", default: "4", description: "Orbit duration in seconds" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Amber beam", description: "Default warm beam" },
      { name: "Blue beam", description: "Electric blue beam" },
    ],
    accessibilityNotes: [
      "Beam is decorative and not announced",
      "Reduced motion stops the animation",
    ],
    usageExample: `<BorderBeamCard>Premium plan</BorderBeamCard>`,
  },
  {
    name: "ShineCard",
    slug: "shine-card",
    category: "cards",
    description:
      "A card with a diagonal shine sweep on hover, like a holographic card.",
    tags: ["card", "motion"],
    props: [
      { name: "children", type: "React.ReactNode", required: true, description: "Card content" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Default", description: "Subtle white shine" },
      { name: "Amber", description: "Amber-tinted shine" },
    ],
    accessibilityNotes: [
      "Shine is purely decorative",
      "Reduced motion removes the transition",
    ],
    usageExample: `<ShineCard><p>Hover to shine</p></ShineCard>`,
  },
  {
    name: "ExpandableCard",
    slug: "expandable-card",
    category: "cards",
    description:
      "A card that expands to reveal more content with a smooth height animation.",
    tags: ["card", "motion"],
    props: [
      { name: "title", type: "string", required: true, description: "Card title" },
      { name: "summary", type: "string", required: true, description: "Always-visible text" },
      { name: "children", type: "React.ReactNode", required: true, description: "Expanded content" },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initially expanded" },
    ],
    variants: [
      { name: "Collapsed", description: "Shows summary only" },
      { name: "Expanded", description: "Full content visible" },
    ],
    accessibilityNotes: [
      "Uses aria-expanded",
      "Toggle button has descriptive aria-label",
      "Content uses aria-hidden when collapsed",
    ],
    usageExample: `<ExpandableCard title="Changelog" summary="v1.2.0 released">Details...</ExpandableCard>`,
  },
  // ─── Text ────────────────────────────────────────────────────────────────────
  {
    name: "TextReveal",
    slug: "text-reveal",
    category: "text",
    description:
      "Text that fades and slides in word by word on mount, like premium landing pages.",
    tags: ["text", "motion"],
    props: [
      { name: "children", type: "string", required: true, description: "Text to reveal" },
      { name: "delay", type: "number", default: "0", description: "Initial delay in seconds" },
      { name: "stagger", type: "number", default: "0.05", description: "Per-word stagger in seconds" },
      { name: "className", type: "string", description: "Text class names" },
    ],
    variants: [
      { name: "Default", description: "Word-by-word fade up" },
      { name: "Char", description: "Character-by-character" },
    ],
    accessibilityNotes: [
      "Full text is readable without motion",
      "Reduced motion shows text immediately",
    ],
    usageExample: `<TextReveal className="text-4xl font-bold">Feel every interaction.</TextReveal>`,
  },
  {
    name: "SmoothNumber",
    slug: "smooth-number",
    category: "text",
    description:
      "A number that animates from its previous value to a new value with a smooth spring.",
    tags: ["text", "dashboard", "motion"],
    props: [
      { name: "value", type: "number", required: true, description: "Target number value" },
      { name: "duration", type: "number", default: "0.8", description: "Animation duration (s)" },
      { name: "decimals", type: "number", default: "0", description: "Decimal places" },
      { name: "prefix", type: "string", description: "Prefix string (e.g. '$')" },
      { name: "suffix", type: "string", description: "Suffix string (e.g. '%')" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Integer", description: "Whole number animation" },
      { name: "Currency", description: "With dollar prefix" },
      { name: "Percentage", description: "With percent suffix" },
    ],
    accessibilityNotes: [
      "Uses aria-live to announce value changes",
    ],
    usageExample: `<SmoothNumber value={1284} prefix="$" />`,
  },
  {
    name: "TypingText",
    slug: "typing-text",
    category: "text",
    description:
      "A typewriter effect that cycles through an array of strings with a blinking cursor.",
    tags: ["text", "motion", "ai"],
    props: [
      { name: "phrases", type: "string[]", required: true, description: "Array of phrases to cycle" },
      { name: "typingSpeed", type: "number", default: "60", description: "ms per character" },
      { name: "deleteSpeed", type: "number", default: "30", description: "ms per character deleted" },
      { name: "pauseDuration", type: "number", default: "2000", description: "ms pause before deleting" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Default", description: "Cycling phrases" },
      { name: "No delete", description: "Types once" },
    ],
    accessibilityNotes: [
      "aria-live region announces each completed phrase",
      "Reduced motion shows static first phrase",
    ],
    usageExample: `<TypingText phrases={["Build faster.", "Ship beautiful.", "Feel premium."]} />`,
  },
  {
    name: "ScrambleText",
    slug: "scramble-text",
    category: "text",
    description:
      "Text that scrambles through random characters before resolving to the target string.",
    tags: ["text", "motion", "ai"],
    props: [
      { name: "text", type: "string", required: true, description: "Target text to reveal" },
      { name: "duration", type: "number", default: "800", description: "Scramble duration (ms)" },
      { name: "characters", type: "string", default: '"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"', description: "Character pool" },
      { name: "trigger", type: "boolean", default: "true", description: "Triggers on true" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Default", description: "Auto-trigger on mount" },
      { name: "On hover", description: "Triggers on hover" },
    ],
    accessibilityNotes: [
      "aria-label always shows the final text",
      "Screen readers read the final text, not the scramble",
    ],
    usageExample: `<ScrambleText text="Feel the difference" />`,
  },
  // ─── Loading ─────────────────────────────────────────────────────────────────
  {
    name: "SkeletonShimmer",
    slug: "skeleton-shimmer",
    category: "loading",
    description:
      "A skeleton loader with a smooth shimmer sweep, in configurable card/text layouts.",
    tags: ["loading", "dashboard"],
    props: [
      { name: "variant", type: '"card" | "text" | "avatar" | "table"', default: '"card"', description: "Skeleton layout type" },
      { name: "lines", type: "number", default: "3", description: "Number of text lines (text variant)" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Card", description: "Image + content card" },
      { name: "Text", description: "Multi-line text block" },
      { name: "Avatar", description: "Profile with text" },
    ],
    accessibilityNotes: [
      "Uses aria-busy and aria-label='Loading'",
      "role='status' on the container",
    ],
    usageExample: `<SkeletonShimmer variant="card" />`,
  },
  {
    name: "ProgressBeam",
    slug: "progress-beam",
    category: "loading",
    description:
      "A slim progress bar at the top of a container with an animated leading edge.",
    tags: ["loading", "navigation", "motion"],
    props: [
      { name: "progress", type: "number", required: true, description: "Progress value 0–100" },
      { name: "indeterminate", type: "boolean", default: "false", description: "Continuous animation" },
      { name: "color", type: "string", default: '"amber"', description: "Bar color" },
      { name: "height", type: "number", default: "2", description: "Bar height in px" },
    ],
    variants: [
      { name: "Determinate", description: "Shows specific progress" },
      { name: "Indeterminate", description: "Continuous beam sweep" },
    ],
    accessibilityNotes: [
      "Uses role='progressbar'",
      "aria-valuenow, aria-valuemin, aria-valuemax set appropriately",
    ],
    usageExample: `<ProgressBeam progress={65} />`,
  },
  // ─── Navigation ──────────────────────────────────────────────────────────────
  {
    name: "FluidTabs",
    slug: "fluid-tabs",
    category: "navigation",
    description:
      "Tabs with a sliding pill indicator that uses Framer Motion layoutId for fluid animation.",
    tags: ["navigation", "motion"],
    props: [
      { name: "tabs", type: "Array<{ id: string; label: string }>", required: true, description: "Tab definitions" },
      { name: "defaultTab", type: "string", description: "Initially active tab id" },
      { name: "onChange", type: "(id: string) => void", description: "Tab change callback" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Pill", description: "Floating pill indicator" },
      { name: "Underline", description: "Sliding underline" },
    ],
    accessibilityNotes: [
      "Uses role='tablist', role='tab', role='tabpanel'",
      "aria-selected on active tab",
      "Arrow key navigation supported",
    ],
    usageExample: `<FluidTabs tabs={[{id:'preview',label:'Preview'},{id:'code',label:'Code'}]} />`,
  },
  {
    name: "CommandReveal",
    slug: "command-reveal",
    category: "navigation",
    description:
      "A command palette that opens on ⌘K / Ctrl+K with filtered search and keyboard navigation.",
    tags: ["navigation", "motion"],
    props: [
      { name: "items", type: "Array<{ id: string; label: string; icon?: React.ReactNode; action: () => void }>", required: true, description: "Searchable commands" },
      { name: "placeholder", type: "string", default: '"Search commands..."', description: "Input placeholder" },
      { name: "trigger", type: '"keyboard" | "button" | "both"', default: '"both"', description: "Open trigger type" },
    ],
    variants: [
      { name: "Default", description: "Keyboard + button trigger" },
    ],
    accessibilityNotes: [
      "role='dialog' with aria-modal",
      "Escape closes the palette",
      "aria-activedescendant tracks focused item",
      "Backdrop click dismisses",
    ],
    usageExample: `<CommandReveal items={commands} />`,
  },
  // ─── Forms ───────────────────────────────────────────────────────────────────
  {
    name: "FloatingInput",
    slug: "floating-input",
    category: "forms",
    description:
      "An input with a floating label that animates above the field on focus/fill.",
    tags: ["form", "motion"],
    props: [
      { name: "label", type: "string", required: true, description: "Input label" },
      { name: "id", type: "string", required: true, description: "Input id (for a11y)" },
      { name: "type", type: "string", default: '"text"', description: "Input type" },
      { name: "error", type: "string", description: "Error message" },
      { name: "value", type: "string", required: true, description: "Input value" },
      { name: "onChange", type: "(e: React.ChangeEvent<HTMLInputElement>) => void", required: true, description: "Change handler" },
    ],
    variants: [
      { name: "Default", description: "Floating label with amber focus" },
      { name: "Error", description: "Red border with error message" },
    ],
    accessibilityNotes: [
      "Label is always associated with the input via htmlFor",
      "Error messages use aria-describedby",
      "Never hides the label entirely",
    ],
    usageExample: `<FloatingInput id="email" label="Email address" value={email} onChange={setEmail} />`,
  },
  {
    name: "FileDropzone",
    slug: "file-dropzone",
    category: "forms",
    description:
      "A drag-and-drop file upload zone with hover animation and file list preview.",
    tags: ["form", "motion"],
    props: [
      { name: "onFiles", type: "(files: File[]) => void", required: true, description: "Files callback" },
      { name: "accept", type: "string", description: "Accepted MIME types" },
      { name: "multiple", type: "boolean", default: "true", description: "Allow multiple files" },
      { name: "maxSize", type: "number", description: "Max file size in bytes" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Default", description: "Dashed border with icon" },
      { name: "Compact", description: "Smaller height" },
    ],
    accessibilityNotes: [
      "Has a visible file input fallback",
      "Keyboard-accessible via tab + enter",
      "Drag events are aria-live announced",
    ],
    usageExample: `<FileDropzone onFiles={handleFiles} accept="image/*" />`,
  },
  // ─── Layout ──────────────────────────────────────────────────────────────────
  {
    name: "BottomSheet",
    slug: "bottom-sheet",
    category: "layout",
    description:
      "A mobile bottom sheet with drag-to-dismiss, snap points, and a blur backdrop.",
    tags: ["mobile", "motion", "navigation"],
    props: [
      { name: "open", type: "boolean", required: true, description: "Sheet visibility" },
      { name: "onClose", type: "() => void", required: true, description: "Close handler" },
      { name: "children", type: "React.ReactNode", required: true, description: "Sheet content" },
      { name: "title", type: "string", description: "Sheet title" },
      { name: "snapPoints", type: "number[]", default: "[0.5, 0.9]", description: "Snap positions as viewport fraction" },
    ],
    variants: [
      { name: "Half", description: "50% height" },
      { name: "Full", description: "90% height" },
    ],
    accessibilityNotes: [
      "role='dialog' with aria-modal",
      "Escape key and backdrop click close",
      "Focus trapped within sheet",
      "Drag handle has aria-label",
    ],
    usageExample: `<BottomSheet open={isOpen} onClose={() => setOpen(false)} title="Options">...</BottomSheet>`,
  },
  // ─── AI ──────────────────────────────────────────────────────────────────────
  {
    name: "AIStreamingText",
    slug: "ai-streaming-text",
    category: "ai",
    description:
      "Character-by-character streaming text with a blinking cursor, for AI response UIs.",
    tags: ["ai", "text", "motion"],
    props: [
      { name: "text", type: "string", required: true, description: "Full text to stream" },
      { name: "speed", type: "number", default: "20", description: "ms per character" },
      { name: "showCursor", type: "boolean", default: "true", description: "Shows blinking cursor" },
      { name: "onComplete", type: "() => void", description: "Called when streaming ends" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Default", description: "With blinking cursor" },
      { name: "No cursor", description: "Plain text stream" },
    ],
    accessibilityNotes: [
      "aria-live='polite' announces streamed text",
      "Cursor is hidden from screen readers (aria-hidden)",
    ],
    usageExample: `<AIStreamingText text="The answer is 42. Here's why..." speed={25} />`,
  },
  {
    name: "AgentThinkingIndicator",
    slug: "agent-thinking-indicator",
    category: "ai",
    description:
      "A phase-aware AI status indicator with named states: thinking, searching, reading, calling, verifying, composing, done.",
    tags: ["ai", "loading", "motion", "status"],
    props: [
      { name: "phase", type: '"thinking" | "searching" | "reading" | "calling" | "verifying" | "composing" | "done"', description: "Current agent phase" },
      { name: "label", type: "string", description: "Override the phase label" },
      { name: "messages", type: "string[]", description: "Cycling status messages (no-phase mode)" },
      { name: "interval", type: "number", default: "2000", description: "Message cycle interval (ms)" },
      { name: "variant", type: '"compact" | "expanded"', default: '"compact"', description: "Layout variant" },
      { name: "className", type: "string", description: "Additional class names" },
    ],
    variants: [
      { name: "Compact", description: "Dot + label inline" },
      { name: "Expanded", description: "Pill with icon + label + detail" },
      { name: "Cycling messages", description: "Dot + rotating text (no phase prop)" },
    ],
    accessibilityNotes: [
      "role='status' with aria-live='polite'",
      "Reduced motion shows static dots",
      "Phase transitions announced as live region",
    ],
    usageExample: `<AgentThinkingIndicator phase="searching" variant="expanded" />`,
  },

  // ─── Signature ────────────────────────────────────────────────────────────────
  {
    name: "HoldToConfirm",
    slug: "hold-to-confirm",
    category: "signature",
    description:
      "A button that requires the user to hold for 700ms before confirming a dangerous action. Progress fills while held; releases cleanly if let go early.",
    tags: ["button", "motion", "signature"],
    props: [
      { name: "onConfirm", type: "() => void | Promise<void>", required: true, description: "Called when hold completes" },
      { name: "holdDuration", type: "number", default: "700", description: "Hold duration in ms" },
      { name: "label", type: "string", default: '"Hold to delete"', description: "Idle label" },
      { name: "holdLabel", type: "string", default: '"Keep holding…"', description: "Label while holding" },
      { name: "successLabel", type: "string", default: '"Confirmed"', description: "Post-confirm label" },
      { name: "variant", type: '"destructive" | "primary" | "default"', default: '"destructive"', description: "Visual intent" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size" },
      { name: "disabled", type: "boolean", description: "Disables the button" },
    ],
    variants: [
      { name: "Destructive", description: "Red fill — for delete/revoke" },
      { name: "Primary", description: "Amber fill — for deploy/publish" },
      { name: "Default", description: "Zinc fill — for reset/clear" },
    ],
    accessibilityNotes: [
      "aria-pressed reflects hold state",
      "Reduced motion confirms instantly on click",
      "Works with keyboard: space/enter = instant confirm",
    ],
    usageExample: `<HoldToConfirm onConfirm={handleDelete} variant="destructive" label="Hold to delete" />`,
  },
  {
    name: "IntentButton",
    slug: "intent-button",
    category: "signature",
    description:
      "A button that manages async lifecycle: idle → loading → success/error. Pass an async onClick and it handles the rest.",
    tags: ["button", "motion", "signature"],
    props: [
      { name: "onClick", type: "() => void | Promise<void>", description: "Async handler — drives state automatically" },
      { name: "state", type: '"idle" | "loading" | "success" | "error"', description: "External state control" },
      { name: "variant", type: '"primary" | "default" | "outline"', default: '"primary"', description: "Visual variant" },
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Button size" },
      { name: "successLabel", type: "string", default: '"Done"', description: "Success state label" },
      { name: "errorLabel", type: "string", default: '"Try again"', description: "Error state label" },
      { name: "successDuration", type: "number", default: "1800", description: "How long success shows (ms)" },
    ],
    variants: [
      { name: "Primary", description: "Amber idle, green success, red error" },
      { name: "Default", description: "Dark idle with state morphs" },
      { name: "Outline", description: "Subtle outline with state" },
    ],
    accessibilityNotes: [
      "aria-busy set during loading",
      "State changes announced via button content",
      "Error state includes correction shake",
    ],
    usageExample: `<IntentButton onClick={handleSave} successLabel="Saved">Save changes</IntentButton>`,
  },
  {
    name: "SelectionHalo",
    slug: "selection-halo",
    category: "signature",
    description:
      "A set of option cards with an animated halo that moves between selections using Framer Motion layoutId.",
    tags: ["selection", "motion", "signature"],
    props: [
      { name: "options", type: "Array<{ id, label, description?, badge?, price? }>", required: true, description: "Options to display" },
      { name: "defaultSelected", type: "string", description: "Initially selected option id" },
      { name: "onChange", type: "(id: string) => void", description: "Selection change callback" },
      { name: "layout", type: '"horizontal" | "grid"', default: '"horizontal"', description: "Layout direction" },
    ],
    variants: [
      { name: "Horizontal", description: "Row of compact option pills" },
      { name: "Grid", description: "2-column card grid" },
    ],
    accessibilityNotes: [
      "role='radiogroup' with role='radio' on each option",
      "aria-checked reflects selection",
      "Keyboard arrow navigation",
      "Halo motion disabled with prefers-reduced-motion",
    ],
    usageExample: `<SelectionHalo options={plans} onChange={setPlan} layout="grid" />`,
  },
  {
    name: "SmartCopyBlock",
    slug: "smart-copy-block",
    category: "signature",
    description:
      "A premium code block with syntax highlighting, line hover, copy state morph, and terminal variant.",
    tags: ["signature", "motion", "dashboard"],
    props: [
      { name: "code", type: "string", required: true, description: "Source code string" },
      { name: "language", type: "string", default: '"tsx"', description: "Language identifier for badge" },
      { name: "filename", type: "string", description: "Displayed filename in header" },
      { name: "showLineNumbers", type: "boolean", default: "true", description: "Show line numbers" },
      { name: "highlightLines", type: "number[]", default: "[]", description: "Lines to highlight (1-indexed)" },
      { name: "variant", type: '"default" | "terminal" | "minimal"', default: '"default"', description: "Visual variant" },
    ],
    variants: [
      { name: "Default", description: "Full-featured with line numbers and header" },
      { name: "Terminal", description: "Shell-style with $ prompts" },
      { name: "Minimal", description: "Compact with hover-reveal copy" },
    ],
    accessibilityNotes: [
      "Copy state announced via aria-live",
      "Line numbers are aria-hidden",
      "Keyboard accessible copy button",
    ],
    usageExample: `<SmartCopyBlock code={source} filename="button.tsx" highlightLines={[4, 5]} />`,
  },
  {
    name: "AttentionDot",
    slug: "attention-dot",
    category: "signature",
    description:
      "A status dot that communicates priority through motion language: idle, live, warning, critical, resolved.",
    tags: ["status", "motion", "dashboard", "signature"],
    props: [
      { name: "level", type: '"idle" | "live" | "warning" | "critical" | "resolved"', default: '"idle"', description: "Attention level" },
      { name: "label", type: "string", description: "Status label" },
      { name: "showLabel", type: "boolean", default: "true", description: "Show text label" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Dot size" },
    ],
    variants: [
      { name: "Live", description: "Slow emerald pulse — system healthy" },
      { name: "Warning", description: "Medium amber pulse — attention needed" },
      { name: "Critical", description: "Fast red pulse — action required" },
      { name: "Resolved", description: "Fades to check mark" },
    ],
    accessibilityNotes: [
      "aria-label conveys both label and level",
      "Pulse reduced or removed with prefers-reduced-motion",
      "Color is not the only signal — pulse rate varies",
    ],
    usageExample: `<AttentionDot level="critical" label="Deployment failed" />`,
  },
  {
    name: "TraceBeam",
    slug: "trace-beam",
    category: "signature",
    description:
      "A card wrapper with a state-driven animated beam border. Unlike decorative beams, this communicates system state: processing, active, success, error.",
    tags: ["card", "motion", "signature", "status"],
    props: [
      { name: "state", type: '"idle" | "active" | "processing" | "success" | "error"', default: '"idle"', description: "Beam state" },
      { name: "duration", type: "number", description: "Override orbit speed in seconds" },
      { name: "children", type: "React.ReactNode", required: true, description: "Card content" },
    ],
    variants: [
      { name: "Idle", description: "No beam — static border" },
      { name: "Processing", description: "Fast blue beam — running" },
      { name: "Active", description: "Amber beam — selected/live" },
      { name: "Success", description: "Slow green beam — completed" },
      { name: "Error", description: "Fast red beam — failed" },
    ],
    accessibilityNotes: [
      "Beam is purely decorative",
      "State should also be communicated in content",
      "Beam stopped with prefers-reduced-motion",
    ],
    usageExample: `<TraceBeam state="processing"><TaskCard /></TraceBeam>`,
  },
  {
    name: "RevealStack",
    slug: "reveal-stack",
    category: "signature",
    description:
      "A list container where items enter with depth and blur, settling into place with spring physics. Use for search results, AI outputs, notifications.",
    tags: ["motion", "signature", "ai"],
    props: [
      { name: "items", type: "Array<{ id: string; content: React.ReactNode }>", required: true, description: "Items to reveal" },
      { name: "staggerDelay", type: "number", default: "0.07", description: "Per-item stagger in seconds" },
      { name: "className", type: "string", description: "Container class" },
      { name: "itemClassName", type: "string", description: "Per-item class" },
    ],
    variants: [
      { name: "Default", description: "Staggered depth + blur reveal" },
      { name: "Fast", description: "Tighter stagger for large lists" },
    ],
    accessibilityNotes: [
      "role='list' + role='listitem' on each item",
      "All items visible without motion",
      "Reduced motion shows items immediately",
    ],
    usageExample: `<RevealStack items={results.map(r => ({ id: r.id, content: <ResultCard {...r} /> }))} />`,
  },
  {
    name: "MicroTimeline",
    slug: "micro-timeline",
    category: "signature",
    description:
      "A compact step timeline for async workflows. Each step animates between queued, running, done, and failed states.",
    tags: ["motion", "signature", "ai", "dashboard"],
    props: [
      { name: "steps", type: "Array<{ id, label, status, detail?, duration? }>", required: true, description: "Timeline steps" },
      { name: "variant", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout direction" },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "Compact size" },
    ],
    variants: [
      { name: "Vertical", description: "Column with connecting lines" },
      { name: "Horizontal", description: "Row with step connectors" },
    ],
    accessibilityNotes: [
      "role='list' with descriptive aria-label per step",
      "Step status announced in aria-label",
      "Spinner is aria-hidden — status is in the label",
    ],
    usageExample: `<MicroTimeline steps={deploySteps} variant="vertical" />`,
  },
  {
    name: "SoftCollapse",
    slug: "soft-collapse",
    category: "signature",
    description:
      "A premium expandable container with smooth height animation, content mask fade, and three variants: card, FAQ, and bare.",
    tags: ["motion", "signature", "navigation"],
    props: [
      { name: "title", type: "string", description: "Header title" },
      { name: "summary", type: "string", description: "Subtitle below title" },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initially expanded" },
      { name: "variant", type: '"card" | "bare" | "faq"', default: '"card"', description: "Visual variant" },
      { name: "children", type: "React.ReactNode", required: true, description: "Collapsed content" },
    ],
    variants: [
      { name: "Card", description: "Bordered card with header" },
      { name: "FAQ", description: "Bottom-bordered list item" },
      { name: "Bare", description: "No decoration, just motion" },
    ],
    accessibilityNotes: [
      "aria-expanded on trigger",
      "aria-controls points to content region",
      "Keyboard accessible toggle",
      "Reduced motion skips height animation",
    ],
    usageExample: `<SoftCollapse title="What is Feel UI?" variant="faq">Copy-paste motion primitives...</SoftCollapse>`,
  },

  // ─── New unique micro animations ──────────────────────────────────────────────
  {
    name: "TiltCard",
    slug: "tilt-card",
    category: "signature",
    description:
      "A card that tilts in 3D space following the cursor with spring physics. Includes a glare overlay that tracks the light source direction.",
    tags: ["card", "motion", "signature"],
    props: [
      { name: "variant", type: '"subtle" | "deep" | "flat"', default: '"subtle"', description: "Tilt intensity range (±8°, ±15°, or disabled)" },
      { name: "glare", type: "boolean", default: "true", description: "Show light glare overlay on tilt" },
      { name: "children", type: "React.ReactNode", required: true, description: "Card content" },
      { name: "className", type: "string", description: "Wrapper class" },
    ],
    variants: [
      { name: "Subtle", description: "±8° tilt — tasteful, always-on" },
      { name: "Deep", description: "±15° tilt — dramatic depth" },
      { name: "Flat", description: "No tilt — reduced-motion safe default" },
    ],
    accessibilityNotes: [
      "Tilt disabled with prefers-reduced-motion",
      "Card content keyboard accessible",
      "Glare is aria-hidden decorative overlay",
    ],
    usageExample: `<TiltCard variant="subtle"><YourCard /></TiltCard>`,
  },
  {
    name: "ProximityCard",
    slug: "proximity-card",
    category: "signature",
    description:
      "A card that responds before hover — glow and scale increase proportionally as the cursor approaches, before it even enters the card boundary.",
    tags: ["card", "motion", "signature"],
    props: [
      { name: "activationRadius", type: "number", default: "180", description: "Distance in pixels at which the card starts responding" },
      { name: "variant", type: '"glow" | "depth" | "minimal"', default: '"glow"', description: "Glow color preset" },
      { name: "glowColor", type: "string", description: "Custom CSS rgba color override" },
      { name: "cta", type: "React.ReactNode", description: "Element revealed on actual hover" },
      { name: "children", type: "React.ReactNode", required: true, description: "Card content" },
    ],
    variants: [
      { name: "Glow", description: "Amber proximity glow" },
      { name: "Depth", description: "Violet depth effect" },
      { name: "Minimal", description: "Subtle white-on-dark" },
    ],
    accessibilityNotes: [
      "Proximity effect disabled with prefers-reduced-motion",
      "CTA content always reachable by keyboard",
      "Glow overlay is aria-hidden",
    ],
    usageExample: `<ProximityCard cta={<Button>Learn more</Button>}><FeatureContent /></ProximityCard>`,
  },
  {
    name: "MorphIcon",
    slug: "morph-icon",
    category: "signature",
    description:
      "An SVG icon that morphs its path geometry between two states — menu↔close, play↔pause, plus↔check, eye↔eye-off — with smooth interpolation.",
    tags: ["motion", "signature", "button"],
    props: [
      { name: "pair", type: '"menu-close" | "play-pause" | "plus-check" | "eye-toggle"', required: true, description: "Which icon pair to morph between" },
      { name: "active", type: "boolean", required: true, description: "Current state (false = first icon, true = second)" },
      { name: "size", type: "number", default: "24", description: "SVG size in px" },
      { name: "strokeWidth", type: "number", default: "2", description: "Path stroke width" },
      { name: "color", type: "string", default: '"currentColor"', description: "Stroke color" },
      { name: "onClick", type: "() => void", description: "If provided, renders as a button with aria-pressed" },
      { name: "aria-label", type: "string", description: "Accessible label" },
    ],
    variants: [
      { name: "menu-close", description: "Hamburger → X" },
      { name: "play-pause", description: "Triangle → Two bars" },
      { name: "plus-check", description: "Plus → Checkmark" },
      { name: "eye-toggle", description: "Open eye → Closed eye with slash" },
    ],
    accessibilityNotes: [
      "aria-pressed when rendered as button",
      "aria-label required when onClick is used",
      "Morph transitions instant with prefers-reduced-motion",
    ],
    usageExample: `<MorphIcon pair="menu-close" active={isOpen} onClick={() => setOpen(v => !v)} aria-label="Toggle menu" />`,
  },
  {
    name: "DrawPath",
    slug: "draw-path",
    category: "signature",
    description:
      "An SVG path that draws itself using pathLength animation. Trigger on mount, hover, or IntersectionObserver. Ships with checkmark, circle, underline, and arrow presets.",
    tags: ["motion", "signature"],
    props: [
      { name: "preset", type: '"checkmark" | "circle" | "underline" | "arrow"', default: '"checkmark"', description: "Built-in path preset" },
      { name: "trigger", type: '"mount" | "hover" | "visible"', default: '"mount"', description: "What triggers the draw animation" },
      { name: "duration", type: "number", default: "0.6", description: "Draw duration in seconds" },
      { name: "color", type: "string", default: '"currentColor"', description: "Stroke color" },
      { name: "strokeWidth", type: "number", default: "2", description: "Stroke width" },
      { name: "size", type: "number", default: "24", description: "SVG size" },
      { name: "loop", type: "boolean", default: "false", description: "Repeat the draw animation" },
      { name: "path", type: "string", description: "Custom SVG path string (overrides preset)" },
      { name: "viewBox", type: "string", description: "Custom SVG viewBox for custom paths" },
    ],
    variants: [
      { name: "Checkmark", description: "Completion, success states" },
      { name: "Circle", description: "Focus rings, progress indicators" },
      { name: "Underline", description: "Text highlights, section markers" },
      { name: "Arrow", description: "Direction indicators, CTAs" },
    ],
    accessibilityNotes: [
      "SVG is aria-hidden — pair with text content for context",
      "Draw animation skipped with prefers-reduced-motion",
      "visible trigger uses IntersectionObserver (once by default)",
    ],
    usageExample: `<DrawPath preset="checkmark" trigger="visible" color="#10b981" size={32} />`,
  },
  {
    name: "SlotCounter",
    slug: "slot-counter",
    category: "signature",
    description:
      "Numbers that roll like slot-machine digits when the value changes. Each digit column animates independently with staggered spring physics.",
    tags: ["text", "motion", "signature", "dashboard"],
    props: [
      { name: "value", type: "number", required: true, description: "Current numeric value" },
      { name: "padStart", type: "number", description: "Minimum digits (zero-padded)" },
      { name: "prefix", type: "string", description: "Static prefix (e.g. '$')" },
      { name: "suffix", type: "string", description: "Static suffix (e.g. '%')" },
      { name: "variant", type: '"default" | "compact" | "mono-bold"', default: '"default"', description: "Text style variant" },
      { name: "stagger", type: "number", default: "0.04", description: "Per-digit stagger delay in seconds" },
    ],
    variants: [
      { name: "Default", description: "2xl semibold — dashboards and stats" },
      { name: "Compact", description: "base medium — inline counters" },
      { name: "Mono-bold", description: "3xl mono bold — hero numbers" },
    ],
    accessibilityNotes: [
      "aria-live='polite' with aria-atomic='true'",
      "aria-label shows full value for screen readers",
      "Digit columns are aria-hidden",
      "Slot animation disabled with prefers-reduced-motion",
    ],
    usageExample: `<SlotCounter value={activeUsers} prefix="$" suffix="K" variant="mono-bold" />`,
  },
  {
    name: "CascadeReveal",
    slug: "cascade-reveal",
    category: "signature",
    description:
      "Text that reveals character-by-character with staggered spring orchestration. Unlike word-level TextReveal, this creates a cinematic wave effect. Supports blur-in, slide-up, and scale-in variants.",
    tags: ["text", "motion", "signature"],
    props: [
      { name: "text", type: "string", required: true, description: "Text content to reveal" },
      { name: "variant", type: '"blur-in" | "slide-up" | "scale-in"', default: '"blur-in"', description: "Character animation style" },
      { name: "direction", type: '"ltr" | "center-out"', default: '"ltr"', description: "Stagger direction" },
      { name: "stagger", type: "number", default: "0.025", description: "Per-character delay in seconds" },
      { name: "delay", type: "number", default: "0", description: "Initial delay before reveal starts" },
      { name: "trigger", type: '"mount" | "visible"', default: '"mount"', description: "When the reveal begins" },
      { name: "as", type: '"h1" | "h2" | "h3" | "p" | "span"', default: '"span"', description: "HTML element" },
    ],
    variants: [
      { name: "Blur-in", description: "Chars emerge from blur — cinematic" },
      { name: "Slide-up", description: "Chars rise from below" },
      { name: "Scale-in", description: "Chars scale up from small" },
    ],
    accessibilityNotes: [
      "aria-label contains full text for screen readers",
      "Individual chars are aria-hidden",
      "All chars shown immediately with prefers-reduced-motion",
    ],
    usageExample: `<CascadeReveal text="Interfaces that feel alive" variant="blur-in" as="h1" className="text-5xl font-bold" />`,
  },
  {
    name: "RippleButton",
    slug: "ripple-button",
    category: "signature",
    description:
      "A button with spring-physics ripple originating from the exact click or tap point. Multiple ripples can coexist. Keyboard-triggered ripple originates from center.",
    tags: ["button", "motion", "signature"],
    props: [
      { name: "variant", type: '"default" | "primary" | "ghost" | "outline"', default: '"default"', description: "Button visual style" },
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Button size" },
      { name: "onClick", type: "(e: React.MouseEvent) => void", description: "Click handler" },
      { name: "disabled", type: "boolean", description: "Disables button and ripple" },
      { name: "type", type: '"button" | "submit" | "reset"', default: '"button"', description: "Button type" },
      { name: "children", type: "React.ReactNode", required: true, description: "Button label" },
    ],
    variants: [
      { name: "Default", description: "Dark fill with zinc ripple" },
      { name: "Primary", description: "Amber fill with dark ripple" },
      { name: "Ghost", description: "No fill with subtle ripple" },
      { name: "Outline", description: "Bordered with zinc ripple" },
    ],
    accessibilityNotes: [
      "Focus-visible ring visible",
      "Ripple spawns on keyboard Space/Enter from center",
      "Ripple effect disabled with prefers-reduced-motion",
      "Disabled state suppresses ripple and click",
    ],
    usageExample: `<RippleButton variant="primary" onClick={handleSubmit}>Submit</RippleButton>`,
  },
  {
    name: "AmbientPulse",
    slug: "ambient-pulse",
    category: "signature",
    description:
      "A breathing glow wrapper for any element. The glow breathes (scale + opacity oscillate on a slow loop) to communicate live, active, or critical state without being distracting.",
    tags: ["motion", "signature", "status"],
    props: [
      { name: "color", type: '"amber" | "blue" | "green" | "critical" | "violet"', default: '"amber"', description: "Glow color" },
      { name: "radius", type: "number", default: "32", description: "Glow blur spread radius in pixels" },
      { name: "speed", type: "number", default: "3", description: "Breath cycle duration in seconds" },
      { name: "breathe", type: "boolean", default: "true", description: "Animate the glow (false = static)" },
      { name: "intensity", type: '"soft" | "medium" | "strong"', default: '"soft"', description: "Glow opacity range" },
      { name: "children", type: "React.ReactNode", required: true, description: "Wrapped element" },
    ],
    variants: [
      { name: "Amber", description: "Active, selected, live" },
      { name: "Blue", description: "AI, processing, syncing" },
      { name: "Green", description: "Healthy, connected, success" },
      { name: "Critical", description: "Error, alert, urgent" },
    ],
    accessibilityNotes: [
      "Glow is aria-hidden and purely decorative",
      "State meaning must be in text/ARIA attributes of children",
      "Breathing loop disabled with prefers-reduced-motion",
    ],
    usageExample: `<AmbientPulse color="blue" intensity="soft"><AIPanel /></AmbientPulse>`,
  },
];

export function getComponentBySlug(slug: string): RegistryEntry | undefined {
  return REGISTRY.find((c) => c.slug === slug);
}

export function getComponentsByCategory(category: ComponentCategory): RegistryEntry[] {
  return REGISTRY.filter((c) => c.category === category);
}

export function getAllSlugs(): string[] {
  return REGISTRY.map((c) => c.slug);
}
