"use client";

/**
 * components/console/audio-toggle.tsx
 *
 * Persistent, always-visible audio mute/unmute control.
 * Fixed in the bottom-right corner.
 *
 * Works regardless of experienceMode:
 *   - A Full Experience user can mute if the environment gets loud.
 *   - A Calm Mode user can opt into sound later without recalibrating.
 *
 * Reads and writes `soundEnabled` from SiteModeContext.
 */

import { useSiteMode } from "./site-mode-context";

export function AudioToggle() {
  const { soundEnabled, setSoundEnabled, calibrated } = useSiteMode();

  // Don't render until calibrated — avoids a flash during SSR hydration
  if (!calibrated) return null;

  const label = soundEnabled ? "Mute audio" : "Unmute audio";

  return (
    <button
      id="audio-toggle"
      onClick={() => setSoundEnabled(!soundEnabled)}
      aria-label={label}
      aria-pressed={soundEnabled}
      title={label}
      className="fixed bottom-6 right-6 z-40 flex h-9 w-9 items-center justify-center border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={
        {
          backgroundColor: "var(--deep-navy)",
          borderColor: soundEnabled
            ? "rgba(255, 180, 84, 0.4)"
            : "rgba(136, 144, 166, 0.3)",
          "--tw-ring-color": "var(--phosphor-amber)",
          "--tw-ring-offset-color": "var(--void-black)",
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "var(--phosphor-amber)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = soundEnabled
          ? "rgba(255, 180, 84, 0.4)"
          : "rgba(136, 144, 166, 0.3)";
      }}
    >
      {soundEnabled ? (
        /* Sound ON icon */
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 5.5H4.5L8 2V14L4.5 10.5H2V5.5Z"
            stroke="var(--phosphor-amber)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 5.5C11.5 6.2 12 7 12 8C12 9 11.5 9.8 10.5 10.5"
            stroke="var(--phosphor-amber)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M12.5 3.5C14 4.8 14.8 6.3 14.8 8C14.8 9.7 14 11.2 12.5 12.5"
            stroke="var(--phosphor-amber)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      ) : (
        /* Sound OFF icon */
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 5.5H4.5L8 2V14L4.5 10.5H2V5.5Z"
            stroke="var(--text-muted)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* X strike */}
          <line
            x1="10.5"
            y1="5.5"
            x2="14.5"
            y2="10.5"
            stroke="var(--text-muted)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="14.5"
            y1="5.5"
            x2="10.5"
            y2="10.5"
            stroke="var(--text-muted)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
