/**
 * components/solar-system/lifecycle-badge.tsx
 *
 * A static badge showing a project/tool's lifecycle stage.
 * Used on detail pages and list views — the same five visual states
 * as the orbit bodies, just displayed as inline text+icon.
 *
 * Reused in Phase 5 (Tools catalog) — takes any lifecycleStage.
 */

import type { LifecycleStage } from "@/lib/schemas";

interface LifecycleBadgeProps {
  stage: LifecycleStage;
  /** Show full label (default) or just the dot indicator */
  compact?: boolean;
}

const STAGE_CONFIG: Record<
  LifecycleStage,
  { label: string; color: string; dotColor: string; description: string }
> = {
  "in-drift": {
    label: "In Drift",
    color: "var(--text-muted)",
    dotColor: "var(--text-muted)",
    description: "Idea only — not yet started",
  },
  nebula: {
    label: "Nebula",
    color: "var(--phosphor-amber)",
    dotColor: "var(--phosphor-amber)",
    description: "Concept defined — not yet built",
  },
  forming: {
    label: "Forming",
    color: "var(--phosphor-amber)",
    dotColor: "var(--phosphor-amber)",
    description: "Actively in development",
  },
  active: {
    label: "Active",
    color: "var(--phosphor-green)",
    dotColor: "var(--phosphor-green)",
    description: "Shipped and live",
  },
  remnant: {
    label: "Remnant",
    color: "var(--text-muted)",
    dotColor: "var(--text-muted)",
    description: "Archived or superseded",
  },
};

export function LifecycleBadge({ stage, compact = false }: LifecycleBadgeProps) {
  const cfg = STAGE_CONFIG[stage];

  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={cfg.description}
      aria-label={`Lifecycle: ${cfg.label} — ${cfg.description}`}
    >
      {/* Status dot */}
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: cfg.dotColor }}
        aria-hidden="true"
      />

      {!compact && (
        <span
          className="font-mono text-xs tracking-wide uppercase"
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
      )}
    </span>
  );
}

/** Export the config so body renderers can reference it if needed */
export { STAGE_CONFIG };
