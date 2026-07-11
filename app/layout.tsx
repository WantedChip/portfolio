import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

import { SiteModeProvider } from "@/components/console/site-mode-context";
import { CalibrationModal } from "@/components/console/calibration-modal";
import { QuasarAnchor } from "@/components/console/quasar-anchor";
import { Nav } from "@/components/console/nav";
import { AudioToggle } from "@/components/console/audio-toggle";

// ── Display / Headings ────────────────────────────────────────────────────────
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

// ── Console / Data / Telemetry ────────────────────────────────────────────────
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// ── Body Copy ─────────────────────────────────────────────────────────────────
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Soham — Portfolio",
    template: "%s | Soham",
  },
  description:
    "The intersection of human curiosity and raw engineering. Projects, tools, and ideas in orbit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jetbrainsMono.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * SiteModeProvider wraps everything — every child can consume
         * experienceMode and soundEnabled via useSiteMode().
         *
         * Shell elements (QuasarAnchor, Nav, AudioToggle, CalibrationModal)
         * are rendered here so they persist across all routes.
         */}
        <SiteModeProvider>
          {/* Calibration modal — shown once per session if not yet calibrated */}
          <CalibrationModal />

          {/* Persistent shell */}
          <QuasarAnchor />
          <Nav />
          <AudioToggle />

          {/* Page content */}
          <main className="flex-1">{children}</main>
        </SiteModeProvider>
      </body>
    </html>
  );
}
