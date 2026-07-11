/**
 * components/solar-system/bodies/remnant-body.tsx
 *
 * "Remnant" — Archived or superseded. A dead star / asteroid field.
 * Visual: desaturated grey circle, low opacity, orbit motion halted,
 * positioned at its last known orbit position.
 *
 * This body does NOT move even in Full Experience mode — it is frozen.
 * That stillness amid the moving others is the signal.
 */

interface RemnantBodyProps {
  x: number;
  y: number;
  size: number;
  id: string;
}

export function RemnantBody({ x, y, size, id }: RemnantBodyProps) {
  const gradientId = `remnant-grad-${id}`;

  return (
    <g>
      <defs>
        <radialGradient id={gradientId} cx="40%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="var(--text-muted)"  stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--text-muted)"  stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Shattered ring — asteroid field feel */}
      <circle
        cx={x}
        cy={y}
        r={size * 1.6}
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth={size * 0.35}
        opacity={0.06}
        strokeDasharray={`${size * 0.5} ${size * 0.8}`}
      />

      {/* Main body — desaturated */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={`url(#${gradientId})`}
        opacity={0.45}
      />

      {/* Cracked edge */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth={0.6}
        opacity={0.3}
        strokeDasharray={`${size * 0.7} ${size * 0.5}`}
      />

      {/* Strike-through / X — archived signal */}
      <line
        x1={x - size * 0.5}
        y1={y - size * 0.5}
        x2={x + size * 0.5}
        y2={y + size * 0.5}
        stroke="var(--text-muted)"
        strokeWidth={0.6}
        opacity={0.25}
      />
      <line
        x1={x + size * 0.5}
        y1={y - size * 0.5}
        x2={x - size * 0.5}
        y2={y + size * 0.5}
        stroke="var(--text-muted)"
        strokeWidth={0.6}
        opacity={0.25}
      />
    </g>
  );
}
