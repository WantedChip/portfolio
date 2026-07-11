"use client";

/**
 * components/game/touch-controls.tsx
 *
 * Mobile overlay controller pads. Renders on-screen touch buttons for
 * rotation (Left/Right), Thrust acceleration, and weapon firing.
 * Hidden on desktop viewports.
 *
 * Implements clean multi-touch handler bindings, preventing page scrolls.
 */

import React from "react";

interface TouchControlsProps {
  onRotateLeft: (active: boolean) => void;
  onRotateRight: (active: boolean) => void;
  onThrust: (active: boolean) => void;
  onFire: (active: boolean) => void;
}

export function TouchControls({
  onRotateLeft,
  onRotateRight,
  onThrust,
  onFire,
}: TouchControlsProps) {
  const preventScroll = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
  };

  return (
    <div
      className="absolute bottom-6 left-0 right-0 z-30 px-6 flex justify-between gap-4 pointer-events-none md:hidden"
      aria-hidden="true"
    >
      {/* Rotation inputs — bottom left */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onTouchStart={(e) => {
            preventScroll(e);
            onRotateLeft(true);
          }}
          onTouchEnd={() => onRotateLeft(false)}
          onMouseDown={() => onRotateLeft(true)}
          onMouseUp={() => onRotateLeft(false)}
          onMouseLeave={() => onRotateLeft(false)}
          className="w-14 h-14 border rounded flex items-center justify-center font-mono text-lg font-bold select-none focus:outline-none"
          style={{
            borderColor: "rgba(255, 180, 84, 0.4)",
            color: "var(--phosphor-amber)",
            backgroundColor: "rgba(5, 6, 10, 0.6)",
          }}
        >
          ◀
        </button>
        <button
          onTouchStart={(e) => {
            preventScroll(e);
            onRotateRight(true);
          }}
          onTouchEnd={() => onRotateRight(false)}
          onMouseDown={() => onRotateRight(true)}
          onMouseUp={() => onRotateRight(false)}
          onMouseLeave={() => onRotateRight(false)}
          className="w-14 h-14 border rounded flex items-center justify-center font-mono text-lg font-bold select-none focus:outline-none"
          style={{
            borderColor: "rgba(255, 180, 84, 0.4)",
            color: "var(--phosphor-amber)",
            backgroundColor: "rgba(5, 6, 10, 0.6)",
          }}
        >
          ▶
        </button>
      </div>

      {/* Action inputs — bottom right */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onTouchStart={(e) => {
            preventScroll(e);
            onThrust(true);
          }}
          onTouchEnd={() => onThrust(false)}
          onMouseDown={() => onThrust(true)}
          onMouseUp={() => onThrust(false)}
          onMouseLeave={() => onThrust(false)}
          className="w-14 h-14 border rounded flex items-center justify-center font-mono text-[9px] tracking-wider font-bold select-none focus:outline-none"
          style={{
            borderColor: "rgba(255, 180, 84, 0.4)",
            color: "var(--phosphor-amber)",
            backgroundColor: "rgba(5, 6, 10, 0.6)",
          }}
        >
          THRUST
        </button>
        <button
          onTouchStart={(e) => {
            preventScroll(e);
            onFire(true);
          }}
          onTouchEnd={() => onFire(false)}
          onMouseDown={() => onFire(true)}
          onMouseUp={() => onFire(false)}
          onMouseLeave={() => onFire(false)}
          className="w-14 h-14 border rounded flex items-center justify-center font-mono text-xs font-bold select-none focus:outline-none"
          style={{
            borderColor: "rgba(124, 255, 178, 0.4)",
            color: "var(--phosphor-green)",
            backgroundColor: "rgba(5, 6, 10, 0.6)",
          }}
        >
          FIRE
        </button>
      </div>
    </div>
  );
}
