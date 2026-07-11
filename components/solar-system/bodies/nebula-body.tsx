/**
 * components/solar-system/bodies/nebula-body.tsx
 *
 * "Nebula" — Concept defined, not started.
 * Visual: a soft radial gradient blob, static. Diffuse, glowing — a cloud
 * of potential with no solid form yet.
 */

interface NebulaBodyProps {
  x: number;
  y: number;
  size: number;
  id: string; // unique ID for SVG gradient (must be unique per instance)
}

export function NebulaBody({ x, y, size, id }: NebulaBodyProps) {
  const gradientId = `nebula-grad-${id}`;

  return (
    <g>
      <defs>
        <radialGradient
          id={gradientId}
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%"   stopColor="var(--phosphor-amber)" stopOpacity="0.30" />
          <stop offset="40%"  stopColor="var(--phosphor-amber)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--phosphor-amber)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer diffuse halo */}
      <circle
        cx={x}
        cy={y}
        r={size * 2.2}
        fill={`url(#${gradientId})`}
      />

      {/* Inner core — slightly more visible */}
      <circle
        cx={x}
        cy={y}
        r={size * 0.9}
        fill="var(--phosphor-amber)"
        opacity={0.15}
      />

      {/* Faint edge ring */}
      <circle
        cx={x}
        cy={y}
        r={size * 1.1}
        fill="none"
        stroke="var(--phosphor-amber)"
        strokeWidth={0.5}
        opacity={0.2}
        strokeDasharray="2 3"
      />
    </g>
  );
}
