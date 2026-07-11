"use client";

/**
 * components/instruments/instrument-row.tsx
 *
 * A single equipment ledger row for an instrument (tool).
 * Prioritizes monospace elements (JetBrains Mono) and data-focused layout.
 *
 * Keyboard navigable: wraps standard next/link pointing to /tools/[slug]
 * Subtle console hover state: scanline-like left border activation + highlight sweep,
 * avoiding any 3D card lifting effects.
 *
 * Reuses the LifecycleBadge from components/solar-system/lifecycle-badge.tsx.
 */

import Link from "next/link";
import { LifecycleBadge } from "../solar-system/lifecycle-badge";
import type { Tool } from "@/lib/schemas";

interface InstrumentRowProps {
  tool: Tool;
}

export function InstrumentRow({ tool }: InstrumentRowProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col gap-4 border p-4 transition-all duration-150 md:flex-row md:items-center justify-between focus:outline-none focus-visible:ring-1"
      style={
        {
          backgroundColor: "rgba(11, 18, 38, 0.3)",
          borderColor: "rgba(136, 144, 166, 0.12)",
          "--tw-ring-color": "var(--phosphor-amber)",
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
          "rgba(255, 180, 84, 0.03)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "rgba(255, 180, 84, 0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
          "rgba(11, 18, 38, 0.3)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "rgba(136, 144, 166, 0.12)";
      }}
    >
      {/* Subtle telemetry status light on left */}
      <span
        className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-150 group-hover:opacity-100"
        style={{
          backgroundColor: "var(--phosphor-amber)",
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Instrument identification and summary */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1.5">
          <span
            className="font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 border"
            style={{
              borderColor: "rgba(255, 180, 84, 0.15)",
              color: "var(--phosphor-amber)",
            }}
          >
            {tool.category}
          </span>
          <h3
            className="font-sans text-sm font-semibold tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            {tool.title}
          </h3>
          <LifecycleBadge stage={tool.lifecycleStage} compact />
        </div>
        <p
          className="font-mono text-xs line-clamp-1"
          style={{ color: "var(--text-muted)", opacity: 0.8 }}
        >
          {tool.summary}
        </p>
      </div>

      {/* Tech stack specification chips */}
      <div className="flex flex-wrap gap-1.5 max-w-xs justify-start md:justify-end shrink-0">
        {tool.techStack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[9px] px-2 py-0.5 border"
            style={{
              backgroundColor: "rgba(136, 144, 166, 0.04)",
              borderColor: "rgba(136, 144, 166, 0.1)",
              color: "var(--text-muted)",
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
