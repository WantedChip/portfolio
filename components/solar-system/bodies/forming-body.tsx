"use client";

/**
 * components/solar-system/bodies/forming-body.tsx
 *
 * "Forming" — Actively in development. Protoplanetary disk stage.
 * Visual: partial solid circle with a faint animated particle ring
 * feeding inward (accretion). The body is visibly growing toward a final form.
 *
 * The accretion animation runs only in Full Experience mode.
 * In Calm Mode, the ring is rendered static.
 */

import { useMemo } from "react";
import { useSiteMode } from "@/components/console/site-mode-context";
import { seededRandom } from "@/lib/orbit-math";

interface FormingBodyProps {
  x: number;
  y: number;
  size: number;
  id: string;
  seed: number;
}

export function FormingBody({ x, y, size, id, seed }: FormingBodyProps) {
  const { experienceMode } = useSiteMode();
  const isCalm = experienceMode === "calm";
  const gradientId = `forming-grad-${id}`;

  // Accretion ring particles — deterministic positions
  const particles = useMemo(() => {
    const r = seededRandom(seed);
    return Array.from({ length: 8 }, (_, i) => {
      const baseAngle = (i / 8) * Math.PI * 2;
      const jitter = (r() - 0.5) * 0.4;
      const dist = size * (1.6 + r() * 0.8);
      return {
        angle: baseAngle + jitter,
        dist,
        r: r() * 1.2 + 0.4,
        opacity: r() * 0.4 + 0.2,
        animDelay: r() * 1.5,
      };
    });
  }, [seed, size]);

  return (
    <g>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="var(--phosphor-amber)" stopOpacity="0.9" />
          <stop offset="70%"  stopColor="var(--phosphor-amber)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--phosphor-amber)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Accretion ring */}
      <circle
        cx={x}
        cy={y}
        r={size * 1.8}
        fill="none"
        stroke="var(--phosphor-amber)"
        strokeWidth={size * 0.4}
        opacity={0.08}
        strokeDasharray={`${size * 0.6} ${size * 0.3}`}
      />

      {/* Accretion particles */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={x + Math.cos(p.angle) * p.dist}
          cy={y + Math.sin(p.angle) * p.dist}
          r={p.r}
          fill="var(--phosphor-amber)"
          opacity={p.opacity}
          style={
            isCalm
              ? undefined
              : {
                  animation: `forming-pulse 2.2s ease-in-out ${p.animDelay}s infinite`,
                }
          }
        />
      ))}

      {/* Partial body — looks like a protoplanet taking shape */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={`url(#${gradientId})`}
      />

      {/* Irregular outer edge — a dashed arc giving "not yet solid" feel */}
      <circle
        cx={x}
        cy={y}
        r={size * 1.05}
        fill="none"
        stroke="var(--phosphor-amber)"
        strokeWidth={0.8}
        opacity={0.4}
        strokeDasharray={`${size * 0.9} ${size * 0.4}`}
      />
    </g>
  );
}
