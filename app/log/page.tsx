/**
 * app/log/page.tsx — Log Page: Pulsar Log
 *
 * Phase 7A. Pre-renders updates log timeline.
 * Converts markdown body descriptions to HTML server-side,
 * resolves related project reference details, and renders
 * individual client-side PulseEntry nodes.
 */

import type { Metadata } from "next";
import { getAllUpdates, getProjectBySlug } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { PulseEntry } from "@/components/log/pulse-entry";

export const metadata: Metadata = {
  title: "Pulsar Log",
  description:
    "Operational updates, logs, and system milestones — timed like a pulsar.",
};

export default async function LogPage() {
  const entries = getAllUpdates();

  // Convert markdown bodies to HTML on the server to pass to client row components
  const updatesWithHtml = await Promise.all(
    entries.map(async (entry) => {
      const htmlBody = await markdownToHtml(entry.body);
      const project = entry.frontmatter.relatedProject
        ? getProjectBySlug(entry.frontmatter.relatedProject)
        : undefined;

      return {
        update: entry.frontmatter,
        htmlBody,
        relatedProjectTitle: project?.frontmatter.title,
      };
    })
  );

  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-2xl mx-auto"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Console telemetry header */}
      <header
        className="mb-10 border-b pb-6 font-mono text-xs"
        style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
      >
        <span style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}>
          SYS_LOG // PULSAR_PERIODICS
        </span>
        <h1
          className="font-display text-3xl md:text-4xl leading-tight mt-2"
          style={{ color: "var(--text-primary)" }}
        >
          Pulsar Log
        </h1>
        <p
          className="mt-1 uppercase"
          style={{ color: "var(--text-muted)", opacity: 0.8 }}
        >
          PERIODIC WORKSPACE MILESTONES AND SYSTEM ACTIVITY FEEDS
        </p>
      </header>

      {/* Timeline entries list */}
      <main className="relative pl-1">
        {updatesWithHtml.length === 0 ? (
          <div
            className="font-mono text-xs italic border border-dashed p-6 text-center"
            style={{
              borderColor: "rgba(136, 144, 166, 0.15)",
              color: "var(--text-muted)",
            }}
          >
            [SYSTEM_LOG] NO SYSTEM ACTIVITY LOGGED YET.
          </div>
        ) : (
          updatesWithHtml.map((item, idx) => (
            <PulseEntry
              key={idx}
              update={item.update}
              htmlBody={item.htmlBody}
              relatedProjectTitle={item.relatedProjectTitle}
            />
          ))
        )}
      </main>
    </div>
  );
}
