"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  GitBranch,
  Zap,
  Layers,
  Code2,
  Sparkles,
  MousePointer,
  Activity,
  Box,
  Type,
  Loader,
  Navigation,
  FileInput,
  Bot,
  FlameKindling,
  Star,
} from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/library/actions/copy-button";
import { StatusPulse } from "@/components/library/feedback/status-pulse";
import { SkeletonShimmer } from "@/components/library/loading/skeleton-shimmer";
import { ProgressBeam } from "@/components/library/loading/progress-beam";
import { FluidTabs } from "@/components/library/navigation/fluid-tabs";
import { AIStreamingText } from "@/components/library/ai/ai-streaming-text";
import { AgentThinkingIndicator } from "@/components/library/ai/agent-thinking-indicator";
import { SmoothNumber } from "@/components/library/text/smooth-number";
import { TextReveal } from "@/components/library/text/text-reveal";
import { HoldToConfirm } from "@/components/library/signature/hold-to-confirm";
import { IntentButton } from "@/components/library/signature/intent-button";
import { AttentionDot } from "@/components/library/signature/attention-dot";
import { TraceBeam } from "@/components/library/signature/trace-beam";
import { SelectionHalo } from "@/components/library/signature/selection-halo";
import { MicroTimeline } from "@/components/library/signature/micro-timeline";
import { REGISTRY, CATEGORIES } from "@/lib/registry";

// ── Category icons ────────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  actions: <MousePointer size={15} />,
  feedback: <Activity size={15} />,
  cards: <Box size={15} />,
  text: <Type size={15} />,
  loading: <Loader size={15} />,
  navigation: <Navigation size={15} />,
  forms: <FileInput size={15} />,
  layout: <Layers size={15} />,
  ai: <Bot size={15} />,
  signature: <Star size={15} />,
};

// ── Live bento previews ───────────────────────────────────────────────────────
function StreamingPreview() {
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setKey((k) => k + 1), 7000);
    return () => clearInterval(t);
  }, []);
  return (
    <p key={key} className="text-sm text-zinc-300 leading-relaxed">
      <AIStreamingText
        text="Interfaces should feel expensive, tactile, and alive — not just correct."
        speed={22}
        showCursor
      />
    </p>
  );
}

function ProgressPreview() {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setP((v) => (v >= 100 ? 0 : v + 1.5)), 50);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between text-xs text-zinc-500">
        <span>Deploying</span>
        <SmoothNumber value={Math.round(p)} suffix="%" />
      </div>
      <ProgressBeam progress={p} height={2} />
    </div>
  );
}

function IntentPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <IntentButton
        onClick={() => new Promise((r) => setTimeout(r, 1500))}
        successLabel="Deployed"
        variant="primary"
      >
        Deploy
      </IntentButton>
      <IntentButton
        onClick={() => new Promise((_, r) => setTimeout(() => r(new Error()), 1200))}
        variant="default"
        successLabel="Saved"
        errorLabel="Failed"
      >
        Save
      </IntentButton>
    </div>
  );
}

function HoldPreview() {
  return (
    <HoldToConfirm
      onConfirm={() => {}}
      variant="destructive"
      label="Hold to delete"
      holdLabel="Keep holding…"
      successLabel="Deleted"
    />
  );
}

