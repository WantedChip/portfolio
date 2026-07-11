/**
 * app/tools/page.tsx — Tools Index: Instrument Ledger
 *
 * Phase 5. Loads all tool entries using the content loader at build time,
 * parses and sorts them, and renders them in the InstrumentCatalog.
 */

import type { Metadata } from "next";
import { getAllTools } from "@/lib/content";
import { InstrumentCatalog } from "@/components/instruments/instrument-catalog";

export const metadata: Metadata = {
  title: "Instruments",
  description:
    "System instruments and tools catalog — a ledger of custom modules, utilities, and MCP servers.",
};

export default function ToolsPage() {
  const entries = getAllTools();
  const tools = entries.map((e) => e.frontmatter);

  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-4xl mx-auto"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Console telemetry header */}
      <header 
        className="mb-8 border-b pb-6"
        style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
      >
        <span
          className="font-mono text-xs tracking-widest uppercase mb-1 block"
          style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
        >
          Catalog Index // SYS_IND_05
        </span>
        <h1 className="font-display text-3xl md:text-4xl leading-tight">
          Instrument Ledger
        </h1>
        <p 
          className="font-mono text-xs mt-2 uppercase"
          style={{ color: "var(--text-muted)", opacity: 0.8 }}
        >
          SYSTEM COMPONENT MANIFEST AND CAPABILITY MATRIX
        </p>
      </header>

      {/* Main ledger catalog list */}
      <main>
        <InstrumentCatalog tools={tools} />
      </main>
    </div>
  );
}
