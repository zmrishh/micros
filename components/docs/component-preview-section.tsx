"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PreviewFrame } from "@/components/docs/preview-frame";
import { CodeBlock } from "@/components/docs/code-block";
import { CODE_SNIPPETS } from "@/lib/code-snippets";

// Import all preview components lazily
import { CopyButton } from "@/components/library/actions/copy-button";
import { LoadingButton } from "@/components/library/actions/loading-button";
import { PressableButton } from "@/components/library/actions/pressable-button";
import { MagneticButton } from "@/components/library/actions/magnetic-button";
import { UndoToast } from "@/components/library/feedback/undo-toast";
import { StatusPulse } from "@/components/library/feedback/status-pulse";
import { SuccessCheck } from "@/components/library/feedback/success-check";
import { ErrorShake } from "@/components/library/feedback/error-shake";
import { SpotlightCard } from "@/components/library/cards/spotlight-card";
import { BorderBeamCard } from "@/components/library/cards/border-beam-card";
import { ShineCard } from "@/components/library/cards/shine-card";
import { ExpandableCard } from "@/components/library/cards/expandable-card";
import { TextReveal } from "@/components/library/text/text-reveal";
import { SmoothNumber } from "@/components/library/text/smooth-number";
import { TypingText } from "@/components/library/text/typing-text";
import { ScrambleText } from "@/components/library/text/scramble-text";
import { SkeletonShimmer } from "@/components/library/loading/skeleton-shimmer";
import { ProgressBeam } from "@/components/library/loading/progress-beam";
import { FluidTabs } from "@/components/library/navigation/fluid-tabs";
import { CommandReveal } from "@/components/library/navigation/command-reveal";
import { FloatingInput } from "@/components/library/forms/floating-input";
import { FileDropzone } from "@/components/library/forms/file-dropzone";
import { BottomSheet } from "@/components/library/layout/bottom-sheet";
import { AIStreamingText } from "@/components/library/ai/ai-streaming-text";
import { AgentThinkingIndicator } from "@/components/library/ai/agent-thinking-indicator";
import { HoldToConfirm } from "@/components/library/signature/hold-to-confirm";
import { IntentButton } from "@/components/library/signature/intent-button";
import { SelectionHalo } from "@/components/library/signature/selection-halo";
import { SmartCopyBlock } from "@/components/library/signature/smart-copy-block";
import { AttentionDot } from "@/components/library/signature/attention-dot";
import { TraceBeam } from "@/components/library/signature/trace-beam";
import { RevealStack } from "@/components/library/signature/reveal-stack";
import { MicroTimeline } from "@/components/library/signature/micro-timeline";
import { SoftCollapse } from "@/components/library/signature/soft-collapse";
import { Input } from "@/components/ui/input";
import { FileText, Settings, HelpCircle } from "lucide-react";

// ── Individual preview components ─────────────────────────────────────────────

function CopyButtonPreview() {
  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <CopyButton value="Hello world" />
      <CopyButton value="npm install feel-ui" label="Copy" size="md" />
      <CopyButton value="npx create-next-app@latest" label="Copy command" size="md" />
    </div>
  );
}

function LoadingButtonPreview() {
  const [state, setState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const trigger = async () => {
    setState("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setState("success");
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <LoadingButton state={state} variant="primary" onClick={trigger} successLabel="Saved">
        Save changes
      </LoadingButton>
      <LoadingButton state={state} variant="default" onClick={trigger} successLabel="Done">
        Submit
      </LoadingButton>
    </div>
  );
}

function PressableButtonPreview() {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <PressableButton variant="primary">Get started</PressableButton>
      <PressableButton variant="default">Learn more</PressableButton>
      <PressableButton variant="outline">View docs</PressableButton>
    </div>
  );
}

function MagneticButtonPreview() {
  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <MagneticButton variant="outline">Explore</MagneticButton>
      <MagneticButton variant="default">Contact</MagneticButton>
      <MagneticButton variant="ghost">Learn more</MagneticButton>
    </div>
  );
}

function UndoToastPreview() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <PressableButton
        variant="default"
        onClick={() => setOpen(true)}
      >
        Delete item
      </PressableButton>
      <div className="relative h-16 flex items-center">
        <UndoToast
          open={open}
          message="Item deleted"
          onUndo={() => {}}
          onClose={() => setOpen(false)}
          duration={4000}
        />
      </div>
    </div>
  );
}

