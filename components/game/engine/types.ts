/**
 * components/game/engine/types.ts
 *
 * Shared TypeScript types for the vector combat game engine.
 * Prevents circular dependency cycles between engine modules.
 */

export interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface Ship extends Entity {
  angle: number;       // rotation angle in radians
  thrusting: boolean;
  cooldown: number;    // firing cooldown frames remaining
}

export interface Asteroid extends Entity {
  sides: number;
  offsets: number[];   // irregular polygon vertex distance offsets
  stage: number;       // 3 = large, 2 = medium, 1 = small
  seed: number;
}

export interface Bullet extends Entity {
  life: number;        // remaining frames of flight life
}

export interface Particle extends Entity {
  life: number;        // current life frames remaining
  maxLife: number;     // initial life frames
  color: string;       // phosphor token color mapping
}

export interface GameState {
  width: number;
  height: number;
  ship: Ship;
  asteroids: Asteroid[];
  bullets: Bullet[];
  particles: Particle[];
  score: number;
  lives: number;
  gameOver: boolean;
  highScore: number;
  paused: boolean;
  level: number;
  spawnTimer: number;  // frames until next asteroid spawn
}
