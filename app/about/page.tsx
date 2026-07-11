/**
 * app/about/page.tsx — About Page: Operator Profile
 *
 * Phase 6. Visual Operator Profile. Static text-forward narrative covering
 * the electrical engineering background (DBIT), transition into AI agent
 * architectures, current projects (FAIN, internship, awesome-blueprints),
 * and communication links. Simple and legible.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operator Profile",
  description:
    "About Soham — Electrical Engineer and AI Agent developer.",
};

export default function AboutPage() {
  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-2xl mx-auto"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Telemetry metadata header */}
      <header
        className="mb-8 border-b pb-6 font-mono text-xs"
        style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
      >
        <span style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}>
          SYS_STATUS // OPERATOR_PROFILE
        </span>
        <h1
          className="font-display text-3xl md:text-4xl leading-tight mt-2"
          style={{ color: "var(--text-primary)" }}
        >
          Soham
        </h1>
        <p
          className="mt-1 uppercase"
          style={{ color: "var(--text-muted)", opacity: 0.8 }}
        >
          ELECTRICAL ENGINEER & AI AGENT ARCHITECT
        </p>
      </header>

      {/* Main text narrative */}
      <main
        className="space-y-6 font-sans text-sm md:text-base leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        <section className="space-y-4">
          <p>
            I operate at the boundary where physical hardware architectures meet cognitive software systems.
            Originally trained as an Electrical Engineer, my engineering foundation was built on telemetry pipelines,
            signal processing, and embedded systems.
          </p>
          <p>
            Today, I translate those classical system principles to the field of AI systems design,
            building deterministic execution loops, autonomous multi-agent environments, and custom Model Context Protocol (MCP) tooling.
          </p>
        </section>

        {/* Narrative background */}
        <section
          className="space-y-4 pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--phosphor-amber)" }}
          >
            Background & Evolution
          </h2>
          <p>
            My engineering journey began in electrical systems during my time at **Don Bosco Institute of Technology (DBIT)**.
            Designing power distribution layouts and analyzing signal noise taught me to think of software not just as a set of instructions,
            but as a flow of inputs and outputs through constrained channels.
          </p>
          <p>
            This hardware-centric mindset made the transition to AI agent architectures natural.
            Just as an embedded micro-controller continuously polls its sensors, routes telemetry, and adjusts mechanical components,
            a modern AI agent operates within a feedback loop — reading runtime context, selecting tools, and executing decisions.
          </p>
        </section>

        {/* Current focus projects */}
        <section
          className="space-y-4 pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--phosphor-amber)" }}
          >
            Active Coordinates
          </h2>
          <p>My current operations focus on three main vectors:</p>
          <ul
            className="list-disc pl-5 space-y-2 font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <li>
              <strong style={{ color: "var(--text-primary)" }}>
                FAIN (Forensic AI Intelligence Network):
              </strong>{" "}
              Threat detection loops executing rapid validation on network packets.
            </li>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>
                Systems Internship:
              </strong>{" "}
              Engineering production-level data integrations and LLM orchestrator middleware.
            </li>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>
                awesome-blueprints:
              </strong>{" "}
              Curating reproducible infrastructure topologies and deterministic deployment patterns for agent pipelines.
            </li>
          </ul>
        </section>

        {/* Links section */}
        <section
          className="space-y-4 pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--phosphor-amber)" }}
          >
            Communications Uplink
          </h2>
          <p className="text-xs">
            Direct telemetry lines and operational registries:
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs">
            <a
              href="https://github.com/WantedChip"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--phosphor-amber)" }}
              className="hover:opacity-85"
            >
              → GITHUB // WANTEDCHIP
            </a>
            <a
              href="https://linkedin.com/in/soham-ee"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--phosphor-green)" }}
              className="hover:opacity-85"
            >
              → LINKEDIN
            </a>
            <a
              href="https://x.com/soham-ee"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--phosphor-green)" }}
              className="hover:opacity-85"
            >
              → X_PLATFORM
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
