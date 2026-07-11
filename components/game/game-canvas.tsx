"use client";

/**
 * components/game/game-canvas.tsx
 *
 * Canvas 2D game renderer and input listener.
 * Links keyboard events (arrows, WASD, Space, Escape to pause)
 * and mobile TouchControls to the physics engine.
 *
 * Drawing is rendered on HTML5 Canvas using thin glowing vector line-art
 * matching the oscilloscope reference styling:
 *   - Colors use CSS variables directly ('var(--phosphor-amber)', 'var(--phosphor-green)')
 *   - Background matches '--void-black'
 *   - Text uses monospace console font '--font-mono'
 *
 * Halts requestAnimationFrame loop completely when paused or unmounted.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { TouchControls } from "./touch-controls";
import { GameState } from "./engine/types";
import { initGameState, updateGameFrame } from "./engine/loop";
import { drawShip } from "./engine/ship";
import { drawAsteroid } from "./engine/asteroid";
import { useSound } from "@/lib/audio";

const AMBER_VAR = "var(--phosphor-amber)";
const GREEN_VAR = "var(--phosphor-green)";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Resolved CSS variable colors for canvas context compatibility
  const amberColorRef = useRef("rgba(255, 180, 84, 1)");
  const greenColorRef = useRef("rgba(124, 255, 178, 1)");

  // Hook sound playbacks
  const { play: playFire } = useSound("/audio/game-fire.mp3");
  const { play: playExplosion } = useSound("/audio/game-explosion.mp3");
  const { play: playGameOver } = useSound("/audio/calibrate-confirm.mp3");

  // Keep track of active keys
  const keysRef = useRef({
    left: false,
    right: false,
    thrust: false,
    fire: false,
  });

  // Track touch controls state
  const touchStateRef = useRef({
    left: false,
    right: false,
    thrust: false,
    fire: false,
  });

  const animFrameRef = useRef<number | null>(null);

  // Initialize GameState when canvas mounts
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Resolve CSS custom variable values dynamically from DOM computed properties
    if (typeof window !== "undefined") {
      const styles = window.getComputedStyle(document.documentElement);
      const amber = styles.getPropertyValue("--phosphor-amber").trim();
      const green = styles.getPropertyValue("--phosphor-green").trim();
      if (amber) amberColorRef.current = amber;
      if (green) greenColorRef.current = green;
    }
    
    // Fit canvas to screen containers initially
    const w = containerRef.current?.clientWidth || 800;
    const h = containerRef.current?.clientHeight || 600;
    canvas.width = w;
    canvas.height = h;

    const initialState = initGameState(w, h);
    setGameState(initialState);

    // Binds keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (initialState.gameOver) return;

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          keysRef.current.left = true;
          break;
        case "ArrowRight":
        case "KeyD":
          keysRef.current.right = true;
          break;
        case "ArrowUp":
        case "KeyW":
          keysRef.current.thrust = true;
          break;
        case "Space":
          e.preventDefault(); // Stop page scrolling
          keysRef.current.fire = true;
          break;
        case "Escape":
        case "KeyP":
          e.preventDefault();
          togglePause();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          keysRef.current.left = false;
          break;
        case "ArrowRight":
        case "KeyD":
          keysRef.current.right = false;
          break;
        case "ArrowUp":
        case "KeyW":
          keysRef.current.thrust = false;
          break;
        case "Space":
          keysRef.current.fire = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle resizing dynamically
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !gameState) return;
      const canvas = canvasRef.current;
      const w = containerRef.current?.clientWidth || 800;
      const h = containerRef.current?.clientHeight || 600;
      canvas.width = w;
      canvas.height = h;
      gameState.width = w;
      gameState.height = h;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gameState]);

  // Pause control function
  const togglePause = useCallback(() => {
    if (!gameState || gameState.gameOver) return;
    gameState.paused = !gameState.paused;
    setIsPaused(gameState.paused);
  }, [gameState]);

  // Reset/Restart Game
  const handleRestart = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const newState = initGameState(canvas.width, canvas.height);
    setGameState(newState);
    setIsPaused(false);
    keysRef.current = { left: false, right: false, thrust: false, fire: false };
    touchStateRef.current = { left: false, right: false, thrust: false, fire: false };
  };

  // Main Loop update & draw ticks
  useEffect(() => {
    if (!gameState || isPaused) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      // Combine keyboard inputs and touch controls inputs
      const activeControls = {
        left: keysRef.current.left || touchStateRef.current.left,
        right: keysRef.current.right || touchStateRef.current.right,
        thrust: keysRef.current.thrust || touchStateRef.current.thrust,
        fire: keysRef.current.fire || touchStateRef.current.fire,
      };

      const oldBulletCount = gameState.bullets.length;
      const oldAsteroidCount = gameState.asteroids.length;
      const oldLives = gameState.lives;
      const oldGameOver = gameState.gameOver;

      const amberColor = amberColorRef.current;
      const greenColor = greenColorRef.current;

      // 1. Run physics update timestep
      updateGameFrame(gameState, activeControls, amberColor, greenColor);

      // Trigger audio events based on state variations
      if (gameState.bullets.length > oldBulletCount) {
        playFire();
      }
      if (gameState.asteroids.length < oldAsteroidCount) {
        playExplosion();
      }
      if (gameState.lives < oldLives) {
        playExplosion(); // Player hit explosion rumble
      }
      if (gameState.gameOver && !oldGameOver) {
        playGameOver(); // Deep chord chime
      }

      // 2. Render Scene
      ctx.fillStyle = "rgba(5, 6, 10, 1)"; // --void-black background matches
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines (scope oscilloscope texture grid)
      ctx.strokeStyle = "rgba(255, 180, 84, 0.02)";
      ctx.lineWidth = 0.5;
      const step = 80;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw bullets
      ctx.fillStyle = greenColor;
      gameState.bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw asteroids
      gameState.asteroids.forEach((ast) => {
        drawAsteroid(ctx, ast, greenColor);
      });

      // Draw particles
      gameState.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw ship
      if (!gameState.gameOver) {
        drawShip(ctx, gameState.ship, amberColor);
      }

      // Draw HUD scoreboard & registry metrics in monospace
      ctx.fillStyle = amberColor;
      ctx.font = "10px var(--font-mono), Courier New, monospace";
      ctx.textAlign = "left";

      // Status HUD Left
      ctx.fillText(`SCORE: ${gameState.score.toString().padStart(6, "0")}`, 20, 30);
      ctx.fillText(`WAVE:  ${gameState.level.toString().padStart(2, "0")}`, 20, 45);
      
      // Lives represented as vector glyphs
      ctx.fillText("LIVES: ", 20, 60);
      ctx.lineWidth = 1;
      ctx.strokeStyle = amberColor;
      for (let i = 0; i < gameState.lives; i++) {
        ctx.save();
        ctx.translate(65 + i * 14, 55);
        ctx.rotate(-Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(-4, -3);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-4, 3);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // HUD Right
      ctx.textAlign = "right";
      ctx.fillText(`HIGH_SCORE: ${gameState.highScore.toString().padStart(6, "0")}`, canvas.width - 20, 30);
      ctx.fillText("SIMULATION: RUNNING", canvas.width - 20, 45);

      // Draw Game Over Screen
      if (gameState.gameOver) {
        ctx.fillStyle = "rgba(5, 6, 10, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = amberColor;
        ctx.strokeRect(canvas.width / 2 - 140, canvas.height / 2 - 80, 280, 160);

        ctx.fillStyle = amberColor;
        ctx.textAlign = "center";
        ctx.font = "16px var(--font-mono), Courier New, monospace";
        ctx.fillText("SIMULATION TERMINATED", canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = "11px var(--font-mono), Courier New, monospace";
        ctx.fillText(`FINAL REGISTERED SCORE: ${gameState.score}`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText("PRESS ENTER OR CLICK RESTART", canvas.width / 2, canvas.height / 2 + 15);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [gameState, isPaused]);

  // Capture Enter to Restart on Game Over
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.code === "Enter" && gameState?.gameOver) {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  }, [gameState]);

  return (
    <div ref={containerRef} className="relative w-full h-full select-none overflow-hidden bg-void">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Screen HUD Overlay Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-4 pointer-events-auto">
        <button
          onClick={togglePause}
          disabled={!!gameState?.gameOver}
          className="font-mono text-[9px] tracking-widest uppercase border px-2 py-1 transition-colors hover:bg-amber/5 focus:outline-none"
          style={{
            borderColor: "rgba(255, 180, 84, 0.3)",
            color: "var(--phosphor-amber)",
          }}
        >
          {isPaused ? "RESUME_SIM" : "PAUSE_SIM"}
        </button>
        <button
          onClick={handleRestart}
          className="font-mono text-[9px] tracking-widest uppercase border px-2 py-1 transition-colors hover:bg-amber/5 focus:outline-none"
          style={{
            borderColor: "rgba(255, 180, 84, 0.3)",
            color: "var(--phosphor-amber)",
          }}
        >
          REBOOT_GRID
        </button>
      </div>

      {/* Pause indicator screen */}
      {isPaused && !gameState?.gameOver && (
        <div className="absolute inset-0 bg-void/70 z-10 flex items-center justify-center pointer-events-none">
          <div
            className="border px-6 py-4 font-mono text-xs text-center"
            style={{
              borderColor: "rgba(255, 180, 84, 0.3)",
              color: "var(--phosphor-amber)",
              backgroundColor: "var(--deep-navy)",
            }}
          >
            [SYSTEM_PAUSED]
            <br />
            PRESS ESC OR P TO RESUME
          </div>
        </div>
      )}

      {/* Touch controls overlay for mobile */}
      <TouchControls
        onRotateLeft={(active) => {
          touchStateRef.current.left = active;
        }}
        onRotateRight={(active) => {
          touchStateRef.current.right = active;
        }}
        onThrust={(active) => {
          touchStateRef.current.thrust = active;
        }}
        onFire={(active) => {
          touchStateRef.current.fire = active;
        }}
      />
    </div>
  );
}
