/**
 * lib/schemas.ts
 *
 * Zod schemas for all content types.
 * This is the single source of truth for what's valid frontmatter.
 * Every field here is a contract — don't add fields to .md files
 * without updating the schema first.
 *
 * Lifecycle vocabulary is CLOSED: exactly five stages per 00-overview.md.
 * Adding a sixth is a Non-Negotiable Rule violation (agent-guidelines.md).
 */

import { z } from "zod";

// ── Shared ────────────────────────────────────────────────────────────────────

export const lifecycleStage = z.enum([
  "in-drift",  // Idea only, nothing built yet
  "nebula",    // Concept defined, not started
  "forming",   // Actively in development
  "active",    // Shipped / live
  "remnant",   // Archived / superseded
]);

export type LifecycleStage = z.infer<typeof lifecycleStage>;

// ── Project ───────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  title:          z.string(),
  slug:           z.string(),
  catalogNumber:  z.string(),            // e.g. "SOL-004" — manually assigned
  lifecycleStage: lifecycleStage,
  summary:        z.string().max(200),   // One-line description for orbit hover + list views
  techStack:      z.array(z.string()),
  links: z
    .object({
      repo: z.string().url().optional(),
      live: z.string().url().optional(),
      demo: z.string().url().optional(),
    })
    .optional(),
  startDate:      z.string(),            // ISO date e.g. "2026-06-01"
  featured:       z.boolean().default(false),
  tags:           z.array(z.string()).default([]),
  // Optional rendering hints — used by Phase 4 orbit engine
  scale:          z.number().optional(), // Manual size multiplier; defaults to 1 in renderer
  supersedes:     z.string().optional(), // Slug of an older project this replaces
});

export type Project = z.infer<typeof projectSchema>;

// ── Tool ──────────────────────────────────────────────────────────────────────

export const toolSchema = z.object({
  title:          z.string(),
  slug:           z.string(),
  category:       z.string(),            // e.g. "MCP Infrastructure", "Testing"
  lifecycleStage: lifecycleStage,
  summary:        z.string().max(200),
  techStack:      z.array(z.string()),
  links: z
    .object({
      repo: z.string().url().optional(),
      live: z.string().url().optional(),
    })
    .optional(),
  tags:           z.array(z.string()).default([]),
});

export type Tool = z.infer<typeof toolSchema>;

// ── Update ────────────────────────────────────────────────────────────────────

export const updateSchema = z.object({
  title:          z.string(),
  date:           z.string(),            // ISO date
  relatedProject: z.string().optional(), // slug reference to a project
  tags:           z.array(z.string()).default([]),
});

export type Update = z.infer<typeof updateSchema>;