function TraceBeamPreview() {
  const STATES = ["idle", "active", "processing", "success", "error"] as const;
  const [idx, setIdx] = React.useState(1);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % STATES.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <TraceBeam state={STATES[idx]} className="w-full">
      <div className="p-4 flex items-center justify-between bg-[#111111] rounded-2xl">
        <span className="text-xs text-zinc-400 font-mono">ai-worker-1</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
          STATES[idx] === "processing" ? "text-blue-400 border-blue-500/30 bg-blue-500/10" :
          STATES[idx] === "success" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
          STATES[idx] === "error" ? "text-red-400 border-red-500/30 bg-red-500/10" :
          STATES[idx] === "active" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
          "text-zinc-600 border-zinc-800 bg-zinc-900"
        }`}>
          {STATES[idx]}
        </span>
      </div>
    </TraceBeam>
  );
}

function TimelinePreview() {
  const [phase, setPhase] = React.useState(0);
  const ALL_STEPS = [
    { id: "build", label: "Build", status: "done" as const, duration: "12s" },
    { id: "test", label: "Test", status: "done" as const, duration: "4s" },
    { id: "push", label: "Push image", status: "running" as const },
    { id: "deploy", label: "Deploy", status: "queued" as const },
    { id: "check", label: "Health check", status: "queued" as const },
  ];

  return (
    <MicroTimeline
      steps={ALL_STEPS.map((s, i) => ({
        ...s,
        status: i < phase ? "done" : i === phase ? "running" : "queued",
      } as typeof s))}
      size="sm"
    />
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 35, suffix: "", label: "Components" },
  { value: 10, suffix: "", label: "Signature interactions" },
  { value: 9, suffix: "", label: "Categories" },
  { value: 100, suffix: "%", label: "Copy-paste ready" },
];

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Code2 size={17} />,
    title: "Copy-paste, no install",
    description:
      "Every component is a single file. Copy it, paste it, customize with Tailwind. No CLI, no abstraction layers.",
  },
  {
    icon: <Zap size={17} />,
    title: "Spring physics, not keyframes",
    description:
      "All motion uses Framer Motion springs. Interactions feel physical — buttons compress, cards lift, tabs glide.",
  },
  {
    icon: <Sparkles size={17} />,
    title: "Accessibility built in",
    description:
      "ARIA attributes, keyboard nav, focus traps, and prefers-reduced-motion support on every component.",
  },
];

// ── Signature interactions data ───────────────────────────────────────────────
const SIGNATURE_ITEMS = [
  {
    slug: "intent-button",
    label: "IntentButton",
    description: "Async lifecycle: idle → loading → success/error. Pass an async function, it handles the rest.",
    preview: <IntentPreview />,
    span: "lg:col-span-2",
  },
  {
    slug: "hold-to-confirm",
    label: "HoldToConfirm",
    description: "Hold 700ms to confirm dangerous actions. Fills and cancels cleanly.",
    preview: <HoldPreview />,
    span: "",
  },
  {
    slug: "trace-beam",
    label: "TraceBeam",
    description: "State-driven animated border. Communicates processing, success, error.",
    preview: <TraceBeamPreview />,
    span: "lg:col-span-2",
  },
  {
    slug: "micro-timeline",
    label: "MicroTimeline",
    description: "Compact step timeline for deploys, uploads, AI tool calls.",
    preview: <TimelinePreview />,
    span: "",
  },
  {
    slug: "attention-dot",
    label: "AttentionDot",
    description: "Status dot with motion language. Idle, live, warning, critical, resolved.",
    preview: (
      <div className="flex flex-col gap-2.5">
        {(["live", "warning", "critical", "resolved"] as const).map((level) => (
          <AttentionDot key={level} level={level} label={level.charAt(0).toUpperCase() + level.slice(1)} />
        ))}
      </div>
    ),
    span: "",
  },
  {
    slug: "selection-halo",
    label: "SelectionHalo",
    description: "Animated halo moves between selections. For plans, models, options.",
    preview: (
      <SelectionHalo
        options={[
          { id: "pro", label: "Pro", badge: "Popular", price: "$29/mo" },
          { id: "team", label: "Team", price: "$79/mo" },
        ]}
        layout="grid"
      />
    ),
    span: "lg:col-span-2",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Nav />
      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-14 sm:pt-28 sm:pb-20">
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none" aria-hidden="true" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(245,158,11,0.09) 0%, transparent 65%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <Badge variant="amber" className="gap-2 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                35 components · v1.1 · free &amp; open source
              </Badge>
            </motion.div>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-semibold tracking-[-0.03em] text-zinc-50 leading-[1.08]">
                <TextReveal delay={0.1} stagger={0.04} className="justify-center">
                  The feel layer for
                </TextReveal>
                <br />
                <span className="text-amber-400">
                  <TextReveal delay={0.28} stagger={0.04} className="justify-center">
                    modern frontend apps
                  </TextReveal>
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.45 }}
                className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed"
              >
                Copy-paste micro-interactions for buttons, cards, forms, dashboards,
                and AI apps. Not another component library — a feel layer.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.45 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                >
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
                  >
                    Browse components
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </motion.span>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 hover:border-zinc-600 transition-colors"
                >
                  <GitBranch size={14} aria-hidden="true" />
                  View GitHub
                </a>
              </motion.div>

              {/* Install snippet */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-5 flex justify-center"
              >
                <div className="inline-flex items-center gap-3 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2">
                  <span className="text-xs font-mono text-zinc-500">
                    <span className="text-zinc-700">$</span>{" "}
                    <span className="text-zinc-400">npm install framer-motion lucide-react</span>
                  </span>
                  <CopyButton value="npm install framer-motion lucide-react" variant="icon" size="sm" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Core live previews ────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* AI Streaming */}
              <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-colors">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="amber">AI</Badge>
                    <span className="text-xs text-zinc-600 font-mono">AIStreamingText</span>
                  </div>
                  <div className="rounded-xl bg-zinc-950/80 border border-zinc-800/60 p-4 min-h-[72px] flex items-start">
                    <StreamingPreview />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-colors">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge>Feedback</Badge>
                    <span className="text-xs text-zinc-600 font-mono">StatusPulse</span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <StatusPulse status="online" label="API connected" />
                    <StatusPulse status="processing" label="Build running" />
                    <StatusPulse status="error" label="Auth failed" />
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-colors">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge>Loading</Badge>
                    <span className="text-xs text-zinc-600 font-mono">ProgressBeam</span>
                  </div>
                  <ProgressPreview />
                </div>
              </div>

              {/* Fluid Tabs */}
              <div className="rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-colors">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge>Navigation</Badge>
                    <span className="text-xs text-zinc-600 font-mono">FluidTabs</span>
                  </div>
                  <FluidTabs
                    tabs={[
                      { id: "preview", label: "Preview" },
                      { id: "code", label: "Code" },
                      { id: "props", label: "Props" },
                    ]}
                  />
                </div>
              </div>

              {/* Agent */}
              <div className="rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-colors">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="amber">AI</Badge>
                    <span className="text-xs text-zinc-600 font-mono">AgentThinking</span>
                  </div>
                  <AgentThinkingIndicator
                    phase="searching"
                    variant="expanded"
                    messages={["Querying vector DB...", "Found 12 results"]}
                  />
                </div>
              </div>

              {/* Skeleton */}
              <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-colors">
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge>Loading</Badge>
                    <span className="text-xs text-zinc-600 font-mono">SkeletonShimmer</span>
                  </div>
                  <SkeletonShimmer variant="avatar" className="border-0 rounded-none bg-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <section className="py-12 border-y border-zinc-800/50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-zinc-800">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1 px-6">
                  <span className="text-3xl font-semibold tracking-tight text-zinc-50">
                    <SmoothNumber value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="text-sm text-zinc-600">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Signature Interactions ─────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
                <Badge variant="amber" className="gap-2">
                  <FlameKindling size={11} />
                  Signature Interactions
                </Badge>
                <div className="h-px flex-1 bg-zinc-800" aria-hidden="true" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-3">
                  What makes Feel UI different
                </h2>
                <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
                  These are not standard components. They are original interaction
                  primitives invented for production apps — things you won&apos;t find
                  copy-pasted from another library.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIGNATURE_ITEMS.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className={`group rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${item.span}`}
                >
                  {/* Preview */}
                  <div className="p-5 flex items-center justify-center min-h-[100px] bg-[#0d0d0d] border-b border-zinc-800">
                    <div className="w-full max-w-xs">{item.preview}</div>
                  </div>
                  {/* Info */}
                  <div className="p-4 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-50 transition-colors font-mono">
                        {item.label}
                      </span>
                      <ArrowRight size={13} className="text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0" aria-hidden="true" />
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/gallery?category=signature"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                View all signature interactions
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-[#0d0d0d] border-y border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-50 mb-3">
                Built for serious builders
              </h2>
              <p className="text-zinc-600 max-w-sm mx-auto text-sm">
                Not for portfolio sites. For the products developers are proud to ship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-zinc-800 bg-[#111111] p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ────────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 mb-2">
              35 components, 10 categories
            </h2>
            <p className="text-zinc-600 mb-8 text-sm">
              Organized by interaction type, not component type.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const count = REGISTRY.filter((c) => c.category === key).length;
                return (
                  <Link
                    key={key}
                    href={`/gallery?category=${key}`}
                    className="group rounded-xl border border-zinc-800 bg-[#111111] p-4 flex flex-col gap-2.5 hover:border-zinc-700 hover:bg-zinc-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <div className="text-zinc-600 group-hover:text-amber-400 transition-colors">
                      {CATEGORY_ICONS[key]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-200">{cat.label}</p>
                      <p className="text-xs text-zinc-700">{count} component{count !== 1 ? "s" : ""}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-24 sm:py-28 border-t border-zinc-800/50">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-zinc-50 mb-4">
              Copy the feel layer into your product
            </h2>
            <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
              Every component ships with production-ready TypeScript, full accessibility,
              and a copy button. Zero config.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
              >
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-base font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
                >
                  Browse components
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </motion.span>
              <Link
                href="/gallery"
                className="inline-flex items-center h-12 px-6 rounded-xl text-sm font-medium border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 hover:border-zinc-600 transition-colors"
              >
                View gallery
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
