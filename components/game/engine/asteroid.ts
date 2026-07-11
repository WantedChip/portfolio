/**
 * components/game/engine/asteroid.ts
 *
 * Asteroid spawning, movement, irregular shape generation, and vector drawing logic.
 * Asteroids split into smaller fragments when hit by a projectile.
 */

import { Asteroid } from "./types";
import { seededRandom } from "@/lib/orbit-math";

const STAGE_RADIUS: Record<number, number> = {
  3: 30, // Large
  2: 16, // Medium
  1: 8,  // Small
};

const STAGE_SPEEDS: Record<number, number> = {
  3: 0.8,  // Slower
  2: 1.3,
  1: 1.9,  // Faster
};

/**
 * Creates an asteroid with an irregular polygon shape using a seeded randomizer.
 * Seeded values prevent flickering shapes when recreating entities.
 */
export function createAsteroid(
  x: number,
  y: number,
  stage: number,
  seed: number
): Asteroid {
  const radius = STAGE_RADIUS[stage] || 16;
  const sides = 8 + Math.floor((seed % 5)); // 8 to 12 sides
  const rand = seededRandom(seed);

  // Generate irregular offsets for rendering the jagged rock outline
  const offsets: number[] = [];
  for (let i = 0; i < sides; i++) {
    offsets.push(0.75 + rand() * 0.45); // offset factor of radius
  }

  // Random velocity vector based on speed constraints
  const speed = STAGE_SPEEDS[stage] * (0.8 + rand() * 0.4);
  const angle = rand() * Math.PI * 2;

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    sides,
    offsets,
    stage,
    seed,
  };
}

/**
 * Spawns a new asteroid specifically at a screen edge border to prevent
 * sudden spawning in front of the player ship.
 */
export function spawnAsteroidAtEdge(
  width: number,
  height: number,
  stage: number,
  seed: number
): Asteroid {
  const rand = seededRandom(seed);
  const edge = Math.floor(rand() * 4); // 0 = top, 1 = right, 2 = bottom, 3 = left
  let x = 0;
  let y = 0;

  const buffer = 40;

  switch (edge) {
    case 0: // Top
      x = rand() * width;
      y = -buffer;
      break;
    case 1: // Right
      x = width + buffer;
      y = rand() * height;
      break;
    case 2: // Bottom
      x = rand() * width;
      y = height + buffer;
      break;
    case 3: // Left
      x = -buffer;
      y = rand() * height;
      break;
  }

  return createAsteroid(x, y, stage, seed + 101);
}

export function updateAsteroid(asteroid: Asteroid, width: number, height: number) {
  asteroid.x += asteroid.vx;
  asteroid.y += asteroid.vy;

  // Screen wrap-around boundary check
  const r = asteroid.radius;
  if (asteroid.x < -r - 10) asteroid.x = width + r;
  if (asteroid.x > width + r + 10) asteroid.x = -r;
  if (asteroid.y < -r - 10) asteroid.y = height + r;
  if (asteroid.y > height + r + 10) asteroid.y = -r;
}

export function drawAsteroid(
  ctx: CanvasRenderingContext2D,
  asteroid: Asteroid,
  color: string
) {
  ctx.save();
  ctx.translate(asteroid.x, asteroid.y);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.fillStyle = "transparent";

  ctx.beginPath();
  const angleStep = (Math.PI * 2) / asteroid.sides;

  for (let i = 0; i < asteroid.sides; i++) {
    const angle = i * angleStep;
    const r = asteroid.radius * asteroid.offsets[i];
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
export { STAGE_RADIUS };
