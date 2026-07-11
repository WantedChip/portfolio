"use client";

/**
 * components/galaxy/galaxy-map.tsx
 *
 * The homepage galaxy map — a full-screen SVG canvas showing two galaxy
 * clusters (Projects, Tools) in a sparse starfield.
 *
 * Click/hover interaction:
 *   - Full Experience: zooms the SVG viewBox toward the selected galaxy over
 *     ~500ms using requestAnimationFrame + easeInOutCubic, then navigates.
 *   - Calm Mode: navigates immediately on click (no animation).
 *
 * SVG coordinate system: 1000 × 600 units (aspect-ratio preserved via
 * viewBox + preserveAspectRatio). Clusters sit at fixed coordinates in this
 * space — responsive via SVG scaling, not CSS layout.
 *
 * Non-Negotiable Rule check:
 *   - No WebGL / 3D — pure SVG, 2.5D orthographic ✓
 *   - orbit/physics animation = custom RAF loop, not Framer Motion ✓
 *   - Respects experienceMode from SiteModeProvider ✓
 *   - No hardcoded hex — all colors via CSS var() ✓
 */

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GalaxyCluster } from "./galaxy-cluster";
import { useSiteMode } from "@/components/console/site-mode-context";
import {
  generateStarfield,
  easeInOutCubic,
  lerpViewBox,
  zoomTargetViewBox,
  viewBoxToString,
  type ViewBox,
  type ClusterPoint,
} from "@/lib/orbit-math";

// ── SVG canvas dimensions (coordinate space) ──────────────────────────────────

const VB_W = 1000;
const VB_H = 600;

const INITIAL_VIEWBOX: ViewBox = { x: 0, y: 0, w: VB_W, h: VB_H };

// ── Galaxy definitions ────────────────────────────────────────────────────────

const GALAXIES = [
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
    cx: 330,
    cy: 270,
    radius: 72,
    count: 180,      // desktop; halved for mobile in component
    seed: 42,
    accentColor: "var(--phosphor-amber)",
  },
  {
    id: "tools",
    label: "Tools",
    href: "/tools",
    cx: 680,
    cy: 320,
    radius: 58,
    count: 140,
    seed: 137,
    accentColor: "var(--phosphor-green)",
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export function GalaxyMap() {
  const router = useRouter();
  const { experienceMode } = useSiteMode();
  const isCalm = experienceMode === "calm";

  const [viewBox, setViewBox] = useState<ViewBox>(INITIAL_VIEWBOX);
  const [navigating, setNavigating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Detect mobile for star count cap
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Background starfield — deterministic, generated once
  const starfield: ClusterPoint[] = useMemo(
    () =>
      generateStarfield({
        width: VB_W,
        height: VB_H,
        count: isMobile ? 80 : 180,
        seed: 7,
      }),
    [isMobile],
  );

  // Cancel any in-progress animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  /**
   * Zooms toward (targetCx, targetCy) over `duration`ms using RAF,
   * then calls onComplete.
   */
  const animateZoom = useCallback(
    (targetCx: number, targetCy: number, onComplete: () => void) => {
      const fromVB = INITIAL_VIEWBOX;
      const toVB = zoomTargetViewBox(fromVB, targetCx, targetCy, 0.18);
      const duration = 520; // ms — spec says 400–600ms
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const rawT = Math.min(elapsed / duration, 1);
        const easedT = easeInOutCubic(rawT);

        setViewBox(lerpViewBox(fromVB, toVB, easedT));

        if (rawT < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setViewBox(INITIAL_VIEWBOX); // reset for when user navigates back
          onComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [],
  );

  const handleGalaxyClick = useCallback(
    (galaxy: (typeof GALAXIES)[number]) => {
      if (navigating) return; // debounce double-clicks
      setNavigating(true);

      if (isCalm) {
        // Calm Mode: navigate immediately — no animation
        router.push(galaxy.href);
      } else {
        // Full Experience: zoom then navigate
        animateZoom(galaxy.cx, galaxy.cy, () => {
          router.push(galaxy.href);
        });
      }
    },
    [navigating, isCalm, router, animateZoom],
  );

  const currentVBStr = viewBoxToString(viewBox);

  return (
    <div
      className="relative w-full h-full"
      style={{ backgroundColor: "var(--void-black)" }}
    >
      <svg
        viewBox={currentVBStr}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-label="Galaxy map — navigate to a section by clicking a galaxy cluster"
        role="img"
        style={{
          display: "block",
          // Prevent SVG from catching pointer events during animation
          pointerEvents: navigating && !isCalm ? "none" : "auto",
        }}
      >
        {/* ── Background starfield ── */}
        <g aria-hidden="true">
          {starfield.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="var(--text-primary)"
              opacity={s.opacity}
            />
          ))}
        </g>

        {/* ── Subtle grid lines (engraving aesthetic) ── */}
        <g aria-hidden="true" opacity="0.03">
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 100}
              y1={0}
              x2={i * 100}
              y2={VB_H}
              stroke="var(--text-primary)"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i * 100}
              x2={VB_W}
              y2={i * 100}
              stroke="var(--text-primary)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* ── Galaxy clusters ── */}
        {GALAXIES.map((g) => (
          <GalaxyCluster
            key={g.id}
            cx={g.cx}
            cy={g.cy}
            radius={g.radius}
            count={isMobile ? Math.floor(g.count / 2) : g.count}
            seed={g.seed}
            label={g.label}
            accentColor={g.accentColor}
            onClick={() => handleGalaxyClick(g)}
          />
        ))}

        {/* ── Hidden drift anomaly (Secret entry point to Observatory) ── */}
        <GalaxyCluster
          cx={900}
          cy={100}
          radius={8}
          count={isMobile ? 6 : 12}
          seed={999}
          label=""
          accentColor="var(--signal-red)"
          onClick={() => {
            if (navigating) return;
            setNavigating(true);
            if (isCalm) {
              router.push("/observatory");
            } else {
              animateZoom(900, 100, () => {
                router.push("/observatory");
              });
            }
          }}
        />

        {/* ── Coordinate labels (atlas aesthetic) ── */}
        <g aria-hidden="true" opacity="0.2">
          <text
            x={8}
            y={14}
            fontFamily="var(--font-mono)"
            fontSize="7"
            fill="var(--text-muted)"
            letterSpacing="1"
          >
            00°N 00°E
          </text>
          <text
            x={VB_W - 8}
            y={14}
            fontFamily="var(--font-mono)"
            fontSize="7"
            fill="var(--text-muted)"
            letterSpacing="1"
            textAnchor="end"
          >
            SECTOR VII
          </text>
          <text
            x={8}
            y={VB_H - 8}
            fontFamily="var(--font-mono)"
            fontSize="7"
            fill="var(--text-muted)"
            letterSpacing="1"
          >
            OBSERVATION LOG
          </text>
        </g>
      </svg>

      {/* ── Screen-reader accessible navigation links ── */}
      <nav aria-label="Section navigation" className="sr-only">
        {GALAXIES.map((g) => (
          <a key={g.id} href={g.href}>
            Navigate to {g.label}
          </a>
        ))}
        <a href="/observatory">Navigate to Observatory Simulation</a>
      </nav>
    </div>
  );
}
