/**
 * Code snippets for the docs copy-paste blocks.
 * These are the exact component sources, kept in sync with components/library/*.
 */

export const CODE_SNIPPETS: Record<string, string> = {
  "copy-button": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function CopyButton({ value, size = "md", label, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const prefersReduced = useReducedMotion();
  const liveRef = React.useRef<HTMLSpanElement>(null);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (liveRef.current) liveRef.current.textContent = "Copied to clipboard";
      setTimeout(() => {
        setCopied(false);
        if (liveRef.current) liveRef.current.textContent = "";
      }, 2000);
    } catch {}
  }, [value]);

  return (
    <>
      <span ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <motion.button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : \`Copy \${label ?? "to clipboard"}\`}
        className={cn(
          "relative inline-flex items-center justify-center gap-1.5 rounded-md border transition-colors cursor-pointer",
          "border-zinc-700 bg-zinc-900 text-zinc-400",
          "hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
          copied && "border-amber-500/40 bg-amber-500/10 text-amber-400",
          label ? "px-3 h-8 text-xs font-medium" : "h-8 w-8",
          className
        )}
        whileTap={prefersReduced ? {} : { scale: 0.92 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <Check size={14} strokeWidth={2.5} />
              {label && <span>Copied</span>}
            </motion.span>
          ) : (
            <motion.span key="copy"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <Copy size={14} />
              {label && <span>{label}</span>}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}`,

  "loading-button": `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "default" | "primary" | "outline";
  children: React.ReactNode;
}

function Spinner({ variant }: { variant: string }) {
  const color = variant === "primary" ? "text-zinc-950" : "text-zinc-400";
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={\`animate-spin \${color}\`} aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LoadingButton({ loading = false, variant = "default", children, className, disabled, ...props }: LoadingButtonProps) {
  return (
    <button
      type="button"
      disabled={loading || disabled}
      aria-busy={loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150",
        "h-9 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary" && "bg-amber-500 text-zinc-950 hover:bg-amber-400",
        variant === "default" && "bg-zinc-800 text-zinc-50 border border-zinc-700 hover:bg-zinc-700",
        variant === "outline" && "border border-zinc-700 text-zinc-300 hover:bg-zinc-800",
        className
      )}
      {...props}
    >
      {loading && <Spinner variant={variant} />}
      {children}
    </button>
  );
}`,

  "pressable-button": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PressableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default" | "outline";
  children: React.ReactNode;
}

export function PressableButton({ variant = "primary", children, className, ...props }: PressableButtonProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        variant === "primary" && "bg-amber-500 text-zinc-950 hover:bg-amber-400",
        variant === "default" && "bg-zinc-800 text-zinc-50 border border-zinc-700 hover:bg-zinc-700",
        variant === "outline" && "border border-zinc-700 text-zinc-300 hover:bg-zinc-800",
        className
      )}
      whileHover={prefersReduced ? {} : { scale: 1.02 }}
      whileTap={prefersReduced ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.8 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}`,

  "magnetic-button": `"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  children: React.ReactNode;
}