function StatusPulsePreview() {
  return (
    <div className="flex flex-col gap-3">
      <StatusPulse status="online" label="API connected" />
      <StatusPulse status="processing" label="Building deployment" />
      <StatusPulse status="error" label="Authentication failed" />
      <StatusPulse status="offline" label="Service offline" />
    </div>
  );
}

function SuccessCheckPreview() {
  const [key, setKey] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-6">
      <SuccessCheck key={key} size={56} color="amber" />
      <PressableButton variant="default" onClick={() => setKey((k) => k + 1)}>
        Replay
      </PressableButton>
    </div>
  );
}

function ErrorShakePreview() {
  const [error, setError] = React.useState(false);
  const [val, setVal] = React.useState("");
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <ErrorShake
        error={error}
        onAnimationComplete={() => setError(false)}
      >
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Enter value..."
          className={error ? "border-red-500/60" : ""}
        />
      </ErrorShake>
      <PressableButton
        variant="default"
        onClick={() => setError(true)}
      >
        Trigger error
      </PressableButton>
    </div>
  );
}

function SpotlightCardPreview() {
  return (
    <SpotlightCard className="max-w-xs w-full">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">Spotlight Card</h3>
        <p className="text-sm text-zinc-500">
          Hover over this card to see the radial gradient follow your cursor.
        </p>
      </div>
    </SpotlightCard>
  );
}

function BorderBeamCardPreview() {
  return (
    <BorderBeamCard className="max-w-xs w-full">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">Border Beam</h3>
        <p className="text-sm text-zinc-500">
          An animated beam orbits the border of this card.
        </p>
      </div>
    </BorderBeamCard>
  );
}

function ShineCardPreview() {
  return (
    <ShineCard className="max-w-xs w-full">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">Shine Card</h3>
        <p className="text-sm text-zinc-500">
          Hover to see a radial shine sweep across the surface.
        </p>
      </div>
    </ShineCard>
  );
}

function ExpandableCardPreview() {
  return (
    <div className="max-w-sm w-full">
      <ExpandableCard
        title="v1.2.0 — May 2025"
        summary="New AI components and performance improvements"
      >
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Added AIStreamingText component</li>
          <li>Added AgentThinkingIndicator</li>
          <li>Improved ProgressBeam animation smoothness</li>
          <li>Fixed reduced-motion handling in FluidTabs</li>
        </ul>
      </ExpandableCard>
    </div>
  );
}

function TextRevealPreview() {
  const [key, setKey] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <TextReveal key={key} className="text-2xl font-semibold" as="h2">
        Feel every interaction
      </TextReveal>
      <PressableButton variant="default" onClick={() => setKey((k) => k + 1)}>
        Replay
      </PressableButton>
    </div>
  );
}

function SmoothNumberPreview() {
  const values = [0, 1284, 52000, 1000000];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % values.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-5xl font-semibold tracking-tight">
        <SmoothNumber value={values[idx]} prefix="$" />
      </div>
      <p className="text-sm text-zinc-600">MRR</p>
    </div>
  );
}

function TypingTextPreview() {
  return (
    <div className="text-xl font-medium text-zinc-200">
      <TypingText
        phrases={[
          "Build faster.",
          "Ship beautiful.",
          "Feel premium.",
          "Move with purpose.",
        ]}
      />
    </div>
  );
}

function ScrambleTextPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-semibold">
        <ScrambleText text="Feel the difference" triggerOnHover />
      </div>
      <p className="text-xs text-zinc-600">Hover the text to scramble</p>
    </div>
  );
}

function SkeletonShimmerPreview() {
  return (
    <div className="w-full max-w-sm">
      <SkeletonShimmer variant="avatar" />
    </div>
  );
}

function ProgressBeamPreview() {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setP((v) => (v >= 100 ? 0 : v + 1)), 60);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>Deploying...</span>
        <SmoothNumber value={p} suffix="%" />
      </div>
      <ProgressBeam progress={p} height={3} />
      <ProgressBeam indeterminate height={2} color="blue" />
    </div>
  );
}

function FluidTabsPreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <FluidTabs
        tabs={[
          { id: "preview", label: "Preview" },
          { id: "code", label: "Code" },
          { id: "props", label: "Props" },
        ]}
      />
      <FluidTabs
        variant="underline"
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "activity", label: "Activity" },
          { id: "settings", label: "Settings" },
        ]}
      />
    </div>
  );
}

