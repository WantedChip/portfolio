/**
 * lib/markdown.ts
 *
 * Server-side markdown → HTML converter.
 * Used only in Server Components (never client-side).
 *
 * remark v15 is ESM-only. This works in Next.js App Router
 * Server Components which execute in an ESM context.
 */

import { remark } from "remark";
import remarkHtml from "remark-html";

/**
 * Converts a markdown string to safe HTML.
 * Returns an empty string for empty/undefined input.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown || !markdown.trim()) return "";

  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return result.toString();
}
