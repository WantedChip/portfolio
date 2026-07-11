/**
 * app/page.tsx — Temporary placeholder for Phase 1 font / token verification.
 *
 * This page exists solely to verify that fonts, design tokens, and the
 * content pipeline are wired correctly. It will be replaced completely
 * in Phase 3 (Homepage / Galaxy Map).
 *
 * DO NOT start building visual content here — Phase 1 is infrastructure only.
 */
import { getAllProjects, getAllTools, getAllUpdates } from "@/lib/content";

export default function Home() {
  // These calls run at build time — any invalid content/.md frontmatter
  // will throw a Zod error here and abort the build with a clear message.
  const projects = getAllProjects();
  const tools = getAllTools();
  const updates = getAllUpdates();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 bg-void text-text-primary">
      {/* Fraunces — display/heading font */}
      <h1 className="font-display text-4xl text-amber">
        Portfolio — Under Construction
      </h1>

      {/* Inter — body font */}
      <p className="font-sans text-base text-text-muted max-w-prose text-center">
        Phase 1 infrastructure in progress. Design tokens and content pipeline
        are being wired. This placeholder verifies all three fonts load
        correctly and color tokens resolve properly.
      </p>

      {/* JetBrains Mono — console/telemetry font */}
      <code className="font-mono text-sm text-green px-4 py-2 bg-navy rounded">
        {`// projects: ${projects.length} | tools: ${tools.length} | updates: ${updates.length}`}
      </code>
    </main>
  );
}
