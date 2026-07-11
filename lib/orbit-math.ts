/**
 * lib/orbit-math.ts
 *
 * Shared easing, interpolation, and procedural-generation helpers.
 * Used by Phase 3 (Galaxy Map) and Phase 4 (Solar System orbit engine).
 *
 * No external dependencies — pure math, vanilla TypeScript.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface ClusterPoint extends Point2D {
  r: number;       // radius of the dot
  opacity: number; // 0–1
}

// ── Seeded PRNG ───────────────────────────────────────────────────────────────

/**
 * Mulberry32 — a fast, seeded 32-bit PRNG.
 * Returns a function that yields a new float in [0, 1) on each call.
 * Using a seed means galaxy cluster shapes are deterministic across renders,
 * including SSR — no hydration mismatch from random().
 */
export function seededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Easing ────────────────────────────────────────────────────────────────────

/** Standard ease-in-out cubic — used for viewBox zoom and orbit transitions. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Linear ease (no easing) — exposed for phases that need raw linear tween. */
export function easeLinear(t: number): number {
  return t;
}

// ── Interpolation ─────────────────────────────────────────────────────────────

/** Linear interpolation between two numbers. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interpolates between two SVG viewBox states.
 * t should be the eased progress value (0 → 1).
 */
export function lerpViewBox(from: ViewBox, to: ViewBox, t: number): ViewBox {
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    w: lerp(from.w, to.w, t),
    h: lerp(from.h, to.h, t),
  };
}

/** Formats a ViewBox as the SVG viewBox attribute string. */
export function viewBoxToString({ x, y, w, h }: ViewBox): string {
  return `${x} ${y} ${w} ${h}`;
}

// ── Procedural Cluster Generation ─────────────────────────────────────────────

interface ClusterOptions {
  cx: number;       // center x in SVG coordinate space
  cy: number;       // center y in SVG coordinate space
  radius: number;   // spread radius of the cluster
  count: number;    // number of points to generate
  seed: number;     // deterministic seed
  minRadius?: number; // minimum dot radius (default 0.4)
  maxRadius?: number; // maximum dot radius (default 1.8)
}

/**
 * Generates a procedural cluster of stars/dots.
 * Points are distributed with a Gaussian-ish falloff — denser near center.
 * Fully deterministic from seed; safe for SSR.
 */
export function generateClusterPoints(opts: ClusterOptions): ClusterPoint[] {
  const {
    cx,
    cy,
    radius,
    count,
    seed,
    minRadius = 0.4,
    maxRadius = 1.8,
  } = opts;

  const rand = seededRandom(seed);
  const points: ClusterPoint[] = [];

  for (let i = 0; i < count; i++) {
    // Polar coordinates with squared-radius for natural clustering density
    const angle = rand() * Math.PI * 2;
    // Bias toward center: use sqrt to convert uniform to radial distribution,
    // then apply a power to weight inward
    const rFactor = Math.pow(rand(), 0.6);
    const r = rFactor * radius;

    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    // Dots closer to center are slightly larger and brighter
    const proximity = 1 - rFactor;
    const dotR = minRadius + proximity * (maxRadius - minRadius) * rand();
    const opacity = 0.15 + proximity * 0.65 + rand() * 0.2;

    points.push({ x, y, r: dotR, opacity: Math.min(opacity, 0.95) });
  }

  return points;
}

/**
 * Generates sparse background starfield points.
 * These are intentionally dim and numerous — background texture, not focus.
 */
export function generateStarfield(options: {
  width: number;
  height: number;
  count: number;
  seed: number;
}): ClusterPoint[] {
  const { width, height, count, seed } = options;
  const rand = seededRandom(seed);
  const stars: ClusterPoint[] = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * width,
      y: rand() * height,
      r: rand() * 0.8 + 0.2,
      opacity: rand() * 0.25 + 0.05,
    });
  }
  return stars;
}

// ── ViewBox Zoom Target ───────────────────────────────────────────────────────

/**
 * Computes the target ViewBox for zooming into a galaxy cluster.
 * Zooms in to show a region 20% of the original width centered on (cx, cy).
 */
export function zoomTargetViewBox(
  current: ViewBox,
  targetCx: number,
  targetCy: number,
  zoomFactor = 0.2,
): ViewBox {
  const newW = current.w * zoomFactor;
  const newH = current.h * zoomFactor;
  return {
    x: targetCx - newW / 2,
    y: targetCy - newH / 2,
    w: newW,
    h: newH,
  };
}
