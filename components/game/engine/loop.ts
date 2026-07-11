/**
 * components/game/engine/loop.ts
 *
 * Core timestep updates and game rules manager.
 * Drives entity ticks, bullet life limits, collisions, scoring, splits,
 * level waves, and progressive difficulty scaling (frequency/speed increase).
 */

import { GameState, Bullet, Asteroid } from "./types";
import { createShip, updateShip } from "./ship";
import { createAsteroid, updateAsteroid, spawnAsteroidAtEdge } from "./asteroid";
import { checkCollision, spawnExplosion } from "./collision";

const BULLET_SPEED = 8.5;
const BULLET_LIFETIME = 55; // frames (approx 0.9 seconds)
const FIRE_COOLDOWN = 11;   // frames between fires

export function initGameState(width: number, height: number): GameState {
  // Load local high score safely
  let storedHighScore = 0;
  if (typeof window !== "undefined") {
    try {
      const val = localStorage.getItem("observatory_high_score");
      if (val) storedHighScore = parseInt(val, 10) || 0;
    } catch (_) {}
  }

  const state: GameState = {
    width,
    height,
    ship: createShip(width / 2, height / 2),
    asteroids: [],
    bullets: [],
    particles: [],
    score: 0,
    lives: 3,
    gameOver: false,
    highScore: storedHighScore,
    paused: false,
    level: 1,
    spawnTimer: 0,
  };

  // Start with 4 large asteroids
  spawnWave(state);

  return state;
}

function spawnWave(state: GameState) {
  const count = 3 + state.level; // level 1 = 4, level 2 = 5...
  for (let i = 0; i < count; i++) {
    const seed = Date.now() + i * 17;
    state.asteroids.push(
      spawnAsteroidAtEdge(state.width, state.height, 3, seed)
    );
  }
}

/**
 * Executes a single physics frame update.
 */
export function updateGameFrame(
  state: GameState,
  keys: { left: boolean; right: boolean; thrust: boolean; fire: boolean },
  amberColor: string,
  greenColor: string
) {
  if (state.gameOver || state.paused) return;

  // 1. Update player ship
  updateShip(state.ship, keys, state.width, state.height);

  // 2. Fire weapon bullet if requested and cooled down
  if (keys.fire && state.ship.cooldown === 0) {
    // Spawn bullet at ship nose
    const angle = state.ship.angle;
    const noseDist = state.ship.radius + 3;
    const bx = state.ship.x + Math.cos(angle) * noseDist;
    const by = state.ship.y + Math.sin(angle) * noseDist;

    // Bullet velocity is added to ship's current velocity vectors
    const bvx = state.ship.vx * 0.4 + Math.cos(angle) * BULLET_SPEED;
    const bvy = state.ship.vy * 0.4 + Math.sin(angle) * BULLET_SPEED;

    state.bullets.push({
      x: bx,
      y: by,
      vx: bvx,
      vy: bvy,
      radius: 1.5,
      life: BULLET_LIFETIME,
    });

    state.ship.cooldown = FIRE_COOLDOWN;
  }

  // 3. Update bullets
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const b = state.bullets[i];
    b.x += b.vx;
    b.y += b.vy;
    b.life--;

    // Remove old bullets
    if (
      b.life <= 0 ||
      b.x < 0 ||
      b.x > state.width ||
      b.y < 0 ||
      b.y > state.height
    ) {
      state.bullets.splice(i, 1);
    }
  }

  // 4. Update asteroids
  state.asteroids.forEach((ast) => {
    updateAsteroid(ast, state.width, state.height);
  });

  // 5. Update debris particles
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }

  // 6. Spawn occasional extra edge asteroids based on time (difficulty scaling)
  state.spawnTimer++;
  const spawnFrequency = Math.max(300 - state.level * 25, 120); // spawn faster on higher levels
  if (state.spawnTimer > spawnFrequency) {
    state.spawnTimer = 0;
    // Don't overrun the screen; cap maximum simultaneous active asteroids
    if (state.asteroids.length < 18) {
      state.asteroids.push(
        spawnAsteroidAtEdge(
          state.width,
          state.height,
          Math.random() > 0.6 ? 2 : 3, // spawn large or medium
          Date.now() + 99
        )
      );
    }
  }

  // 7. Check Collisions: Bullet-to-Asteroid
  bulletCheck: for (let i = state.bullets.length - 1; i >= 0; i--) {
    const b = state.bullets[i];

    for (let j = state.asteroids.length - 1; j >= 0; j--) {
      const ast = state.asteroids[j];

      if (checkCollision(b, ast)) {
        // Bullet hit!
        // Remove bullet and asteroid
        state.bullets.splice(i, 1);
        state.asteroids.splice(j, 1);

        // Score based on stage
        state.score += ast.stage === 3 ? 100 : ast.stage === 2 ? 150 : 200;

        // Spawn green explosion particles
        state.particles.push(
          ...spawnExplosion(ast.x, ast.y, greenColor, ast.stage * 6)
        );

        // Split into two smaller asteroids if stage is Large(3) or Medium(2)
        if (ast.stage > 1) {
          const nextStage = ast.stage - 1;
          const seedBase = ast.seed + Date.now();
          state.asteroids.push(
            createAsteroid(ast.x, ast.y, nextStage, seedBase + 10),
            createAsteroid(ast.x, ast.y, nextStage, seedBase + 20)
          );
        }

        continue bulletCheck;
      }
    }
  }

  // 8. Check Collisions: Ship-to-Asteroid
  for (let i = state.asteroids.length - 1; i >= 0; i--) {
    const ast = state.asteroids[i];
    if (checkCollision(state.ship, ast)) {
      // Ship hit!
      state.lives--;

      // Spawn amber explosion particles
      state.particles.push(
        ...spawnExplosion(state.ship.x, state.ship.y, amberColor, 20)
      );

      // Remove the colliding asteroid to give the player breathing room
      state.asteroids.splice(i, 1);

      if (state.lives <= 0) {
        // Game Over!
        state.gameOver = true;
        if (state.score > state.highScore) {
          state.highScore = state.score;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("observatory_high_score", state.score.toString());
            } catch (_) {}
          }
        }
      } else {
        // Reset ship to center, clear speeds
        state.ship.x = state.width / 2;
        state.ship.y = state.height / 2;
        state.ship.vx = 0;
        state.ship.vy = 0;
        state.ship.angle = -Math.PI / 2;
      }
      break;
    }
  }

  // 9. Progress Wave Levels if all asteroids are destroyed
  if (state.asteroids.length === 0) {
    state.level++;
    // Award a bonus life up to max 5 lives
    if (state.lives < 5) state.lives++;
    spawnWave(state);
  }
}
