"use client";

/**
 * app/observatory/page.tsx — The Game: Vector Combat Simulation
 *
 * Phase 8. Routes to /observatory.
 * Actions:
 *   - Checks SiteModeContext for Calm Mode calibration.
 *   - If Calm Mode: gates entry with an explicit opt-in warning screen
 *     with choices to proceed ("RUN SIMULATION ANYWAY") or retreat.
 *   - Otherwise: launches the full-screen GameCanvas directly.
 */

import { useState } from "react";
import { useSiteMode } from "@/components/console/site-mode-context";
import { GameCanvas } from "@/components/game/game-canvas";
import Link from "next/link";

export default function ObservatoryPage() {
  const { experienceMode } = useSiteMode();
  const isCalm = experienceMode === "calm";
  const [playAnyway, setPlayAnyway] = useState(false);

  // Sensory warning gate under Calm Mode calibration
  if (isCalm && !playAnyway) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center p-6 bg-void"
        style={{ color: "var(--text-primary)" }}
      >
        <div
          className="border max-w-md w-full p-6 font-mono text-xs space-y-6"
          style={{
            borderColor: "rgba(255, 92, 92, 0.4)", // --signal-red warning borders
            backgroundColor: "rgba(11, 18, 38, 0.4)",
          }}
        >
          {/* Header alert */}
          <div
            className="flex items-center gap-2 border-b pb-2"
            style={{ borderColor: "rgba(255, 92, 92, 0.2)" }}
          >
            <span style={{ color: "var(--signal-red)" }}>▲ [SENSORY_ALERT]</span>
            <span
              className="ml-auto text-[9px]"
              style={{ color: "var(--text-muted)" }}
            >
              ID_OBS_GATE
            </span>
          </div>

          {/* Warning copy */}
          <div
            className="space-y-3 leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              THE OBSERVATORY VECTOR SIMULATION CONTAINS HIGH-VELOCITY MOTION
              VECTORS AND TRANSITIONS.
            </p>
            <p>
              WORKSPACE CALIBRATION IS CURRENTLY SET TO [CALM_MODE].
            </p>
          </div>

          {/* Gated choices */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setPlayAnyway(true)}
              className="flex-1 border px-3 py-2 text-center transition-colors focus:outline-none"
              style={{
                borderColor: "var(--phosphor-amber)",
                color: "var(--phosphor-amber)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "rgba(255, 180, 84, 0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              RUN SIMULATION ANYWAY
            </button>
            <Link
              href="/"
              className="flex-1 border px-3 py-2 text-center transition-colors focus:outline-none"
              style={{
                borderColor: "rgba(136, 144, 166, 0.3)",
                color: "var(--text-muted)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "rgba(136, 144, 166, 0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "transparent";
              }}
            >
              RETURN TO SAFETY
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active game canvas
  return (
    <main className="w-full h-dvh relative pt-16">
      <div className="absolute inset-0">
        <GameCanvas />
      </div>
    </main>
  );
}
