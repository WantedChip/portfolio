/**
 * app/projects/page.tsx — Projects: The Solar System
 *
 * Phase 4. Shows all projects as orbiting bodies in a solar system.
 * The SolarSystem component handles all orbit rendering and animation.
 * This page only: loads projects from content pipeline, renders the system.
 */

import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { SolarSystem } from "@/components/solar-system/solar-system";
import { LifecycleBadge } from "@/components/solar-system/lifecycle-badge";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects in orbit — each body's form reflects its lifecycle stage.",
};

export default function ProjectsPage() {
  const entries = getAllProjects();
  // SolarSystem takes Project[] (frontmatter only) — body is only needed on detail pages
  const projects = entries.map((e) => e.frontmatter);

  return (
    <div className="relative flex flex-col" style={{ minHeight: "100dvh" }}>
      {/* Solar system fills the full viewport */}
      <div className="absolute inset-0">
        <SolarSystem projects={projects} />
      </div>

      {/* Overlay — page label top area, project count bottom */}
      <div className="relative z-10 flex flex-col justify-between h-dvh px-6 py-6 pointer-events-none">
        {/* Top — page identity */}
        <div className="pt-10">
          <p
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
          >
            Projects — Solar System
          </p>
        </div>

        {/* Bottom — lifecycle legend */}
        <div className="pointer-events-auto">
          <div
            className="inline-flex flex-wrap gap-x-5 gap-y-2 px-4 py-3 border"
            style={{
              backgroundColor: "rgba(11, 18, 38, 0.85)",
              borderColor: "rgba(255, 180, 84, 0.15)",
            }}
          >
            {(
              [
                "in-drift",
                "nebula",
                "forming",
                "active",
                "remnant",
              ] as const
            ).map((stage) => (
              <LifecycleBadge key={stage} stage={stage} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
