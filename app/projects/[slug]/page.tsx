/**
 * app/projects/[slug]/page.tsx — Project Detail Page
 *
 * Phase 4. Shows full detail for a single project:
 *   - Catalog number + lifecycle badge
 *   - Title (Fraunces display font)
 *   - Summary
 *   - Full markdown body
 *   - Tech stack list
 *   - Links (repo, live, demo)
 *
 * Uses generateStaticParams so all project slugs are pre-rendered at build time.
 * An In-Drift project with minimal content shows a graceful "status only" page.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { LifecycleBadge } from "@/components/solar-system/lifecycle-badge";

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllProjects().map((entry) => ({ slug: entry.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getProjectBySlug(slug);
  if (!entry) return { title: "Project not found" };
  return {
    title: entry.frontmatter.title,
    description: entry.frontmatter.summary,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getProjectBySlug(slug);
  if (!entry) notFound();

  const { frontmatter: project, body } = entry;
  const htmlBody = await markdownToHtml(body);

  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-3xl mx-auto"
      style={{ color: "var(--text-primary)" }}
    >
      {/* ── Back link ── */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase mb-10"
        style={{ color: "var(--text-muted)" }}
      >
        <span aria-hidden="true">←</span>
        Solar System
      </Link>

      {/* ── Header ── */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: "var(--text-muted)", opacity: 0.7 }}
          >
            {project.catalogNumber}
          </span>
          <LifecycleBadge stage={project.lifecycleStage} />
        </div>

        <h1
          className="font-display text-4xl md:text-5xl leading-tight mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h1>

        <p
          className="font-sans text-base leading-relaxed max-w-prose"
          style={{ color: "var(--text-muted)" }}
        >
          {project.summary}
        </p>
      </header>

      {/* ── Status message for minimal-content stages ── */}
      {(project.lifecycleStage === "in-drift" ||
        project.lifecycleStage === "nebula") &&
        !htmlBody && (
          <div
            className="border-l-2 pl-4 py-2 mb-8 font-mono text-sm"
            style={{
              borderColor: "var(--text-muted)",
              color: "var(--text-muted)",
              opacity: 0.6,
            }}
          >
            {project.lifecycleStage === "in-drift"
              ? "Status: In Drift — idea only. No implementation has started."
              : "Status: Nebula — concept defined. No implementation has started."}
          </div>
        )}

      {/* ── Markdown body ── */}
      {htmlBody && (
        <div
          className="prose-section mb-10"
          dangerouslySetInnerHTML={{ __html: htmlBody }}
          style={{
            fontFamily: "var(--font-body)",
            lineHeight: "1.75",
            color: "var(--text-muted)",
          }}
        />
      )}

      {/* ── Tech stack ── */}
      {project.techStack.length > 0 && (
        <section className="mb-8">
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
          >
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-2 py-1 border"
                style={{
                  borderColor: "rgba(136, 144, 166, 0.3)",
                  color: "var(--text-muted)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Links ── */}
      {project.links && (
        <section className="mb-8">
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}
          >
            Links
          </h2>
          <div className="flex flex-wrap gap-4">
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm"
                style={{ color: "var(--phosphor-amber)" }}
              >
                → Repository
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm"
                style={{ color: "var(--phosphor-green)" }}
              >
                → Live
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm"
                style={{ color: "var(--phosphor-green)" }}
              >
                → Demo
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── Tags ── */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "rgba(136,144,166,0.15)" }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs"
              style={{ color: "var(--text-muted)", opacity: 0.5 }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
