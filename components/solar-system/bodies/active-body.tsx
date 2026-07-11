/**
 * components/solar-system/bodies/active-body.tsx
 *
 * "Active" — Shipped and live. A solid, full-opacity planet in stable orbit.
 * The flagship visual: crisp, confident, fully formed.
 *
 * Featured projects are rendered measurably larger and brighter — this is
 * the one deliberate use of visual hierarchy in the solar system.
 */

interface ActiveBodyProps {
  x: number;
  y: number;
  size: number;
  id: string;
  featured?: boolean;
}

export function ActiveBody({ x, y, size, id, featured = false }: ActiveBodyProps) {
  const gradientId = `active-grad-${id}`;
  const glowId = `active-glow-${id}`;
  // Featured projects get a 40% size boost
  const r = featured ? size * 1.4 : size;
  const baseOpacity = featured ? 1.0 : 0.88;

  return (
    <g>
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="var(--text-primary)"   stopOpacity="1" />
          <stop offset="60%"  stopColor="var(--phosphor-amber)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--phosphor-amber)" stopOpacity="0.3" />
        </radialGradient>
        {featured && (
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Outer glow ring for featured projects */}
      {featured && (
        <circle
          cx={x}
          cy={y}
          r={r * 1.5}
          fill="none"
          stroke="var(--phosphor-amber)"
          strokeWidth={0.8}
          opacity={0.25}
        />
      )}

      {/* Main body */}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={`url(#${gradientId})`}
        opacity={baseOpacity}
        filter={featured ? `url(#${glowId})` : undefined}
      />

      {/* Specular highlight */}
      <circle
        cx={x - r * 0.28}
        cy={y - r * 0.28}
        r={r * 0.22}
        fill="var(--text-primary)"
        opacity={0.3}
      />
    </g>
  );
}
