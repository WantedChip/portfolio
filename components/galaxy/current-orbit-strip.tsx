"use client";

/**
 * components/galaxy/current-orbit-strip.tsx
 *
 * A plainly-labeled text strip showing what the portfolio owner is actively
 * focused on right now. NOT a cosmic object — just honest text.
 *
 * Per spec: "a small, plainly-labeled text area... This pulls from a simple
 * hardcoded value for now; consider migrating it to its own tiny content file
 * in a later pass if it starts changing often enough to be annoying to hardcode."
 *
 * In Full Experience mode: a very subtle blinking cursor at the end of the status
 * line (the classic terminal effect — communicates "live" without being flashy).
 * In Calm Mode: fully static.
 */

import { useSiteMode } from "@/components/console/site-mode-context";

// ── Hardcoded current status — update this directly as focus shifts ───────────

const CURRENT_FOCUS = "Building this portfolio cosmos";
const CURRENT_DETAIL = "Phase 3 — Homepage / Galaxy Map";

// ── Component ─────────────────────────────────────────────────────────────────

export function CurrentOrbitStrip() {
  const { experienceMode } = useSiteMode();
  const isCalm = experienceMode === "calm";

  return (
    <div
      className="flex flex-col gap-1"
      aria-label="Current focus area"
    >
      {/* Console prefix label */}
      <span
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
      >
        Current Orbit
      </span>

      {/* Main status line */}
      <div className="flex items-center gap-2">
        {/* Blinking status indicator — only animates in Full Experience */}
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{
            backgroundColor: "var(--phosphor-green)",
            animation: isCalm ? "none" : "orbit-pulse 2s ease-in-out infinite",
          }}
          aria-hidden="true"
        />

        <span
          className="font-mono text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {CURRENT_FOCUS}
          {/* Blinking cursor in Full mode */}
          {!isCalm && (
            <span
              className="ml-1 inline-block"
              style={{
                color: "var(--phosphor-amber)",
                animation: "cursor-blink 1.1s step-end infinite",
              }}
              aria-hidden="true"
            >
              _
            </span>
          )}
        </span>
      </div>

      {/* Detail line */}
      <span
        className="font-mono text-xs"
        style={{ color: "var(--text-muted)", opacity: 0.6 }}
      >
        {CURRENT_DETAIL}
      </span>
    </div>
  );
}
