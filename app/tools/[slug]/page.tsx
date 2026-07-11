/**
 * app/tools/[slug]/page.tsx — Tool Detail Page
 *
 * Phase 5. Displays dynamic tools detail specification sheets using pre-rendered paths.
 * Renders detail parameters:
 *   - Back link to Catalog Ledger
 *   - Telemetry Metadata block (spec-sheet visual styling)
 *   - Inline LifecycleBadge
 *   - Rich text parsed markdown body
 *   - Access links
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTools, getToolBySlug } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { LifecycleBadge } from "@/components/solar-system/lifecycle-badge";

// ── Pre-rendered paths ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllTools().map((entry) => ({ slug: entry.slug }));
}

// ── Metadata generation ───────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getToolBySlug(slug);
  if (!entry) return { title: "Instrument not found" };
  return {
    title: `${entry.frontmatter.title} // Specification`,
    description: entry.frontmatter.summary,
  };
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getToolBySlug(slug);
  if (!entry) notFound();

  const { frontmatter: tool, body } = entry;
  const htmlBody = await markdownToHtml(body);

  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-3xl mx-auto"
      style={{ color: "var(--text-primary)" }}
    >
      {/* Catalog navigation uplink */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase mb-10 hover:opacity-85"
        style={{ color: "var(--text-muted)" }}
      >
        <span aria-hidden="true">←</span>
        Instrument Ledger
      </Link>

      {/* Header identification */}
      <header className="mb-6">
        <h1
          className="font-display text-3xl md:text-4xl leading-tight mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {tool.title}
        </h1>
        <p
          className="font-sans text-sm leading-relaxed max-w-prose"
          style={{ color: "var(--text-muted)" }}
        >
          {tool.summary}
        </p>
      </header>

      {/* Specification ledger block */}
      <section
        className="border p-4 mb-8 font-mono text-xs"
        style={{
          borderColor: "rgba(136, 144, 166, 0.15)",
          backgroundColor: "rgba(11, 18, 38, 0.2)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
          <div className="flex justify-between border-b pb-1.5 md:border-b-0 md:pb-0" style={{ borderColor: "rgba(136,144,166,0.08)" }}>
            <span style={{ color: "var(--text-muted)" }}>[SPEC_ID]</span>
            <span className="uppercase" style={{ color: "var(--phosphor-amber)" }}>
              {tool.slug.slice(0, 8)}
            </span>
          </div>
          <div className="flex justify-between border-b pb-1.5 md:border-b-0 md:pb-0" style={{ borderColor: "rgba(136,144,166,0.08)" }}>
            <span style={{ color: "var(--text-muted)" }}>[SECTOR]</span>
            <span className="uppercase">{tool.category}</span>
          </div>
          <div className="flex justify-between border-b pb-1.5 md:border-b-0 md:pb-0" style={{ borderColor: "rgba(136,144,166,0.08)" }}>
            <span style={{ color: "var(--text-muted)" }}>[STATUS]</span>
            <LifecycleBadge stage={tool.lifecycleStage} />
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--text-muted)" }}>[MATRIX]</span>
            <span>OK // STATIC_SPEC</span>
          </div>
        </div>
      </section>

      {/* Graceful empty content states */}
      {(tool.lifecycleStage === "in-drift" || tool.lifecycleStage === "nebula") &&
        !htmlBody && (
          <div
            className="border-l pl-4 py-2 mb-8 font-mono text-xs italic"
            style={{
              borderColor: "var(--text-muted)",
              color: "var(--text-muted)",
              opacity: 0.7,
            }}
          >
            {tool.lifecycleStage === "in-drift"
              ? "Status: In Drift — conceptual phase only. Telemetry unregistered."
              : "Status: Nebula — system defined. Core telemetry channel currently offline."}
          </div>
        )}

      {/* Detailed specs text */}
      {htmlBody && (
        <article
          className="prose-section mb-8"
          dangerouslySetInnerHTML={{ __html: htmlBody }}
          style={{
            fontFamily: "var(--font-body)",
            lineHeight: "1.7",
            color: "var(--text-muted)",
          }}
        />
      )}

      {/* Component technologies specifications */}
      {tool.techStack.length > 0 && (
        <section className="mb-6 border-t pt-6" style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}>
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
          >
            Component Registry
          </h2>
          <div className="flex flex-wrap gap-2">
            {tool.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] px-2 py-0.5 border"
                style={{
                  borderColor: "rgba(136, 144, 166, 0.15)",
                  color: "var(--text-muted)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Interface hyperlinks */}
      {tool.links && (tool.links.repo || tool.links.live) && (
        <section className="mb-6 border-t pt-6" style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}>
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
          >
            Uplink Channels
          </h2>
          <div className="flex flex-wrap gap-4">
            {tool.links.repo && (
              <a
                href={tool.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase"
                style={{ color: "var(--phosphor-amber)" }}
              >
                → [REPOSITORY_LINK]
              </a>
            )}
            {tool.links.live && (
              <a
                href={tool.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase"
                style={{ color: "var(--phosphor-green)" }}
              >
                → [LIVE_INTERFACE]
              </a>
            )}
          </div>
        </section>
      )}

      {/* Hash classifications */}
      {tool.tags.length > 0 && (
        <div
          className="flex flex-wrap gap-x-3 gap-y-1.5 pt-4 border-t"
          style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}
        >
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px]"
              style={{ color: "var(--text-muted)", opacity: 0.6 }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
