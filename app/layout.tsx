import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

// ── Display / Headings ────────────────────────────────────────────────────────
// Fraunces: serif with an engraved, atlas-plate quality (per 00-overview.md)
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  // optical-size axis available — use 9pt for small print feel
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
  title: "Portfolio",
  description: "The intersection of human curiosity and raw engineering.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
