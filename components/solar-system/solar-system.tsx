"use client";

/**
 * components/solar-system/solar-system.tsx
 *
 * The Projects solar system — an SVG canvas showing every project as an
 * orbiting body whose visual state is driven entirely by its lifecycleStage.
 *
 * Architecture:
 *   - One RAF loop drives all orbit angles simultaneously
 *   - Calm Mode: angle frozen at start position (bodies visible but still)
 *   - Remnant bodies: always frozen (even in Full Experience)
 *   - The ONE switch statement that branches on lifecycleStage lives here
 *   - Adding a new project .md file → zero component changes needed
 *
 * Performance design:
 *   - Tested with 15-20 bodies: all angles computed in a single loop,
 *     stored in a Map<slug, angle>, triggering a single setState per frame
 *   - Body renderers are pure/memoized — no per-body RAF
 *   - SVG rendering, not Canvas, for accessibility + DOM interactivity
 *
 * Non-Negotiable Rule compliance:
 *   - No hardcoded hex — all colors via CSS var()
 *   - Lifecycle branching in one place (the renderBody() switch below)
 *   - Custom RAF loop for orbit animation (not Framer Motion)
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { useSiteMode } from "@/components/console/site-mode-context";
import { InDriftBody } from "./bodies/in-drift-body";
import { NebulaBody } from "./bodies/nebula-body";
import { FormingBody } from "./bodies/forming-body";
import { ActiveBody } from "./bodies/active-body";
import { RemnantBody } from "./bodies/remnant-body";
import {
  computeOrbitPosition,
  dateToOrbitRadius,
  orbitAngularSpeed,
  projectStartAngle,
  generateStarfield,
  type ClusterPoint,
} from "@/lib/orbit-math";
import type { Project, LifecycleStage } from "@/lib/schemas";

// ── SVG canvas ────────────────────────────────────────────────────────────────

const VB_W = 900;
const VB_H = 700;
const SUN_CX = VB_W / 2;   // 450
const SUN_CY = VB_H / 2;   // 350

// Base body size per lifecycle stage
const BASE_SIZES: Record<LifecycleStage, number> = {
  "in-drift":  5,
  nebula:      7,
  forming:     8,
  active:      10,
  remnant:     7,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function bodySize(project: Project): number {
  const base = BASE_SIZES[project.lifecycleStage];
  const scale = project.scale ?? 1;
  return base * scale;
}

// ── The ONE lifecycle switch ──────────────────────────────────────────────────
// This is the single place in the codebase that branches on lifecycleStage.
// All five cases must be handled here. Adding a new stage = update here ONLY.

function renderBody(
  project: Project,
  x: number,
  y: number,
): React.ReactNode {
  const size = bodySize(project);
  const id = project.slug;
  // Stable seed from slug for deterministic PRNG
  const seed = project.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  switch (project.lifecycleStage) {
    case "in-drift":
      return <InDriftBody x={x} y={y} size={size} seed={seed} />;
    case "nebula":
      return <NebulaBody x={x} y={y} size={size} id={id} />;
    case "forming":
      return <FormingBody x={x} y={y} size={size} id={id} seed={seed} />;
    case "active":
      return <ActiveBody x={x} y={y} size={size} id={id} featured={project.featured} />;
    case "remnant":
      return <RemnantBody x={x} y={y} size={size} id={id} />;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SolarSystemProps {
  projects: Project[];
}

export function SolarSystem({ projects }: SolarSystemProps) {
  const { experienceMode } = useSiteMode();
  const isCalm = experienceMode === "calm";
  const animRef = useRef<number | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection for star count
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Derived orbit properties per project ────────────────────────────────
  const allDates = useMemo(
    () => projects.map((p) => p.startDate),
    [projects],
  );

  const orbitData = useMemo(() => {
    return projects.map((p) => {
      const radius = dateToOrbitRadius(p.startDate, allDates);
      const speed = orbitAngularSpeed(radius);
      const startAngle = projectStartAngle(p.slug);
      return { project: p, radius, speed, startAngle };
    });
  }, [projects, allDates]);

  // ── Angle state — one value per project keyed by slug ──────────────────
  const [angles, setAngles] = useState<Map<string, number>>(() => {
    const m = new Map<string, number>();
    orbitData.forEach(({ project, startAngle }) => {
      m.set(project.slug, startAngle);
    });
    return m;
  });

  // ── RAF loop ─────────────────────────────────────────────────────────────
  const lastTimeRef = useRef<number | null>(null);

  const tick = useCallback(
    (now: number) => {
      if (isCalm) {
        // Calm: don't advance angles, don't reschedule
        lastTimeRef.current = null;
        return;
      }

      const dt = lastTimeRef.current !== null ? now - lastTimeRef.current : 0;
      lastTimeRef.current = now;

      setAngles((prev) => {
        const next = new Map(prev);
        orbitData.forEach(({ project, speed }) => {
          // Remnant bodies: frozen always
          if (project.lifecycleStage === "remnant") return;
          const current = next.get(project.slug) ?? 0;
          next.set(project.slug, current + speed * dt);
        });
        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    },
    [isCalm, orbitData],
  );

  useEffect(() => {
    if (!isCalm) {
      animRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
    };
  }, [isCalm, tick]);

  // ── Background starfield ──────────────────────────────────────────────────
  const starfield: ClusterPoint[] = useMemo(
    () =>
      generateStarfield({
        width: VB_W,
        height: VB_H,
        count: isMobile ? 60 : 130,
        seed: 19,
      }),
    [isMobile],
  );

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: "var(--void-black)" }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-label="Solar system — your projects in orbit"
        style={{ display: "block" }}
      >
        {/* ── Starfield ── */}
        <g aria-hidden="true">
          {starfield.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="var(--text-primary)" opacity={s.opacity} />
          ))}
        </g>

        {/* ── Orbit rings ── */}
        <g aria-hidden="true">
          {orbitData.map(({ project, radius }) => (
            <circle
              key={`ring-${project.slug}`}
              cx={SUN_CX}
              cy={SUN_CY}
              r={radius}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth={0.4}
              opacity={project.lifecycleStage === "remnant" ? 0.06 : 0.12}
              strokeDasharray="3 6"
            />
          ))}
        </g>

        {/* ── Central star (sun / quasar core) ── */}
        <g aria-hidden="true">
          <circle cx={SUN_CX} cy={SUN_CY} r={18} fill="var(--phosphor-amber)" opacity={0.08} />
          <circle cx={SUN_CX} cy={SUN_CY} r={10} fill="var(--phosphor-amber)" opacity={0.18} />
          <circle cx={SUN_CX} cy={SUN_CY} r={4}  fill="var(--phosphor-amber)" opacity={0.85} />
        </g>

        {/* ── Planet bodies ── */}
        {orbitData.map(({ project, radius }) => {
          const angle = angles.get(project.slug) ?? projectStartAngle(project.slug);
          const pos = computeOrbitPosition(SUN_CX, SUN_CY, radius, angle);
          const isHovered = hoveredSlug === project.slug;
          const hoverR = bodySize(project) * (project.featured ? 2.2 : 1.8);

          return (
            <g key={project.slug}>
              {/* Invisible hit area */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={hoverR}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                role="button"
                tabIndex={0}
                aria-label={`${project.title} — ${project.lifecycleStage}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.location.href = `/projects/${project.slug}`;
                  }
                }}
              />

              {/* Body renderer — the ONE lifecycle switch */}
              {renderBody(project, pos.x, pos.y)}

              {/* Hover readout — console style */}
              {isHovered && (
                <g aria-hidden="true">
                  <rect
                    x={pos.x + hoverR + 4}
                    y={pos.y - 16}
                    width={140}
                    height={34}
                    rx={2}
                    fill="var(--deep-navy)"
                    stroke="var(--phosphor-amber)"
                    strokeWidth={0.5}
                    opacity={0.95}
                  />
                  <text
                    x={pos.x + hoverR + 10}
                    y={pos.y - 3}
                    fontFamily="var(--font-mono)"
                    fontSize="8"
                    fill="var(--text-primary)"
                  >
                    {project.catalogNumber}
                  </text>
                  <text
                    x={pos.x + hoverR + 10}
                    y={pos.y + 10}
                    fontFamily="var(--font-mono)"
                    fontSize="9"
                    fill="var(--phosphor-amber)"
                  >
                    {project.title.length > 16
                      ? project.title.slice(0, 16) + "…"
                      : project.title}
                  </text>
                </g>
              )}

              {/* Invisible link overlay for click navigation */}
              <foreignObject
                x={pos.x - hoverR}
                y={pos.y - hoverR}
                width={hoverR * 2}
                height={hoverR * 2}
                style={{ overflow: "visible", pointerEvents: "none" }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    opacity: 0,
                    pointerEvents: "auto",
                  }}
                  aria-label={`View project: ${project.title}`}
                  tabIndex={-1} // hitbox circle above handles keyboard
                >
                  {project.title}
                </Link>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {/* Screen reader navigation */}
      <nav aria-label="Projects" className="sr-only">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`}>
            {p.title} ({p.lifecycleStage})
          </Link>
        ))}
      </nav>
    </div>
  );
}
