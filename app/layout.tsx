import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Feel UI — Micro-interactions for interfaces that feel alive",
    template: "%s | Feel UI",
  },
  description:
    "Copy-paste motion primitives for buttons, cards, forms, dashboards, and AI apps. Built for developers who want premium feel without rebuilding interaction logic from scratch.",
  keywords: [
    "micro-interactions",
    "react components",
    "framer motion",
    "tailwind",
    "animation",
    "UI library",
    "copy paste",
    "shadcn",
  ],
  openGraph: {
    title: "Feel UI — Micro-interactions for interfaces that feel alive",
    description:
      "Copy-paste motion primitives for buttons, cards, forms, dashboards, and AI apps.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feel UI — Micro-interactions for interfaces that feel alive",
    description: "Copy-paste motion primitives for premium frontend feel.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#0a0a0a] text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
