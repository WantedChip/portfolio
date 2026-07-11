/**
 * components/game/engine/collision.ts
 *
 * Circle-to-circle collision detection and particle explosion generator.
 */

import { Entity, Particle } from "./types";

/**
 * Returns true if two entities overlap based on circle-to-circle distance math.
 */
export function checkCollision(a: Entity, b: Entity): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distSq = dx * dx + dy * dy;
  const rSum = a.radius + b.radius;
  return distSq < rSum * rSum;
}

/**
 * Generates an array of explosion debris particles at coordinates.
 */
export function spawnExplosion(
  x: number,
  y: number,
  color: string,
  count = 10
): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;
    const life = 20 + Math.floor(Math.random() * 30); // 20 to 50 frames of life

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 0.8 + Math.random() * 0.8,
      life,
      maxLife: life,
      color,
    });
  }

  return particles;
}
