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

// ── Phase 4: Solar System Orbit Math ──────────────────────────────────────────

export interface OrbitPosition extends Point2D {
  angle: number; // current angle in radians
}

/**
 * Computes x, y position of a body on an elliptical orbit.
 * @param cx    Center x of the solar system
 * @param cy    Center y of the solar system
 * @param radius Orbit radius in SVG units
 * @param angle  Current angle in radians
 */
export function computeOrbitPosition(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): OrbitPosition {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
    angle,
  };
}

/**
 * Maps a project's startDate to an orbit radius.
 * Newer projects are closer in (smaller radius), older ones further out.
 * Radii are distributed across [minRadius, maxRadius].
 *
 * @param startDate  ISO date string e.g. "2024-03-15"
 * @param allDates   All project start dates (to normalize the range)
 * @param minRadius  Innermost orbit radius
 * @param maxRadius  Outermost orbit radius
 */
export function dateToOrbitRadius(
  startDate: string,
  allDates: string[],
  minRadius = 80,
  maxRadius = 340,
): number {
  const ms = new Date(startDate).getTime();
  const timestamps = allDates.map((d) => new Date(d).getTime());
  const oldest = Math.min(...timestamps);
  const newest = Math.max(...timestamps);

  if (oldest === newest) return (minRadius + maxRadius) / 2;

  // Older = further out, newer = closer in
  const t = (ms - oldest) / (newest - oldest); // 0 = oldest, 1 = newest
  return maxRadius - t * (maxRadius - minRadius);
}

/**
 * Angular speed for a planet on its orbit.
 * Slower for outer orbits (Kepler-ish feel) — outer bodies feel heavier.
 * Units: radians per millisecond.
 *
 * Target: roughly one full orbit in 90–300 seconds (very slow, "alive" feel).
 */
export function orbitAngularSpeed(radius: number): number {
  // Base period: 120s at radius 200; scales inversely with sqrt(radius)
  const basePeriodMs = 120_000;
  const baseRadius = 200;
  const periodMs = basePeriodMs * Math.sqrt(radius / baseRadius);
  return (2 * Math.PI) / periodMs;
}

/**
 * Deterministic starting angle for a project (so positions don't jump on hydration).
 * Uses the slug string as a seed.
 */
export function projectStartAngle(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return ((hash >>> 0) / 0xffffffff) * Math.PI * 2;
}
