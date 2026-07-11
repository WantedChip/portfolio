"use client";

/**
 * components/galaxy/galaxy-cluster.tsx
 *
 * An individual galaxy rendered as a procedural SVG point cluster.
 * Points are generated deterministically via a seeded PRNG — shapes
 * are identical on every render and between server/client, preventing
 * hydration mismatches.
 *
 * Supports hover and focus states for interaction.
 * Keyboard accessible: Enter/Space triggers the onClick handler.
 */

import { useMemo, useState } from "react";
import { generateClusterPoints, type ClusterPoint } from "@/lib/orbit-math";

// ── Types ─────────────────────────────────────────────────────────────────────

interface GalaxyClusterProps {
  /** SVG coordinate center X */
  cx: number;
  /** SVG coordinate center Y */
  cy: number;
  /** Spread radius in SVG units */
  radius: number;
  /** Number of points (desktop) */
  count: number;
  /** Deterministic seed for PRNG */
  seed: number;
  /** Display label below the cluster */
  label: string;
  /** Accent color token string — must be a CSS var() reference */
  accentColor: string;
  /** Called when the cluster is activated (click or keyboard) */
  onClick: () => void;
  /** Whether this cluster is in a "hovered" or focused state externally */
  active?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GalaxyCluster({
  cx,
  cy,
  radius,
  count,
  seed,
  label,
  accentColor,
  onClick,
  active = false,
}: GalaxyClusterProps) {
  const [hovered, setHovered] = useState(false);
  const isHighlighted = hovered || active;

  // Generate cluster points — memoized, only recomputes if props change
  const points: ClusterPoint[] = useMemo(
    () =>
      generateClusterPoints({
        cx: 0, // offset from local origin; positioned by SVG <g> transform
        cy: 0,
        radius,
        count,
        seed,
      }),
    [radius, count, seed],
  );

  const handleKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${label}`}
      style={{ cursor: "pointer", outline: "none" }}
    >
      {/* Invisible hit area — larger than visible cluster for easier clicking */}
      <circle
        cx={0}
        cy={0}
        r={radius * 1.4}
        fill="transparent"
        stroke="none"
      />

      {/* Glow halo — visible on hover/focus */}
      <circle
        cx={0}
        cy={0}
        r={radius * 0.8}
        fill="transparent"
        stroke={accentColor}
        strokeWidth={isHighlighted ? 0.5 : 0}
        opacity={isHighlighted ? 0.25 : 0}
        style={{ transition: "opacity 0.3s, stroke-width 0.3s" }}
      />

      {/* Cluster points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r * (isHighlighted ? 1.15 : 1)}
          fill={isHighlighted ? accentColor : "var(--text-primary)"}
          opacity={p.opacity * (isHighlighted ? 1.2 : 1)}
          style={{ transition: "opacity 0.3s, fill 0.3s, r 0.3s" }}
        />
      ))}

      {/* Center accent dot */}
      <circle
        cx={0}
        cy={0}
        r={isHighlighted ? 2.5 : 1.8}
        fill={accentColor}
        opacity={isHighlighted ? 0.9 : 0.5}
        style={{ transition: "r 0.3s, opacity 0.3s" }}
      />

      {/* Label */}
      <text
        x={0}
        y={radius + 20}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="2"
        fill={isHighlighted ? accentColor : "var(--text-muted)"}
        opacity={isHighlighted ? 0.95 : 0.65}
        style={{
          transition: "fill 0.3s, opacity 0.3s",
          userSelect: "none",
          textTransform: "uppercase",
        }}
      >
        {label}
      </text>

      {/* Focus ring — visible only via keyboard */}
      <circle
        cx={0}
        cy={0}
        r={radius + 8}
        fill="none"
        stroke={accentColor}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0}
        className="galaxy-focus-ring"
        style={{ pointerEvents: "none" }}
      />
    </g>
  );
}
