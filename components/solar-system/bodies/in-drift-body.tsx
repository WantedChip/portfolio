/**
 * components/solar-system/bodies/in-drift-body.tsx
 *
 * "In Drift" — Idea only, nothing built yet.
 * Visual: a loose, low-opacity dot cluster with no defined edge.
 * No solid form. Feels like a possibility, not a thing.
 *
 * SSR-safe: uses seededRandom from orbit-math (deterministic, no Math.random()).
 */

import { useMemo } from "react";
import { seededRandom } from "@/lib/orbit-math";

interface InDriftBodyProps {
  x: number;
  y: number;
  size: number; // base radius
  seed: number;
}

export function InDriftBody({ x, y, size, seed }: InDriftBodyProps) {
  const rand = useMemo(() => seededRandom(seed), [seed]);

  const dots = useMemo(() => {
    const r = seededRandom(seed);
    return Array.from({ length: 12 }, () => {
      const angle = r() * Math.PI * 2;
      const dist = r() * size * 1.8;
      return {
        dx: Math.round(Math.cos(angle) * dist * 10000) / 10000,
        dy: Math.round(Math.sin(angle) * dist * 10000) / 10000,
        r: Math.round((r() * 1.4 + 0.3) * 10000) / 10000,
        opacity: Math.round((r() * 0.35 + 0.1) * 10000) / 10000,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, size]);

  void rand; // consumed in dots generation above

  return (
    <g>
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={x + d.dx}
          cy={y + d.dy}
          r={d.r}
          fill="var(--text-muted)"
          opacity={d.opacity}
        />
      ))}
    </g>
  );
}
