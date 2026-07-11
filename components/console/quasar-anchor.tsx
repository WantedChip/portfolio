"use client";

/**
 * components/console/quasar-anchor.tsx
 *
 * The one deliberately static element site-wide.
 * Fixed position — does not move or animate with scroll or orbit motion.
 * Acts as the site's "home base" / logo mark.
 *
 * Design intent (00-overview.md): engraved atlas-plate quality.
 * Rendered as text + a subtle SVG crosshair mark — no image dependency.
 */

import Link from "next/link";

export function QuasarAnchor() {
  return (
    <Link
      href="/"
      aria-label="Home — portfolio root"
      className="group fixed left-6 top-6 z-40 flex items-center gap-3 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={
        {
          "--tw-ring-color": "var(--phosphor-amber)",
          "--tw-ring-offset-color": "var(--void-black)",
        } as React.CSSProperties
      }
    >
      {/* SVG crosshair / quasar mark */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-opacity duration-200 group-hover:opacity-80"
      >
        {/* Outer ring */}
        <circle
          cx="14"
          cy="14"
          r="12"
          stroke="var(--phosphor-amber)"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity="0.6"
        />
        {/* Inner dot */}
        <circle cx="14" cy="14" r="2.5" fill="var(--phosphor-amber)" />
        {/* Crosshair lines */}
        <line
          x1="14"
          y1="2"
          x2="14"
          y2="8"
          stroke="var(--phosphor-amber)"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="14"
          y1="20"
          x2="14"
          y2="26"
          stroke="var(--phosphor-amber)"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="2"
          y1="14"
          x2="8"
          y2="14"
          stroke="var(--phosphor-amber)"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="20"
          y1="14"
          x2="26"
          y2="14"
          stroke="var(--phosphor-amber)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Name / wordmark */}
      <span
        className="font-display text-base tracking-wide transition-opacity duration-200 group-hover:opacity-80"
        style={{ color: "var(--text-primary)" }}
      >
        {/* Replace with your actual name in content population phase */}
        Soham
      </span>
    </Link>
  );
}
