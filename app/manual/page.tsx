/**
 * app/manual/page.tsx — Field Manual Page
 *
 * Phase 7D. Explain site navigation, calibration settings (modes), audio mechanics,
 * lifecycle definitions, and provide an accessibility text-forward fallback explaining
 * all interactive mechanics in detail. Simple, legibility focused page.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Manual",
  description:
    "Systems Field Manual — guide to navigational coordinates and workspace settings.",
};

export default function ManualPage() {
  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-2xl mx-auto"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Document header banner */}
      <header
        className="mb-10 border-b pb-6 font-mono text-xs"
        style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
      >
        <span style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}>
          SYS_DOC // FIELD_MANUAL
        </span>
        <h1
          className="font-display text-3xl md:text-4xl leading-tight mt-2"
          style={{ color: "var(--text-primary)" }}
        >
          Field Manual
        </h1>
        <p
          className="mt-1 uppercase"
          style={{ color: "var(--text-muted)", opacity: 0.8 }}
        >
          OPERATIONAL INSTRUCTIONS FOR ACCESSIBILITY AND SITE INTERACTIONS
        </p>
      </header>

      {/* Manual sections */}
      <main
        className="space-y-8 font-sans text-sm md:text-base leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {/* Navigation guides */}
        <section className="space-y-3">
          <h2
            className="font-mono text-xs tracking-widest uppercase font-bold"
            style={{ color: "var(--phosphor-amber)" }}
          >
            01. Cosmic Coordinates & Navigation
          </h2>
          <p>
            The landing viewport renders a <strong>Galaxy Map</strong> displaying primary workspace coordinates.
            Clicking or focusing a galaxy cluster (Projects or Tools) triggers a focused vector zoom towards that coordinate sector before loading the corresponding route.
          </p>
          <p>
            The top-left crosshair (the <strong>Quasar Anchor</strong>) is fixed across all pages. Clicking it returns you directly to the center coordinates (the home Galaxy Map).
          </p>
        </section>

        {/* System calibration */}
        <section
          className="space-y-3 pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase font-bold"
            style={{ color: "var(--phosphor-amber)" }}
          >
            02. System Calibration (Modes)
          </h2>
          <p>
            On first visit, the workspace prompts a system calibration. This choice determines the sensory density of the cosmos:
          </p>
          <ul
            className="list-disc pl-5 space-y-2 font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <li>
              <strong style={{ color: "var(--text-primary)" }}>
                Full Experience:
              </strong>{" "}
              Activates custom coordinate transitions, responsive hover loops, and ambient auditory feedback.
            </li>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>
                Calm Mode:
              </strong>{" "}
              Limits layout motion. SVG orbits and vectors freeze at static starting coordinates. Auditory feedback is disabled.
            </li>
          </ul>
          <p>
            If your Operating System has <em>Reduced Motion</em> enabled, the workspace automatically calibrates to Calm Mode to protect accessibility.
          </p>
        </section>

        {/* Audio control mechanics */}
        <section
          className="space-y-3 pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase font-bold"
            style={{ color: "var(--phosphor-amber)" }}
          >
            03. Auditory Feedback Control
          </h2>
          <p>
            The persistent audio controller sits fixed in the bottom-right corner. It allows toggle control of the auditory system at any coordinate.
            Calm Mode users can opt into system audio via this button, and Full Experience users can mute telemetry sounds instantly.
          </p>
        </section>

        {/* Component lifecycles */}
        <section
          className="space-y-3 pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase font-bold"
            style={{ color: "var(--phosphor-amber)" }}
          >
            04. System Component Lifecycles
          </h2>
          <p>
            All projects and tools carry a telemetry badge reflecting their active lifecycle state. Their visual representation inside the solar system or ledger changes accordingly:
          </p>
          <ul
            className="space-y-2 font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <li>
              <span style={{ color: "var(--text-muted)" }}>• [In Drift]</span> —
              Conceptual idea only. Statically rendered as a loose dot cluster with no defined boundaries.
            </li>
            <li>
              <span style={{ color: "var(--phosphor-amber)" }}>• [Nebula]</span> —
              Concept defined but not started. Diffuse radial gradient glow core.
            </li>
            <li>
              <span style={{ color: "var(--phosphor-amber)" }}>
                • [Forming]
              </span>{" "}
              — In active development. Rendered with an accretion ring drawing particles inward.
            </li>
            <li>
              <span style={{ color: "var(--phosphor-green)" }}>• [Active]</span> —
              Live system, actively operating. Full opacity solid body.
            </li>
            <li>
              <span style={{ color: "var(--text-muted)" }}>• [Remnant]</span> —
              Archived or superseded. Desaturated, cracked body. Orbit motion is fully frozen.
            </li>
          </ul>
        </section>

        {/* Hints */}
        <section
          className="space-y-3 pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase font-bold"
            style={{ color: "var(--phosphor-amber)" }}
          >
            05. Hidden Signals (Remnants)
          </h2>
          <p>
            The telemetry registers indicate hidden coordinates inside the workspace control board. Remnant updates or manual details may contain links routing to the <strong>Observatory</strong>,
            where vector system diagnostic simulations are active.
          </p>
        </section>
      </main>
    </div>
  );
}