function CommandRevealPreview() {
  return (
    <CommandReveal
      items={[
        { id: "docs", label: "Open documentation", description: "Browse all components", icon: <FileText size={14} />, shortcut: "⌘D", action: () => {} },
        { id: "settings", label: "Settings", description: "Manage preferences", icon: <Settings size={14} />, shortcut: "⌘,", action: () => {} },
        { id: "help", label: "Help & support", description: "Get in touch", icon: <HelpCircle size={14} />, action: () => {} },
      ]}
    />
  );
}

function FloatingInputPreview() {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <FloatingInput
        id="preview-email"
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FloatingInput
        id="preview-name"
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

function FileDropzonePreview() {
  return (
    <div className="w-full max-w-sm">
      <FileDropzone onFiles={() => {}} accept="image/*,.pdf" multiple />
    </div>
  );
}

function BottomSheetPreview() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <PressableButton variant="primary" onClick={() => setOpen(true)}>
        Open bottom sheet
      </PressableButton>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Options">
        <div className="flex flex-col gap-3">
          {["Share", "Edit", "Duplicate", "Archive", "Delete"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center w-full px-4 py-3 rounded-xl text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

function AIStreamingTextPreview() {
  const [key, setKey] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-6 max-w-sm text-center">
      <p key={key} className="text-sm text-zinc-300 leading-relaxed">
        <AIStreamingText
          text="The universe chose 42 as the answer to everything because it perfectly balances cosmic chaos with elegant simplicity."
          speed={22}
          showCursor
        />
      </p>
      <PressableButton variant="default" onClick={() => setKey((k) => k + 1)}>
        Replay stream
      </PressableButton>
    </div>
  );
}

function AgentThinkingPreview() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <AgentThinkingIndicator phase="thinking" variant="compact" />
      <AgentThinkingIndicator
        phase="searching"
        variant="expanded"
        messages={["Searching the web...", "Reading sources...", "Synthesizing answer..."]}
        interval={2000}
      />
    </div>
  );
}

// ── Signature previews ────────────────────────────────────────────────────────
function HoldToConfirmPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <HoldToConfirm onConfirm={() => {}} variant="destructive" label="Hold to delete" />
      <HoldToConfirm onConfirm={() => {}} variant="primary" label="Hold to deploy" holdDuration={1000} />
    </div>
  );
}

function IntentButtonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <IntentButton onClick={() => new Promise((r) => setTimeout(r, 1600))} successLabel="Deployed" variant="primary">
        Deploy
      </IntentButton>
      <IntentButton onClick={() => new Promise((_, r) => setTimeout(() => r(new Error()), 1200))} errorLabel="Failed" variant="default">
        Save
      </IntentButton>
    </div>
  );
}

function SelectionHaloPreview() {
  return (
    <SelectionHalo
      options={[
        { id: "hobby", label: "Hobby", price: "Free" },
        { id: "pro", label: "Pro", badge: "Popular", price: "$29/mo" },
        { id: "team", label: "Team", price: "$79/mo" },
      ]}
      layout="grid"
    />
  );
}

function SmartCopyBlockPreview() {
  const code = `import { IntentButton } from "@/components/library/signature/intent-button"

export function Demo() {
  return (
    <IntentButton onClick={handleSave} successLabel="Saved">
      Save changes
    </IntentButton>
  )
}`;
  return (
    <SmartCopyBlock
      code={code}
      filename="demo.tsx"
      highlightLines={[4, 5, 6, 7]}
    />
  );
}

function AttentionDotPreview() {
  return (
    <div className="flex flex-col gap-3">
      <AttentionDot level="idle" label="Service idle" />
      <AttentionDot level="live" label="API live" />
      <AttentionDot level="warning" label="High latency" />
      <AttentionDot level="critical" label="Deployment failed" />
      <AttentionDot level="resolved" label="Incident resolved" />
    </div>
  );
}

function TraceBeamPreview() {
  const [state, setState] = React.useState<"idle" | "active" | "processing" | "success" | "error">("processing");
  const STATES = ["idle", "active", "processing", "success", "error"] as const;
  React.useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % STATES.length;
      setState(STATES[i]);
    }, 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <TraceBeam state={state} className="w-full max-w-xs">
      <div className="p-4 bg-[#111111] rounded-2xl flex flex-col gap-2">
        <p className="text-xs font-mono text-zinc-500">ai-worker-1</p>
        <p className="text-sm font-medium text-zinc-200 capitalize">{state}</p>
      </div>
    </TraceBeam>
  );
}

