"use client";

/**
 * components/log/pulse-entry.tsx
 *
 * An individual log entry rendered as a "pulse" item.
 * Uses a Client Component to consume SiteModeContext to control
 * the blinking green dot (pulsar clock).
 *
 * Under Calm Mode: the blinking pulse animation is disabled (stays static).
 * Under Full Experience: the green dot pulses continuously.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useSiteMode } from "@/components/console/site-mode-context";
import { useSound } from "@/lib/audio";
import type { Update } from "@/lib/schemas";

interface PulseEntryProps {
  update: Update;
  htmlBody: string;
  relatedProjectTitle?: string;
}

export function PulseEntry({
  update,
  htmlBody,
  relatedProjectTitle,
}: PulseEntryProps) {
  const { experienceMode } = useSiteMode();
  const isCalm = experienceMode === "calm";
  const { play: playTick } = useSound("/audio/pulse-tick.mp3");

  // Play tick on mount to register entry addition sound
  useEffect(() => {
    playTick();
  }, [playTick]);

  // Monospace date formatting
  const formattedDate = new Date(update.date)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");

  return (
    <article
      className="relative pl-6 border-l border-dashed mb-10 last:mb-0"
      style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
    >
      {/* Pulsar green clock dot */}
      <span
        className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full shrink-0"
        style={{
          backgroundColor: "var(--phosphor-green)",
          boxShadow: isCalm ? "none" : "0 0 4px var(--phosphor-green)",
          animation: isCalm ? "none" : "orbit-pulse 2s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* Date metadata */}
      <div className="font-mono text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        <span style={{ color: "var(--phosphor-green)" }}>[{formattedDate}]</span>
        <span className="mx-2">//</span>
        <span>SYS_LOG_ENTRY</span>
      </div>

      {/* Title */}
      <h3
        className="font-sans text-lg font-semibold tracking-wide mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {update.title}
      </h3>

      {/* Update narrative body copy */}
      <div
        className="font-sans text-sm leading-relaxed mb-4 prose-section"
        dangerouslySetInnerHTML={{ __html: htmlBody }}
        style={{ color: "var(--text-muted)" }}
      />

      {/* Related project uplink link */}
      {update.relatedProject && (
        <div className="font-mono text-xs mt-3">
          <span style={{ color: "var(--text-muted)", opacity: 0.6 }}>UPLINK: </span>
          <Link
            href={`/projects/${update.relatedProject}`}
            className="hover:opacity-85"
            style={{ color: "var(--phosphor-amber)" }}
          >
            {relatedProjectTitle ? `SOL_SYSTEM // ${relatedProjectTitle}` : "PROJECT_SPEC"} →
          </Link>
        </div>
      )}

      {/* Entry tags */}
      {update.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {update.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px]"
              style={{ color: "var(--text-muted)", opacity: 0.5 }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
