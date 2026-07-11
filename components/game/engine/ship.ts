/**
 * components/game/engine/ship.ts
 *
 * Ship physics, controls, wraparound, and vector drawing logic.
 * The ship accelerates in the direction of its angle, subject to damping friction.
 */

import { Ship } from "./types";

const ROTATION_SPEED = 0.06; // radians per frame
const THRUST_ACCEL = 0.15;   // acceleration constant
const FRICTION = 0.985;      // velocity damping factor
const MAX_SPEED = 6;         // speed ceiling

export function createShip(x: number, y: number): Ship {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    radius: 12,
    angle: -Math.PI / 2, // point straight up initially
    thrusting: false,
    cooldown: 0,
  };
}

export function updateShip(
  ship: Ship,
  controls: { left: boolean; right: boolean; thrust: boolean },
  width: number,
  height: number
) {
  // 1. Rotate ship
  if (controls.left) {
    ship.angle -= ROTATION_SPEED;
  }
  if (controls.right) {
    ship.angle += ROTATION_SPEED;
  }

  // 2. Thrust acceleration
  ship.thrusting = controls.thrust;
  if (controls.thrust) {
    ship.vx += Math.cos(ship.angle) * THRUST_ACCEL;
    ship.vy += Math.sin(ship.angle) * THRUST_ACCEL;
  }

  // 3. Apply friction damping
  ship.vx *= FRICTION;
  ship.vy *= FRICTION;

  // 4. Cap max speed
  const speed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
  if (speed > MAX_SPEED) {
    ship.vx = (ship.vx / speed) * MAX_SPEED;
    ship.vy = (ship.vy / speed) * MAX_SPEED;
  }

  // 5. Update coordinates
  ship.x += ship.vx;
  ship.y += ship.vy;

  // 6. Wrap around screen borders
  const r = ship.radius;
  if (ship.x < -r) ship.x = width + r;
  if (ship.x > width + r) ship.x = -r;
  if (ship.y < -r) ship.y = height + r;
  if (ship.y > height + r) ship.y = -r;

  // 7. Update weapon cooldown
  if (ship.cooldown > 0) {
    ship.cooldown--;
  }
}

export function drawShip(
  ctx: CanvasRenderingContext2D,
  ship: Ship,
  color: string
) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  // Set line-art styling
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "transparent";

  // Draw main ship body (polygon outline)
  ctx.beginPath();
  // Nose
  ctx.moveTo(14, 0);
  // Rear left
  ctx.lineTo(-10, -8);
  // Indented rear center
  ctx.lineTo(-6, 0);
  // Rear right
  ctx.lineTo(-10, 8);
  ctx.closePath();
  ctx.stroke();

  // Draw cockpit details
  ctx.beginPath();
  ctx.moveTo(2, -3);
  ctx.lineTo(6, 0);
  ctx.lineTo(2, 3);
  ctx.closePath();
  ctx.stroke();

  // Draw thrust flame (flickers based on Math.random or frame ticks)
  if (ship.thrusting && Math.random() > 0.3) {
    ctx.beginPath();
    ctx.moveTo(-6, -3);
    ctx.lineTo(-16 - Math.random() * 8, 0);
    ctx.lineTo(-6, 3);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}
