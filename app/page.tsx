/**
 * app/page.tsx — Homepage: The Galaxy Map
 *
 * Phase 3 implementation. Full-screen galaxy map with two clickable
 * clusters (Projects, Tools) that zoom-navigate to their sections.
 *
 * The quasar anchor and nav from Phase 2 are rendered at layout level —
 * they persist through all routes and don't need to be added here.
 */

import type { Metadata } from "next";
import { GalaxyMap } from "@/components/galaxy/galaxy-map";
import { CurrentOrbitStrip } from "@/components/galaxy/current-orbit-strip";

export const metadata: Metadata = {
  title: "Soham — Portfolio",
  description:
    "The intersection of human curiosity and raw engineering. Explore projects and tools in orbit.",
};

export default function HomePage() {
  return (
    /*
     * Full-viewport layout:
     *   - GalaxyMap fills the available space (flex-1 from layout <main>)
     *   - CurrentOrbitStrip is anchored bottom-left, above the audio toggle
     */
    <div className="relative flex flex-col" style={{ minHeight: "100dvh" }}>
      {/* Galaxy map fills the viewport */}
      <div className="absolute inset-0">
        <GalaxyMap />
      </div>

      {/* Overlay content — positioned relative to the page */}
      <div className="relative z-10 flex flex-col justify-between h-dvh px-6 py-6 pointer-events-none">
        {/* Top area — reserved for quasar anchor (rendered in layout) */}
        <div className="h-12" aria-hidden="true" />

        {/* Bottom strip */}
        <div className="flex items-end justify-between gap-4">
          {/* Current Orbit status — bottom-left */}
          <div className="pointer-events-auto">
            <CurrentOrbitStrip />
          </div>

          {/* Bottom-right — reserved for AudioToggle (rendered in layout) */}
          <div className="w-9 h-9" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
