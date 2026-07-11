/**
 * lib/content.ts
 *
 * The ONLY place in this codebase that reads markdown files or parses frontmatter.
 * Components NEVER import gray-matter or read the filesystem directly — they call
 * the typed helpers exported here (agent-guidelines.md, Non-Negotiable Rule #2).
 *
 * Behaviour:
 *   - Reads all *.md files from content/<type>/ at build time (Node.js `fs`)
 *   - Parses frontmatter with gray-matter
 *   - Validates against the matching Zod schema
 *   - THROWS a descriptive build error on invalid frontmatter — never silently skips
 *   - Returns typed arrays sorted by sensible defaults
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  projectSchema,
  toolSchema,
  updateSchema,
  type Project,
  type Tool,
  type Update,
} from "./schemas";

// ── Paths ─────────────────────────────────────────────────────────────────────

const CONTENT_ROOT = path.join(process.cwd(), "content");

// ── Generic loader ────────────────────────────────────────────────────────────

type ContentEntry<T> = {
  frontmatter: T;
  body: string;
  slug: string;
};

/**
 * Reads every `.md` file in `content/<dir>`, parses + validates it,
 * and returns typed entries. Throws at build time on any schema violation.
 */
function loadContentDir<T>(
  dir: string,
  validate: (raw: unknown, slug: string) => T,
): ContentEntry<T>[] {
  const dirPath = path.join(CONTENT_ROOT, dir);

  // Directory might not exist in fresh checkouts — return empty rather than crash
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(dirPath, filename);
    const raw = fs.readFileSync(filePath, "utf-8");

    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(raw);
    } catch (err) {
      throw new Error(
        `[content] Failed to parse frontmatter in ${filePath}:\n${String(err)}`,
      );
    }

    const frontmatter = validate(parsed.data, slug);
    return { frontmatter, body: parsed.content, slug };
  });
}

// ── Per-type validators (Zod — throws on invalid data) ────────────────────────

function validateProject(raw: unknown, slug: string): Project {
  const result = projectSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `[content] Invalid frontmatter in content/projects/${slug}.md:\n` +
        result.error.issues
          .map((i) => `  • ${i.path.join(".")} — ${i.message}`)
          .join("\n"),
    );
  }
  return result.data;
}

function validateTool(raw: unknown, slug: string): Tool {
  const result = toolSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `[content] Invalid frontmatter in content/tools/${slug}.md:\n` +
        result.error.issues
          .map((i) => `  • ${i.path.join(".")} — ${i.message}`)
          .join("\n"),
    );
  }
  return result.data;
}

function validateUpdate(raw: unknown, slug: string): Update {
  const result = updateSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `[content] Invalid frontmatter in content/updates/${slug}.md:\n` +
        result.error.issues
          .map((i) => `  • ${i.path.join(".")} — ${i.message}`)
          .join("\n"),
    );
  }
  return result.data;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns all projects sorted by startDate descending (newest first). */
export function getAllProjects(): ContentEntry<Project>[] {
  return loadContentDir("projects", validateProject).sort((a, b) => {
    const dateA = new Date(a.frontmatter.startDate).getTime();
    const dateB = new Date(b.frontmatter.startDate).getTime();
    return dateB - dateA;
  });
}

/** Returns a single project by its slug, or undefined if not found. */
export function getProjectBySlug(
  slug: string,
): ContentEntry<Project> | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

/** Returns all tools sorted alphabetically by title. */
export function getAllTools(): ContentEntry<Tool>[] {
  return loadContentDir("tools", validateTool).sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title),
  );
}

/** Returns a single tool by its slug, or undefined if not found. */
export function getToolBySlug(slug: string): ContentEntry<Tool> | undefined {
  return getAllTools().find((t) => t.slug === slug);
}

/** Returns all updates sorted by date descending (newest first). */
export function getAllUpdates(): ContentEntry<Update>[] {
  return loadContentDir("updates", validateUpdate).sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}