export function MagneticButton({ strength = 0.4, children, className, ...props }: MagneticButtonProps) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLButtonElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 200, damping: 20, mass: 0.5 });

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left - rect.width / 2) * strength);
    rawY.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={onMouseMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
      style={prefersReduced ? {} : { x, y }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 h-9 text-sm font-medium",
        "text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}`,

  "undo-toast": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface UndoToastProps {
  open: boolean;
  message: string;
  onUndo: () => void;
  onClose: () => void;
  duration?: number;
}

export function UndoToast({ open, message, onUndo, onClose, duration = 5000 }: UndoToastProps) {
  const prefersReduced = useReducedMotion();
  const [progress, setProgress] = React.useState(100);
  const startRef = React.useRef(0);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    if (!open) { setProgress(100); return; }
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
      else onClose();
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status" aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl flex items-center gap-3 px-4 py-3 min-w-[280px]"
        >
          <div className="absolute bottom-0 left-0 h-[2px] bg-amber-500" style={{ width: \`\${progress}%\` }} />
          <p className="flex-1 text-sm text-zinc-200 font-medium">{message}</p>
          <button onClick={() => { onUndo(); onClose(); }} className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300">
            <RotateCcw size={12} /> Undo
          </button>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}`,

  "status-pulse": `"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Status = "online" | "processing" | "offline" | "error";

const STATUS_CONFIG: Record<Status, { dot: string; animate: boolean }> = {
  online:     { dot: "bg-emerald-500", animate: true },
  processing: { dot: "bg-amber-400",   animate: true },
  offline:    { dot: "bg-zinc-600",    animate: false },
  error:      { dot: "bg-red-500",     animate: true },
};

interface StatusPulseProps {
  status?: Status;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusPulse({ status = "online", label, size = "md" }: StatusPulseProps) {
  const prefersReduced = useReducedMotion();
  const config = STATUS_CONFIG[status];
  const dotSize = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" }[size];

  return (
    <span className="inline-flex items-center gap-2" aria-label={\`Status: \${label ?? status}\`}>
      <span className="relative flex items-center justify-center">
        {config.animate && !prefersReduced && (
          <span className={\`absolute inline-flex rounded-full opacity-75 \${dotSize} \${config.dot}\`}
            style={{ animation: "pulse-ring 1.5s cubic-bezier(0.455,0.03,0.515,0.955) infinite" }} />
        )}
        <span className={\`relative inline-flex rounded-full \${dotSize} \${config.dot}\`} />
      </span>
      {label && <span className="text-sm text-zinc-400">{label}</span>}
    </span>
  );
}`,

  "success-check": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SuccessCheckProps {
  size?: number;
  color?: "amber" | "emerald" | "white";
  onComplete?: () => void;
}

export function SuccessCheck({ size = 48, color = "amber", onComplete }: SuccessCheckProps) {
  const prefersReduced = useReducedMotion();
  const colorMap = { amber: "#f59e0b", emerald: "#10b981", white: "#fafafa" };
  const stroke = colorMap[color];
  const sw = size / 16;
  const cx = size / 2;

  return (
    <div role="img" aria-label="Success" className="inline-flex">
      <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`} fill="none">
        <motion.circle cx={cx} cy={cx} r={cx - sw * 1.5} stroke={stroke} strokeWidth={sw}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.4 }}
          style={{ rotate: -90, transformOrigin: "center" }}
        />
        <motion.path
          d={\`M \${cx * 0.55} \${cx} l \${cx * 0.3} \${cx * 0.3} l \${cx * 0.45} -\${cx * 0.45}\`}
          stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={prefersReduced ? { duration: 0 } : { pathLength: { delay: 0.25, duration: 0.45 }, opacity: { delay: 0.25, duration: 0.1 } }}
          onAnimationComplete={onComplete}
        />
      </svg>
    </div>
  );
}`,

  "error-shake": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ErrorShakeProps {
  error: boolean;
  children: React.ReactNode;
  onAnimationComplete?: () => void;
}

export function ErrorShake({ error, children, onAnimationComplete }: ErrorShakeProps) {
  const prefersReduced = useReducedMotion();
  const [key, setKey] = React.useState(0);
  const prevError = React.useRef(false);

  React.useEffect(() => {
    if (error && !prevError.current) setKey((k) => k + 1);
    prevError.current = error;
  }, [error]);

  return (
    <motion.div
      key={key}
      animate={prefersReduced || !error ? { x: 0 } : {
        x: [0, -6, 6, -5, 5, -3, 3, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}`,

  "spotlight-card": `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export function SpotlightCard({ children, spotlightColor = "rgba(245,158,11,0.08)", className }: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [hovering, setHovering] = React.useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn("relative rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden hover:border-zinc-700 transition-colors", className)}
      style={{ background: hovering ? \`radial-gradient(300px circle at \${pos.x}px \${pos.y}px, \${spotlightColor}, transparent 70%), #111111\` : "#111111" }}
    >
      {children}
    </div>
  );
}`,

  "border-beam-card": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamCardProps {
  children: React.ReactNode;
  beamColor?: string;
  duration?: number;
  className?: string;
}

export function BorderBeamCard({ children, beamColor = "#f59e0b", duration = 4, className }: BorderBeamCardProps) {
  const prefersReduced = useReducedMotion();
  return (
    <div className={cn("relative rounded-2xl p-[1px] overflow-hidden", className)}>
      <div className="absolute inset-0 rounded-2xl border border-zinc-800" />
      {!prefersReduced && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <motion.div
            className="absolute inset-[-100%]"
            style={{ background: \`conic-gradient(from 0deg, transparent 0deg, \${beamColor} 60deg, transparent 120deg)\` }}
            animate={{ rotate: 360 }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
      <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-[#111111]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}`,

  "shine-card": `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ShineCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setStyle({ background: \`radial-gradient(circle at \${x}% \${y}%, rgba(255,255,255,0.06), transparent 60%)\`, opacity: 1 });
      }}
      onMouseLeave={() => setStyle({ opacity: 0 })}
      className={cn("relative rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden hover:border-zinc-700 transition-colors", className)}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300" style={style} />
      {children}
    </div>
  );
}`,

  "expandable-card": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  title: string;
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ExpandableCard({ title, summary, children, defaultOpen = false }: ExpandableCardProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const prefersReduced = useReducedMotion();
  const id = React.useId();

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden hover:border-zinc-700 transition-colors">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex items-start justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-zinc-100">{title}</span>
          <span className="text-sm text-zinc-500">{summary}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.2 }}
          className="text-zinc-500 flex-shrink-0 mt-0.5"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={id} role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pt-0 border-t border-zinc-800">
              <div className="pt-4 text-sm text-zinc-400 leading-relaxed">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,

  "text-reveal": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  delay?: number;
  stagger?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function TextReveal({ children, delay = 0, stagger = 0.05, className, as: Tag = "p" }: TextRevealProps) {
  const prefersReduced = useReducedMotion();
  const words = children.split(" ");

  if (prefersReduced) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag className={cn("flex flex-wrap gap-x-[0.25em]", className)} aria-label={children}>
      {words.map((word, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * stagger, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}`,

  "smooth-number": `"use client";

import * as React from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface SmoothNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function SmoothNumber({ value, decimals = 0, prefix = "", suffix = "", className }: SmoothNumberProps) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const [display, setDisplay] = React.useState(value.toFixed(decimals));

  React.useEffect(() => { motionValue.set(value); }, [value, motionValue]);
  React.useEffect(() => {
    return spring.on("change", (v) => setDisplay(v.toFixed(decimals)));
  }, [spring, decimals]);

  return (
    <span className={className} aria-live="polite" aria-label={\`\${prefix}\${value.toFixed(decimals)}\${suffix}\`}>
      <span aria-hidden="true">{prefix}{display}{suffix}</span>
    </span>
  );
}`,

  "typing-text": `"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

interface TypingTextProps {
  phrases: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypingText({ phrases, typingSpeed = 60, deleteSpeed = 30, pauseDuration = 2000, className }: TypingTextProps) {
  const prefersReduced = useReducedMotion();
  const [text, setText] = React.useState("");
  const [phraseIdx, setPhraseIdx] = React.useState(0);
  const [phase, setPhase] = React.useState<"typing" | "pausing" | "deleting">("typing");

  React.useEffect(() => {
    if (prefersReduced) return;
    const phrase = phrases[phraseIdx];
    if (phase === "typing") {
      if (text.length < phrase.length) {
        const t = setTimeout(() => setText(phrase.slice(0, text.length + 1)), typingSpeed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), pauseDuration);
        return () => clearTimeout(t);
      }
    }
    if (phase === "pausing") { setPhase("deleting"); }
    if (phase === "deleting") {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setPhase("typing");
      }
    }
  }, [text, phase, phraseIdx, phrases, typingSpeed, deleteSpeed, pauseDuration, prefersReduced]);

  if (prefersReduced) return <span className={className}>{phrases[0]}</span>;

  return (
    <span className={className} aria-live="off">
      <span aria-hidden="true">
        {text}
        <span className="animate-cursor-blink inline-block w-[2px] h-[1em] bg-amber-400 ml-0.5 align-text-bottom" />
      </span>
    </span>
  );
}`,

  "scramble-text": `"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";

interface ScrambleTextProps {
  text: string;
  duration?: number;
  triggerOnHover?: boolean;
  className?: string;
}

export function ScrambleText({ text, duration = 800, triggerOnHover = false, className }: ScrambleTextProps) {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = React.useState(text);
  const rafRef = React.useRef(0);

  const scramble = React.useCallback(() => {
    if (prefersReduced) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(progress * text.length);
      setDisplayed(text.split("").map((c, i) =>
        c === " " ? " " : i < revealed ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(""));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setDisplayed(text);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, duration, prefersReduced]);

  React.useEffect(() => { if (!triggerOnHover) scramble(); }, [scramble, triggerOnHover]);

  return (
    <span className={\`font-mono \${className}\`} aria-label={text}
      onMouseEnter={() => triggerOnHover && scramble()}>
      <span aria-hidden="true">{displayed}</span>
    </span>
  );
}`,

  "skeleton-shimmer": `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-md bg-zinc-800",
      "before:absolute before:inset-0 before:-translate-x-full",
      "before:bg-gradient-to-r before:from-transparent before:via-zinc-700/50 before:to-transparent",
      "before:animate-shimmer",
      className
    )} />
  );
}

interface SkeletonShimmerProps {
  variant?: "card" | "text" | "avatar";
  lines?: number;
  className?: string;
}

export function SkeletonShimmer({ variant = "card", lines = 3, className }: SkeletonShimmerProps) {
  return (
    <div role="status" aria-label="Loading" className={cn("rounded-2xl border border-zinc-800 bg-[#111111]", className)}>
      {variant === "card" && (
        <div className="p-5 flex flex-col gap-4">
          <Bone className="h-36 rounded-xl" />
          <div className="flex flex-col gap-2.5">
            <Bone className="h-4 w-3/4" />
            {Array.from({ length: lines - 1 }, (_, i) => <Bone key={i} className="h-3" />)}
          </div>
        </div>
      )}
      {variant === "avatar" && (
        <div className="p-4 flex items-center gap-3">
          <Bone className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Bone className="h-3.5 w-1/3" />
            <Bone className="h-3 w-1/2" />
          </div>
        </div>
      )}
      {variant === "text" && (
        <div className="p-5 flex flex-col gap-2.5">
          {Array.from({ length: lines }, (_, i) => (
            <Bone key={i} className={cn("h-3.5", i === lines - 1 ? "w-2/3" : "w-full")} />
          ))}
        </div>
      )}
    </div>
  );
}`,

  "progress-beam": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBeamProps {
  progress?: number;
  indeterminate?: boolean;
  color?: "amber" | "blue" | "emerald";
  height?: number;
}

export function ProgressBeam({ progress = 0, indeterminate = false, color = "amber", height = 2 }: ProgressBeamProps) {
  const prefersReduced = useReducedMotion();
  const clr = { amber: "bg-amber-500", blue: "bg-blue-500", emerald: "bg-emerald-500" }[color];

  return (
    <div role="progressbar" aria-valuenow={indeterminate ? undefined : progress}
      aria-valuemin={0} aria-valuemax={100}
      className="relative w-full overflow-hidden rounded-full bg-zinc-800" style={{ height }}>
      {indeterminate && !prefersReduced ? (
        <motion.div className={cn("absolute h-full rounded-full", clr)}
          initial={{ left: "-35%", width: "35%" }}
          animate={{ left: ["−35%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
        />
      ) : (
        <motion.div className={cn("h-full rounded-full", clr)}
          initial={{ width: "0%" }}
          animate={{ width: \`\${Math.min(100, Math.max(0, progress))}%\` }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </div>
  );
}`,

  "fluid-tabs": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FluidTabsProps {
  tabs: Array<{ id: string; label: string }>;
  defaultTab?: string;
  onChange?: (id: string) => void;
}

export function FluidTabs({ tabs, defaultTab, onChange }: FluidTabsProps) {
  const [active, setActive] = React.useState(defaultTab ?? tabs[0]?.id);
  const prefersReduced = useReducedMotion();

  return (
    <div role="tablist" className="inline-flex items-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 p-1">
      {tabs.map((tab, i) => (
        <button key={tab.id} role="tab" aria-selected={active === tab.id}
          onClick={() => { setActive(tab.id); onChange?.(tab.id); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setActive(tabs[(i + 1) % tabs.length].id);
            if (e.key === "ArrowLeft") setActive(tabs[(i - 1 + tabs.length) % tabs.length].id);
          }}
          tabIndex={active === tab.id ? 0 : -1}
          className={cn(
            "relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors z-10",
            active === tab.id ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {active === tab.id && (
            <motion.span layoutId="pill"
              className="absolute inset-0 rounded-lg bg-zinc-800 border border-zinc-700"
              transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              aria-hidden="true"
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}`,

  "command-reveal": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Command, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
}

export function CommandReveal({ items, placeholder = "Search commands..." }: {
  items: CommandItem[];
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const prefersReduced = useReducedMotion();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = query ? items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  ) : items;

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => { if (!v) setTimeout(() => inputRef.current?.focus(), 50); return !v; });
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <>
      <button onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-colors">
        <Search size={14} /> <span>Search</span>
        <span className="flex items-center gap-0.5 text-xs text-zinc-600 ml-1"><Command size={11} /><span>K</span></span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} />
            <motion.div role="dialog" aria-modal="true"
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.18 }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
                if (e.key === "ArrowDown") setSel((i) => Math.min(i + 1, filtered.length - 1));
                if (e.key === "ArrowUp") setSel((i) => Math.max(i - 1, 0));
                if (e.key === "Enter" && filtered[sel]) { filtered[sel].action(); setOpen(false); }
              }}
            >
              <div className="rounded-2xl border border-zinc-700 bg-zinc-950/95 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <Search size={16} className="text-zinc-500" />
                  <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder} className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none" />
                  <button onClick={() => setOpen(false)} className="text-zinc-600 hover:text-zinc-300"><X size={14} /></button>
                </div>
                <ul className="max-h-72 overflow-y-auto py-2">
                  {filtered.map((item, i) => (
                    <li key={item.id} role="option" aria-selected={i === sel}
                      className={cn("flex items-center gap-3 px-4 py-2.5 cursor-pointer",
                        i === sel ? "bg-amber-500/10 text-zinc-50" : "text-zinc-400 hover:bg-zinc-900"
                      )}
                      onMouseEnter={() => setSel(i)}
                      onClick={() => { item.action(); setOpen(false); }}>
                      {item.icon && <span className={i === sel ? "text-amber-400" : "text-zinc-600"}>{item.icon}</span>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.description && <p className="text-xs text-zinc-600">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}`,

  "floating-input": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function FloatingInput({ label, id, type = "text", value, onChange, error }: FloatingInputProps) {
  const [focused, setFocused] = React.useState(false);
  const prefersReduced = useReducedMotion();
  const floating = focused || value.length > 0;

  return (
    <div className="relative">
      <input id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        aria-invalid={!!error} aria-describedby={error ? \`\${id}-error\` : undefined}
        className={cn(
          "h-14 w-full rounded-xl bg-zinc-900 border px-4 pt-5 pb-2 text-sm text-zinc-50 placeholder-transparent",
          "focus:outline-none transition-colors",
          error ? "border-red-500/60" : "border-zinc-800 hover:border-zinc-700 focus:border-amber-500/60"
        )}
        placeholder={label}
      />
      <motion.label htmlFor={id}
        animate={prefersReduced ? {} : floating ? { y: -10, scale: 0.78 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-sm origin-left pointer-events-none transition-colors",
          focused && !error ? "text-amber-400" : error ? "text-red-400" : "text-zinc-500"
        )}
      >
        {label}
      </motion.label>
      {error && <p id={\`\${id}-error\`} role="alert" className="mt-1.5 text-xs text-red-400 pl-1">{error}</p>}
    </div>
  );
}`,

  "file-dropzone": `"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

export function FileDropzone({ onFiles, accept, multiple = true }: FileDropzoneProps) {
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = multiple ? [...files, ...Array.from(list)] : Array.from(list).slice(0, 1);
    setFiles(arr); onFiles(arr);
  };

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        animate={dragging ? { scale: 1.01 } : { scale: 1 }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed h-36 cursor-pointer transition-colors",
          dragging ? "border-amber-500/60 bg-amber-500/5" : "border-zinc-800 hover:border-zinc-700"
        )}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple}
          className="sr-only" onChange={(e) => addFiles(e.target.files)} />
        <Upload size={24} className={dragging ? "text-amber-400" : "text-zinc-600"} />
        <p className="text-sm text-zinc-400">
          <span className="text-amber-400 font-medium">Click to upload</span> or drag and drop
        </p>
      </motion.div>
      <AnimatePresence>
        {files.map((file, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5">
            <File size={14} className="text-zinc-500" />
            <span className="flex-1 text-xs font-medium text-zinc-200 truncate">{file.name}</span>
            <button onClick={(e) => { e.stopPropagation(); const n = files.filter((_, j) => j !== i); setFiles(n); onFiles(n); }}
              className="text-zinc-600 hover:text-zinc-300"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}`,

  "bottom-sheet": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div role="dialog" aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg rounded-t-3xl border border-zinc-800 bg-zinc-950 shadow-2xl"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={prefersReduced ? {} : { type: "spring", stiffness: 350, damping: 35 }}
            drag="y" dragConstraints={{ top: 0 }} dragElastic={{ bottom: 0.3 }}
            onDragEnd={(_, info) => { if (info.velocity.y > 200 || info.offset.y > 100) onClose(); }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-5 pb-3">
                <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
                <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200"><X size={16} /></button>
              </div>
            )}
            <div className="px-5 pb-8 pt-2 overflow-y-auto max-h-[60vh]">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}`,

  "ai-streaming-text": `"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AIStreamingTextProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function AIStreamingText({ text, speed = 20, showCursor = true, onComplete, className }: AIStreamingTextProps) {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    setDisplayed(""); setDone(false);
    if (prefersReduced) { setDisplayed(text); setDone(true); onComplete?.(); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++; setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); onComplete?.(); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, prefersReduced, onComplete]);

  return (
    <span className={cn("inline", className)} aria-live="polite">
      {displayed}
      {showCursor && (
        <span className={cn(
          "animate-cursor-blink inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom",
          done ? "bg-amber-400/40" : "bg-amber-400"
        )} aria-hidden="true" />
      )}
    </span>
  );
}`,

  "agent-thinking-indicator": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentThinkingIndicatorProps {
  messages?: string[];
  interval?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AgentThinkingIndicator({ messages, interval = 2000, size = "md", className }: AgentThinkingIndicatorProps) {
  const prefersReduced = useReducedMotion();
  const [idx, setIdx] = React.useState(0);
  const dotSize = { sm: "h-1 w-1", md: "h-1.5 w-1.5", lg: "h-2 w-2" }[size];

  React.useEffect(() => {
    if (!messages || messages.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), interval);
    return () => clearInterval(t);
  }, [messages, interval]);

  return (
    <div role="status" aria-live="polite" aria-label={messages?.[idx] ?? "Thinking"}
      className={cn("inline-flex items-center gap-2.5", className)}>
      <div className="flex items-center gap-1">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span key={i} className={cn("rounded-full bg-zinc-500", dotSize)}
            animate={prefersReduced ? {} : { y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.0, repeat: Infinity, delay, ease: "easeInOut" }}
          />
        ))}
      </div>
      {messages && <motion.span key={messages[idx]} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-sm text-zinc-500">{messages[idx]}</motion.span>}
    </div>
  );
}`,

  "hold-to-confirm": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoldState = "idle" | "holding" | "confirming" | "success";

interface HoldToConfirmProps {
  onConfirm: () => void | Promise<void>;
  holdDuration?: number;
  label?: string;
  holdLabel?: string;
  successLabel?: string;
  variant?: "destructive" | "primary" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function HoldToConfirm({
  onConfirm,
  holdDuration = 700,
  label = "Hold to delete",
  holdLabel = "Keep holding…",
  successLabel = "Confirmed",
  variant = "destructive",
  size = "md",
  className,
  disabled,
}: HoldToConfirmProps) {
  const prefersReduced = useReducedMotion();
  const [holdState, setHoldState] = React.useState<HoldState>("idle");
  const [fillPercent, setFillPercent] = React.useState(0);
  const isHolding = React.useRef(false);
  const rafRef = React.useRef<number>(0);
  const startRef = React.useRef<number>(0);

  const startHold = () => {
    if (disabled || holdState === "success") return;
    if (prefersReduced) {
      setHoldState("success");
      void Promise.resolve(onConfirm());
      setTimeout(() => { setHoldState("idle"); }, 1500);
      return;
    }
    isHolding.current = true;
    startRef.current = performance.now();
    setHoldState("holding");
    const tick = (now: number) => {
      if (!isHolding.current) return;
      const pct = Math.min(((now - startRef.current) / holdDuration) * 100, 100);
      setFillPercent(pct);
      if (pct >= 100) {
        isHolding.current = false;
        setHoldState("confirming");
        Promise.resolve(onConfirm()).then(() => {
          setHoldState("success");
          setTimeout(() => { setHoldState("idle"); setFillPercent(0); }, 1500);
        });
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    if (!isHolding.current) return;
    isHolding.current = false;
    cancelAnimationFrame(rafRef.current);
    setHoldState("idle");
    setFillPercent(0);
  };

  const FILL_COLOR = variant === "destructive" ? "bg-red-500/25"
    : variant === "primary" ? "bg-amber-500/30" : "bg-zinc-700";

  const SIZE_MAP = { sm: "h-8 px-3 text-xs rounded-md", md: "h-9 px-4 text-sm rounded-lg", lg: "h-10 px-5 text-sm rounded-lg" };

  return (
    <button
      type="button"
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled || holdState === "confirming" || holdState === "success"}
      aria-pressed={holdState === "holding"}
      className={\`relative inline-flex items-center justify-center gap-2 font-medium overflow-hidden transition-colors select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 \${SIZE_MAP[size]} \${className ?? ""}\`}
    >
      {!prefersReduced && (
        <span className={\`absolute inset-0 rounded-[inherit] origin-left \${FILL_COLOR}\`}
          style={{ transform: \`scaleX(\${fillPercent / 100})\`, transformOrigin: "left" }} />
      )}
      <AnimatePresence mode="wait" initial={false}>
        {holdState === "success" ? (
          <motion.span key="success" className="relative z-10"
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            {successLabel}
          </motion.span>
        ) : holdState === "holding" || holdState === "confirming" ? (
          <motion.span key="holding" className="relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}>
            {holdLabel}
          </motion.span>
        ) : (
          <motion.span key="idle" className="relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}`,

  "intent-button": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type IntentState = "idle" | "loading" | "success" | "error";

interface IntentButtonProps {
  onClick?: () => void | Promise<void>;
  state?: IntentState;
  variant?: "primary" | "default" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  successLabel?: string;
  errorLabel?: string;
  successDuration?: number;
  errorDuration?: number;
  disabled?: boolean;
  className?: string;
}

export function IntentButton({
  onClick,
  state: externalState,
  variant = "primary",
  size = "md",
  children,
  successLabel = "Done",
  errorLabel = "Try again",
  successDuration = 1800,
  errorDuration = 2500,
  disabled,
  className,
}: IntentButtonProps) {
  const prefersReduced = useReducedMotion();
  const [internalState, setInternalState] = React.useState<IntentState>("idle");
  const state = externalState ?? internalState;

  const handleClick = async () => {
    if (!onClick || disabled || state === "loading") return;
    if (externalState) { onClick(); return; }
    setInternalState("loading");
    try {
      await onClick();
      setInternalState("success");
      setTimeout(() => setInternalState("idle"), successDuration);
    } catch {
      setInternalState("error");
      setTimeout(() => setInternalState("idle"), errorDuration);
    }
  };

  return (
    <motion.span className="inline-block"
      whileHover={state !== "idle" || prefersReduced ? {} : { scale: 1.02 }}
      whileTap={prefersReduced ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 26, mass: 0.7 }}>
      <button type="button" onClick={handleClick}
        disabled={disabled || state === "loading"}
        aria-busy={state === "loading"}
        className={cn("relative inline-flex items-center justify-center gap-2 font-medium overflow-hidden transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          size === "sm" ? "h-8 px-3 text-xs rounded-md" : size === "lg" ? "h-10 px-5 text-sm rounded-lg" : size === "xl" ? "h-12 px-6 text-base rounded-xl" : "h-9 px-4 text-sm rounded-lg",
          className)}>
        <AnimatePresence mode="wait" initial={false}>
          {state === "loading" && (
            <motion.span key="loading" className="flex items-center gap-2"
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }} exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}>
              <Loader2 size={14} className="animate-spin" /><span>{children}</span>
            </motion.span>
          )}
          {state === "success" && (
            <motion.span key="success" className="flex items-center gap-2"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }} exit={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.22, type: "spring", stiffness: 500, damping: 22 }}>
              <Check size={14} strokeWidth={2.5} /><span>{successLabel}</span>
            </motion.span>
          )}
          {state === "error" && (
            <motion.span key="error" className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, x: [0, -5, 5, -4, 4, -2, 2, 0] }}
              transition={{ opacity: { duration: 0.1 }, x: { duration: 0.38 } }}
              exit={{ opacity: 0 }}>
              <AlertCircle size={14} /><span>{errorLabel}</span>
            </motion.span>
          )}
          {state === "idle" && (
            <motion.span key="idle"
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }} exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}>
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.span>
  );
}`,

  "selection-halo": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectionOption {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  price?: string;
}

interface SelectionHaloProps {
  options: SelectionOption[];
  defaultSelected?: string;
  onChange?: (id: string) => void;
  layout?: "horizontal" | "grid";
  className?: string;
}

export function SelectionHalo({ options, defaultSelected, onChange, layout = "horizontal", className }: SelectionHaloProps) {
  const [selected, setSelected] = React.useState(defaultSelected ?? options[0]?.id);
  const prefersReduced = useReducedMotion();
  const handleSelect = (id: string) => { setSelected(id); onChange?.(id); };
  return (
    <div role="radiogroup" className={cn("relative flex", layout === "grid" ? "grid grid-cols-2 gap-3" : "flex-row gap-2 flex-wrap", className)}>
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <div key={opt.id} className="relative">
            {isSelected && (
              <motion.div layoutId="selection-halo"
                className="absolute inset-0 rounded-xl border border-amber-500/50"
                style={{ boxShadow: "0 0 0 1px rgba(245,158,11,0.5), 0 0 14px -2px rgba(245,158,11,0.2)" }}
                transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 28 }} />
            )}
            <button type="button" role="radio" aria-checked={isSelected} onClick={() => handleSelect(opt.id)}
              className={cn("relative w-full flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                isSelected ? "border-transparent bg-zinc-900" : "border-zinc-800 bg-[#111111] hover:border-zinc-700")}>
              <div className="flex items-start justify-between gap-2">
                <span className={cn("text-sm font-semibold", isSelected ? "text-zinc-50" : "text-zinc-300")}>{opt.label}</span>
                {opt.badge && <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border", isSelected ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "bg-zinc-800 border-zinc-700 text-zinc-500")}>{opt.badge}</span>}
              </div>
              {opt.description && <span className={cn("text-xs", isSelected ? "text-zinc-400" : "text-zinc-600")}>{opt.description}</span>}
              {opt.price && <span className={cn("text-xs font-mono", isSelected ? "text-amber-400" : "text-zinc-600")}>{opt.price}</span>}
            </button>
          </div>
        );
      })}
    </div>
  );
}`,

  "attention-dot": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type AttentionLevel = "idle" | "live" | "warning" | "critical" | "resolved";

interface AttentionDotProps {
  level?: AttentionLevel;
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const CONFIG = {
  idle: { dot: "bg-zinc-600", ring: "bg-zinc-600", text: "text-zinc-600", interval: 0, scale: 0 },
  live: { dot: "bg-emerald-500", ring: "bg-emerald-500", text: "text-emerald-400", interval: 2.5, scale: 2.8 },
  warning: { dot: "bg-amber-400", ring: "bg-amber-400", text: "text-amber-400", interval: 1.8, scale: 2.2 },
  critical: { dot: "bg-red-500", ring: "bg-red-500", text: "text-red-400", interval: 0.8, scale: 2.5 },
  resolved: { dot: "bg-emerald-500", ring: "bg-emerald-500", text: "text-emerald-400", interval: 0, scale: 0 },
};

export function AttentionDot({ level = "idle", label, size = "md", showLabel = true, className }: AttentionDotProps) {
  const prefersReduced = useReducedMotion();
  const config = CONFIG[level];
  const dotClass = size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2";
  const shouldPulse = config.interval > 0 && !prefersReduced;
  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={label ? \`\${label}: \${level}\` : level}>
      <span className="relative inline-flex items-center justify-center">
        {shouldPulse && (
          <motion.span className={cn("absolute rounded-full", dotClass, config.ring)}
            animate={{ scale: [1, config.scale], opacity: [0.7, 0] }}
            transition={{ duration: config.interval, repeat: Infinity, ease: "easeOut" }} />
        )}
        <AnimatePresence mode="wait">
          {level === "resolved" ? (
            <motion.span key="resolved"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              className={cn("relative inline-flex items-center justify-center rounded-full bg-emerald-500", dotClass)}>
              <Check style={{ width: "60%", height: "60%" }} strokeWidth={3} className="text-white" />
            </motion.span>
          ) : (
            <motion.span key={level}
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 20 }}
              className={cn("inline-flex rounded-full", dotClass, config.dot)} />
          )}
        </AnimatePresence>
      </span>
      {showLabel && label && <span className={cn(size === "sm" ? "text-[11px]" : "text-xs", config.text)}>{label}</span>}
    </span>
  );
}`,

  "trace-beam": `"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TraceState = "idle" | "active" | "processing" | "success" | "error";

interface TraceBeamProps {
  children: React.ReactNode;
  state?: TraceState;
  className?: string;
}

const STATE_CONFIG = {
  idle: { color: "transparent", speed: 0, animate: false, opacity: 0 },
  active: { color: "#f59e0b", speed: 3, animate: true, opacity: 0.85 },
  processing: { color: "#60a5fa", speed: 1.8, animate: true, opacity: 1 },
  success: { color: "#10b981", speed: 4, animate: true, opacity: 0.9 },
  error: { color: "#ef4444", speed: 1.2, animate: true, opacity: 0.9 },
};

export function TraceBeam({ children, state = "idle", className }: TraceBeamProps) {
  const prefersReduced = useReducedMotion();
  const config = STATE_CONFIG[state];
  const showBeam = config.animate && !prefersReduced;
  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      <div className={cn("absolute inset-0 rounded-2xl border transition-colors duration-400",
        state === "idle" ? "border-zinc-800" : state === "success" ? "border-emerald-500/20" :
        state === "error" ? "border-red-500/20" : state === "processing" ? "border-blue-500/20" : "border-amber-500/20")} />
      {showBeam && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div className="absolute inset-[-120%]"
            style={{ background: \`conic-gradient(from 0deg, transparent 0deg, \${config.color} 30deg, transparent 80deg)\`, opacity: config.opacity }}
            animate={{ rotate: 360 }}
            transition={{ duration: config.speed, repeat: Infinity, ease: "linear" }} />
          <div className="absolute inset-[1.5px] rounded-[calc(1rem-1.5px)] bg-inherit" />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}`,

  "smart-copy-block": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartCopyBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  variant?: "default" | "terminal" | "minimal";
  className?: string;
}

export function SmartCopyBlock({ code, language = "tsx", filename, showLineNumbers = true, highlightLines = [], variant = "default", className }: SmartCopyBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null);
  const prefersReduced = useReducedMotion();
  const lines = code.trim().split("\\n");

  const handleCopy = async () => {
    if (copied) return;
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/40">
        <span className="text-[11px] text-zinc-500 font-mono">{filename ?? language}</span>
        <motion.button type="button" onClick={handleCopy} aria-label={copied ? "Copied" : "Copy code"}
          className={cn("flex items-center gap-1.5 h-6 px-2 rounded border text-[10px] font-medium transition-colors cursor-pointer",
            copied ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-zinc-700/60 bg-zinc-900 text-zinc-600 hover:text-zinc-200 hover:border-zinc-600")}
          whileTap={{ scale: 0.9 }}>
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span key="check" className="flex items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Check size={10} strokeWidth={2.5} /> Copied
              </motion.span>
            ) : (
              <motion.span key="copy" className="flex items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Copy size={10} /> Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <pre className="overflow-x-auto py-4 text-xs font-mono leading-[1.75]">
        <code>
          {lines.map((line, i) => (
            <div key={i} onMouseEnter={() => setHoveredLine(i + 1)} onMouseLeave={() => setHoveredLine(null)}
              className={cn("flex px-4 gap-4 transition-colors duration-75",
                highlightLines.includes(i + 1) && "bg-amber-500/8 border-l-2 border-amber-500/60",
                hoveredLine === i + 1 && !highlightLines.includes(i + 1) && "bg-zinc-800/40")}>
              {showLineNumbers && <span className="select-none w-5 text-right text-zinc-800 flex-shrink-0">{i + 1}</span>}
              <span className="text-zinc-300">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}`,

  "reveal-stack": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealStackItem {
  id: string;
  content: React.ReactNode;
}

interface RevealStackProps {
  items: RevealStackItem[];
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
}

export function RevealStack({ items, staggerDelay = 0.07, className, itemClassName }: RevealStackProps) {
  const prefersReduced = useReducedMotion();
  return (
    <div className={cn("flex flex-col gap-2", className)} role="list">
      <AnimatePresence initial={true}>
        {items.map((item, i) => (
          <motion.div key={item.id} role="listitem"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={prefersReduced ? { duration: 0 } : { delay: i * staggerDelay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(itemClassName)}>
            {item.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}`,

  "micro-timeline": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "queued" | "running" | "done" | "failed" | "skipped";

interface TimelineStep {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
  duration?: string;
}

interface MicroTimelineProps {
  steps: TimelineStep[];
  variant?: "vertical" | "horizontal";
  size?: "sm" | "md";
  className?: string;
}

const STATUS_CONFIG = {
  queued: { icon: <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />, dot: "border border-zinc-700 bg-zinc-900", text: "text-zinc-600", lineColor: "bg-zinc-800" },
  running: { icon: <Loader2 size={10} className="animate-spin text-amber-400" />, dot: "border border-amber-500/40 bg-amber-500/10", text: "text-zinc-200", lineColor: "bg-zinc-800" },
  done: { icon: <Check size={10} strokeWidth={2.5} className="text-emerald-400" />, dot: "border border-emerald-500/30 bg-emerald-500/10", text: "text-zinc-400", lineColor: "bg-emerald-500/20" },
  failed: { icon: <X size={10} strokeWidth={2.5} className="text-red-400" />, dot: "border border-red-500/30 bg-red-500/10", text: "text-red-400", lineColor: "bg-red-500/20" },
  skipped: { icon: <span className="h-1 w-1 rounded-full bg-zinc-700" />, dot: "border border-zinc-800 bg-zinc-900", text: "text-zinc-700", lineColor: "bg-zinc-800" },
};

export function MicroTimeline({ steps, variant = "vertical", size = "md", className }: MicroTimelineProps) {
  const prefersReduced = useReducedMotion();
  const dotSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <div className={cn("flex flex-col", className)} role="list" aria-label="Progress steps">
      {steps.map((step, i) => {
        const config = STATUS_CONFIG[step.status];
        const isLast = i === steps.length - 1;
        return (
          <motion.div key={step.id} role="listitem"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.22 }}
            className="flex gap-3">
            <div className="flex flex-col items-center gap-0">
              <div className={cn("flex-shrink-0 flex items-center justify-center rounded-full mt-0.5", dotSize, config.dot)}>
                {config.icon}
              </div>
              {!isLast && <div className={cn("w-px flex-1 min-h-[20px] my-1 transition-colors duration-300", config.lineColor)} />}
            </div>
            <div className={cn("pb-4", isLast && "pb-0")}>
              <div className="flex items-center gap-2">
                <span className={cn(size === "sm" ? "text-xs" : "text-sm", "font-medium leading-[1.4]", config.text)}>{step.label}</span>
                {step.duration && <span className="text-[11px] text-zinc-700 font-mono">{step.duration}</span>}
              </div>
              {step.detail && <p className="text-[11px] mt-0.5 text-zinc-600">{step.detail}</p>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}`,

  "soft-collapse": `"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SoftCollapseProps {
  children: React.ReactNode;
  title?: string;
  summary?: string;
  defaultOpen?: boolean;
  variant?: "card" | "bare" | "faq";
  className?: string;
}

export function SoftCollapse({ children, title, summary, defaultOpen = false, variant = "card", className }: SoftCollapseProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const prefersReduced = useReducedMotion();
  const panelId = React.useId();
  return (
    <div className={cn(
      variant === "card" && "rounded-2xl border bg-[#111111] overflow-hidden transition-colors",
      variant === "faq" && "border-b border-zinc-800/60 last:border-0",
      open && variant === "card" ? "border-zinc-700" : "border-zinc-800",
      className)}>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(v => !v)}
        className={cn("w-full flex items-start justify-between gap-4 text-left",
          variant === "card" && "p-5", variant === "faq" && "py-4", variant === "bare" && "py-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset rounded-lg")}>
        <div className="flex-1 min-w-0">
          {title && <p className="text-sm font-semibold text-zinc-100">{title}</p>}
          {summary && <p className="text-sm text-zinc-500 mt-0.5">{summary}</p>}
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="flex-shrink-0 mt-0.5 text-zinc-600">
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={panelId} role="region"
            initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}>
            <div className={cn(variant === "card" && "px-5 pb-5 border-t border-zinc-800", variant === "faq" && "pb-4 border-t border-zinc-800/60 pt-4", variant === "bare" && "pt-2")}>
              <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
};