function RevealStackPreview() {
  const ITEMS = [
    { id: "1", content: <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300">Search result — useReducedMotion hook docs</div> },
    { id: "2", content: <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300">Search result — Framer Motion spring config</div> },
    { id: "3", content: <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300">Search result — AnimatePresence exit modes</div> },
  ];
  const [key, setKey] = React.useState(0);
  return (
    <div className="flex flex-col gap-3 w-full">
      <RevealStack key={key} items={ITEMS} />
      <button type="button" onClick={() => setKey((k) => k + 1)} className="text-xs text-zinc-600 hover:text-zinc-400 text-left mt-1">
        Replay →
      </button>
    </div>
  );
}

function MicroTimelinePreview() {
  const steps = [
    { id: "build", label: "Build", status: "done" as const, duration: "12s" },
    { id: "test", label: "Test", status: "done" as const, duration: "4s" },
    { id: "push", label: "Push image", status: "running" as const },
    { id: "deploy", label: "Deploy", status: "queued" as const },
    { id: "verify", label: "Health check", status: "queued" as const },
  ];
  return <MicroTimeline steps={steps} variant="vertical" />;
}

function SoftCollapsePreview() {
  return (
    <div className="flex flex-col gap-0 w-full max-w-sm">
      <SoftCollapse title="What is Feel UI?" variant="faq">
        Feel UI is a copy-paste micro-interaction library. Every component ships as a single file with full TypeScript types, accessibility, and reduced-motion support.
      </SoftCollapse>
      <SoftCollapse title="Do I need to install anything?" variant="faq">
        Only framer-motion and lucide-react. Everything else is standard React and Tailwind.
      </SoftCollapse>
      <SoftCollapse title="Can I use this with shadcn/ui?" variant="faq" defaultOpen>
        Yes. Feel UI was designed to work alongside shadcn/ui. Components use the same cn utility and Tailwind conventions.
      </SoftCollapse>
    </div>
  );
}

// ── Slug → Preview map ────────────────────────────────────────────────────────
const PREVIEW_MAP: Record<string, React.ComponentType> = {
  "copy-button": CopyButtonPreview,
  "loading-button": LoadingButtonPreview,
  "pressable-button": PressableButtonPreview,
  "magnetic-button": MagneticButtonPreview,
  "undo-toast": UndoToastPreview,
  "status-pulse": StatusPulsePreview,
  "success-check": SuccessCheckPreview,
  "error-shake": ErrorShakePreview,
  "spotlight-card": SpotlightCardPreview,
  "border-beam-card": BorderBeamCardPreview,
  "shine-card": ShineCardPreview,
  "expandable-card": ExpandableCardPreview,
  "text-reveal": TextRevealPreview,
  "smooth-number": SmoothNumberPreview,
  "typing-text": TypingTextPreview,
  "scramble-text": ScrambleTextPreview,
  "skeleton-shimmer": SkeletonShimmerPreview,
  "progress-beam": ProgressBeamPreview,
  "fluid-tabs": FluidTabsPreview,
  "command-reveal": CommandRevealPreview,
  "floating-input": FloatingInputPreview,
  "file-dropzone": FileDropzonePreview,
  "bottom-sheet": BottomSheetPreview,
  "ai-streaming-text": AIStreamingTextPreview,
  "agent-thinking-indicator": AgentThinkingPreview,
  "hold-to-confirm": HoldToConfirmPreview,
  "intent-button": IntentButtonPreview,
  "selection-halo": SelectionHaloPreview,
  "smart-copy-block": SmartCopyBlockPreview,
  "attention-dot": AttentionDotPreview,
  "trace-beam": TraceBeamPreview,
  "reveal-stack": RevealStackPreview,
  "micro-timeline": MicroTimelinePreview,
  "soft-collapse": SoftCollapsePreview,
};

interface ComponentPreviewSectionProps {
  slug: string;
}

export function ComponentPreviewSection({ slug }: ComponentPreviewSectionProps) {
  const code = CODE_SNIPPETS[slug] ?? `// Source: components/library/.../${slug}.tsx`;
  const PreviewComponent = PREVIEW_MAP[slug];

  return (
    <section>
      <Tabs defaultValue="preview">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-zinc-100">Preview</h2>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview">
          <PreviewFrame>
            {PreviewComponent ? (
              <PreviewComponent />
            ) : (
              <p className="text-sm text-zinc-600">No preview available for this component.</p>
            )}
          </PreviewFrame>
        </TabsContent>

        <TabsContent value="code">
          <CodeBlock code={code} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
