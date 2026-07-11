"use client";

/**
 * components/console/calibration-modal.tsx
 *
 * First-visit modal shown once per browser session (not on refresh).
 * Deliberately restrained animation — someone choosing Calm Mode shouldn't
 * encounter a flashy entrance before they even get to make that choice.
 *
 * Keyboard accessibility:
 *   - Focus trapped inside modal while open
 *   - Two focusable buttons, arrow-key navigable
 *   - Escape key does NOT dismiss (a choice must be made)
 *   - Announced via role="dialog" + aria-labelledby + aria-describedby
 */

import { useEffect, useRef } from "react";
import { useSiteMode, type ExperienceMode } from "./site-mode-context";

export function CalibrationModal() {
  const { calibrated, calibrate } = useSiteMode();
  const fullBtnRef = useRef<HTMLButtonElement>(null);
  const calmBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus the first button when modal opens
  useEffect(() => {
    if (!calibrated) {
      // Small timeout ensures the modal is painted before we steal focus
      const id = setTimeout(() => fullBtnRef.current?.focus(), 60);
      return () => clearTimeout(id);
    }
  }, [calibrated]);

  // Trap focus inside the modal
  useEffect(() => {
    if (calibrated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusable = [fullBtnRef.current, calmBtnRef.current].filter(
          Boolean,
        ) as HTMLButtonElement[];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      // Arrow keys also cycle between the two buttons
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        calmBtnRef.current?.focus();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        fullBtnRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calibrated]);

  const handleChoice = (mode: ExperienceMode) => {
    const sound = mode === "full";
    calibrate(mode, sound);
  };

  if (calibrated) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(5, 6, 10, 0.92)" }}
      aria-hidden="false"
    >
      {/* Modal panel */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calibration-title"
        aria-describedby="calibration-desc"
        className="relative mx-4 w-full max-w-lg border p-8 sm:p-10"
        style={{
          backgroundColor: "var(--deep-navy)",
          borderColor: "rgba(255, 180, 84, 0.25)",
        }}
      >
        {/* Header */}
        <div className="mb-2 flex items-center gap-3">
          {/* Amber bracket — purely decorative */}
          <span
            aria-hidden="true"
            className="font-mono text-xs"
            style={{ color: "var(--phosphor-amber)" }}
          >
            [INIT]
          </span>
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            System Calibration
          </span>
        </div>

        <h2
          id="calibration-title"
          className="mb-3 font-display text-2xl sm:text-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          How would you like to explore?
        </h2>

        <p
          id="calibration-desc"
          className="mb-8 font-sans text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          Choose your experience. This can be adjusted at any time using the
          controls in the corner.
        </p>

        {/* Choice buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Full Experience */}
          <button
            ref={fullBtnRef}
            id="calibration-full"
            onClick={() => handleChoice("full")}
            className="group flex-1 border px-6 py-5 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={
              {
                borderColor: "rgba(255, 180, 84, 0.35)",
                backgroundColor: "transparent",
                "--tw-ring-color": "var(--phosphor-amber)",
                "--tw-ring-offset-color": "var(--deep-navy)",
              } as React.CSSProperties
            }
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--phosphor-amber)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255, 180, 84, 0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255, 180, 84, 0.35)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <div
              className="mb-1 font-mono text-xs tracking-widest uppercase"
              style={{ color: "var(--phosphor-amber)" }}
            >
              Full Experience
            </div>
            <div
              className="font-sans text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Ambient motion + sound
            </div>
          </button>

          {/* Calm Mode */}
          <button
            ref={calmBtnRef}
            id="calibration-calm"
            onClick={() => handleChoice("calm")}
            className="group flex-1 border px-6 py-5 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={
              {
                borderColor: "rgba(136, 144, 166, 0.3)",
                backgroundColor: "transparent",
                "--tw-ring-color": "var(--text-muted)",
                "--tw-ring-offset-color": "var(--deep-navy)",
              } as React.CSSProperties
            }
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--text-muted)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(136, 144, 166, 0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(136, 144, 166, 0.3)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            <div
              className="mb-1 font-mono text-xs tracking-widest uppercase"
              style={{ color: "var(--text-primary)" }}
            >
              Calm Mode
            </div>
            <div
              className="font-sans text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Reduced motion, silent
            </div>
          </button>
        </div>

        {/* Keyboard hint */}
        <p
          className="mt-6 font-mono text-xs"
          style={{ color: "var(--text-muted)", opacity: 0.6 }}
          aria-hidden="true"
        >
          ← → arrow keys to navigate · Enter to select
        </p>
      </div>
    </div>
  );
}
