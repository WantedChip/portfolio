"use client";

/**
 * lib/audio.ts
 *
 * Custom hook useSound(src) and Web Audio API synthesizer.
 *
 * Architecture:
 *   - Checks soundEnabled from SiteModeProvider before playing.
 *   - If soundEnabled is false, play() is a zero-resource no-op (no pre-fetching or creation).
 *   - Synthesizes default portfolio audio effects procedurally using Web Audio API:
 *     * blip: soft console blip
 *     * pulse-tick: pulsar log chronometer click
 *     * game-fire: laser vector combat fire
 *     * game-explosion: swept low-rumble square explosion
 *     * calibrate-confirm: E-major harmonic chord chimes
 *   - Procedural audio results in exactly 0 bytes page load payload.
 *   - Supports standard HTMLAudioElement lazy load fallbacks for any external sound sources.
 *   - Overlapping plays reset currentTime to 0.
 */

import { useCallback, useRef } from "react";
import { useSiteMode } from "@/components/console/site-mode-context";

// Web Audio API Context (instantiated on first user interaction)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Procedural synthesizer for portfolio event sounds.
 * Generates signals in code matching the oscilloscope vector aesthetic.
 */
function playSynthesizedSound(type: "blip" | "pulse-tick" | "game-fire" | "game-explosion" | "calibrate-confirm") {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  switch (type) {
    case "blip": {
      // Soft console blip (900Hz to 1100Hz frequency sweep, 0.05s decay)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);

      gain.gain.setValueAtTime(0.04, now); // Soft volume default
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
      break;
    }
    case "pulse-tick": {
      // Pulsar tick (extremely brief metallic click, 0.02s decay)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.02);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
      break;
    }
    case "game-fire": {
      // Weapon fire (descending triangle sweep, 0.12s decay)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
      break;
    }
    case "game-explosion": {
      // Low rumble explosion (swept low frequency triangle wave, 0.35s decay)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(20, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
      break;
    }
    case "calibrate-confirm": {
      // Warm E harmonic chime (E4 & B4 chord chimes, 0.5s fade)
      const playChime = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.04, now + delay + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.55);
      };

      playChime(329.63, 0); // E4
      playChime(493.88, 0.08); // B4
      break;
    }
  }
}

/**
 * useSound hook.
 *
 * Checks SiteModeProvider state.
 * If audio is enabled, plays the sound (synthesized procedurally if matching
 * a known asset path, or lazily loading HTMLAudioElement otherwise).
 */
export function useSound(src: string) {
  const { soundEnabled } = useSiteMode();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    // 1. Hard block if sound system is muted/disabled
    if (!soundEnabled) return;

    // 2. Route matching static files to procedural Web Audio synthesizer
    const assetName = src.split("/").pop();
    switch (assetName) {
      case "blip.mp3":
        playSynthesizedSound("blip");
        return;
      case "pulse-tick.mp3":
        playSynthesizedSound("pulse-tick");
        return;
      case "game-fire.mp3":
        playSynthesizedSound("game-fire");
        return;
      case "game-explosion.mp3":
        playSynthesizedSound("game-explosion");
        return;
      case "calibrate-confirm.mp3":
        playSynthesizedSound("calibrate-confirm");
        return;
    }

    // 3. Fallback: Lazily construct HTMLAudioElement on first use
    if (!audioRef.current && typeof window !== "undefined") {
      audioRef.current = new Audio(src);
      // Low default volume constraint
      audioRef.current.volume = 0.25;
    }

    const audio = audioRef.current;
    if (audio) {
      // Overlapping trigger reset currentTime
      audio.currentTime = 0;
      audio.play().catch((_) => {
        // Autoplay/navigation blocks — catch silently
      });
    }
  }, [src, soundEnabled]);

  return { play };
}
