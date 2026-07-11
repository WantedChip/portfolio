/**
 * app/resume/page.tsx — Resume Page: Flight Log
 *
 * Phase 6. Structured resume timeline rendered as a system flight log ledger.
 * Features:
 *   - Prominent download button pointing to public/resume.pdf (ATS-friendly version)
 *   - Monospace dates, timelines, and terse descriptions
 *   - Grid listing core competencies (Cognitive Software & Embedded Physical)
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flight Log",
  description: "Operational flight log and resume ledger.",
};

const EXPERIENCE = [
  {
    date: "2024-PRESENT",
    role: "AI SYSTEMS & AGENTS INTERN",
    company: "SYSTEMS LAB",
    desc: "Engineering production-level Model Context Protocol (MCP) servers, orchestrator middleware pipelines, and validation agents.",
  },
  {
    date: "2024-PRESENT",
    role: "FOUNDING ENGINEER",
    company: "FAIN NETWORK",
    desc: "Architected Forensic AI Intelligence Network threat detection loops. Deployed real-time packet parsing pipelines.",
  },
  {
    date: "2022-2024",
    role: "RESEARCH FELLOW (EE)",
    company: "DBIT DEPT OF ELECTRICAL ENGINEERING",
    desc: "Designed power distribution grid models and telemetry loggers. Reduced telemetry processing lag by 35%.",
  },
] as const;

const EDUCATION = [
  {
    date: "2020-2024",
    degree: "BACHELOR OF ENGINEERING (EE)",
    institution: "DON BOSCO INSTITUTE OF TECHNOLOGY",
    desc: "Specialized in control loop systems, signals and noise mitigation, and digital controller networks.",
  },
] as const;

export default function ResumePage() {
  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-2xl mx-auto"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Registry flight log header */}
      <header
        className="mb-10 border-b pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
      >
        <div>
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
          >
            REGISTRY // FLIGHT_LOG
          </span>
          <h1 className="font-display text-3xl md:text-4xl leading-tight mt-1">
            Flight Log
          </h1>
        </div>

        {/* Download PDF button */}
        <a
          href="/resume.pdf"
          download="Soham_Flight_Log.pdf"
          className="font-mono text-xs px-4 py-2 border text-center transition-colors duration-150 focus:outline-none focus-visible:ring-1 border-amber text-amber bg-transparent hover:bg-amber/5"
          style={
            {
              "--tw-ring-color": "var(--phosphor-amber)",
            } as React.CSSProperties
          }
        >
          DOWNLOAD_PDF [ATS_COMPAT]
        </a>
      </header>

      <main className="space-y-10">
        {/* Experience log timelines */}
        <section>
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-6 border-b pb-1"
            style={{
              color: "var(--text-primary)",
              borderColor: "rgba(136, 144, 166, 0.15)",
            }}
          >
            OPERATIONAL_HISTORY
          </h2>
          <div
            className="space-y-8 relative pl-4 border-l border-dashed"
            style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
          >
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative group">
                {/* Timeline node dot */}
                <span
                  className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border bg-void"
                  style={{
                    borderColor: "var(--phosphor-amber)",
                  }}
                  aria-hidden="true"
                />
                <div className="font-mono text-xs mb-1 flex flex-wrap items-center gap-2">
                  <span style={{ color: "var(--phosphor-amber)" }}>
                    [{exp.date}]
                  </span>
                  <span
                    style={{ color: "var(--text-primary)" }}
                    className="font-semibold"
                  >
                    {exp.role}
                  </span>
                  <span style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                    //
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {exp.company}
                  </span>
                </div>
                <p
                  className="font-sans text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Academic foundation log */}
        <section>
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-6 border-b pb-1"
            style={{
              color: "var(--text-primary)",
              borderColor: "rgba(136, 144, 166, 0.15)",
            }}
          >
            ACADEMIC_FOUNDATION
          </h2>
          <div
            className="space-y-8 relative pl-4 border-l border-dashed"
            style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
          >
            {EDUCATION.map((edu, i) => (
              <div key={i} className="relative group">
                {/* Timeline node green dot */}
                <span
                  className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border bg-void"
                  style={{
                    borderColor: "var(--phosphor-green)",
                  }}
                  aria-hidden="true"
                />
                <div className="font-mono text-xs mb-1 flex flex-wrap items-center gap-2">
                  <span style={{ color: "var(--phosphor-green)" }}>
                    [{edu.date}]
                  </span>
                  <span
                    style={{ color: "var(--text-primary)" }}
                    className="font-semibold"
                  >
                    {edu.degree}
                  </span>
                  <span style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                    //
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {edu.institution}
                  </span>
                </div>
                <p
                  className="font-sans text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {edu.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical core systems specifications */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--phosphor-amber)" }}
          >
            SYSTEMS_CAPABILITIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div
              className="border p-3"
              style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
            >
              <span style={{ color: "var(--phosphor-amber)" }} className="block mb-2">
                // COGNITIVE_SOFTWARE
              </span>
              <ul
                className="space-y-1"
                style={{ color: "var(--text-muted)" }}
              >
                <li>• Langs: TypeScript, Python, Rust, Go</li>
                <li>• Web: Next.js, React, Tailwind CSS</li>
                <li>• Agentic: MCP SDK, LLM pipelines</li>
                <li>• Data: PostgreSQL, Redis, Supabase</li>
              </ul>
            </div>
            <div
              className="border p-3"
              style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
            >
              <span style={{ color: "var(--phosphor-green)" }} className="block mb-2">
                // EMBEDDED_PHYSICAL
              </span>
              <ul
                className="space-y-1"
                style={{ color: "var(--text-muted)" }}
              >
                <li>• Signals: FFT, telemetry pipelines</li>
                <li>• Systems: Control loops, feedback design</li>
                <li>• Hardware: Power grid modeling, micro-controllers</li>
                <li>• Diagnostics: Noise filter algorithms</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
