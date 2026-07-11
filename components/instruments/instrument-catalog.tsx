"use client";

/**
 * components/instruments/instrument-catalog.tsx
 *
 * The main wrapper catalog component for tools.
 * Groups tools by their category, sorting the categories alphabetically,
 * and sorting the individual tools alphabetically by title within each category.
 *
 * Designed with a structured equipment ledger aesthetic.
 */

import { useMemo } from "react";
import { CategoryGroup } from "./category-group";
import { InstrumentRow } from "./instrument-row";
import type { Tool } from "@/lib/schemas";

interface InstrumentCatalogProps {
  tools: Tool[];
}

export function InstrumentCatalog({ tools }: InstrumentCatalogProps) {
  /**
   * Group and sort tools.
   * Intentional sorting strategy:
   * 1. Categories are sorted alphabetically (e.g. Developer Tooling, MCP Infrastructure).
   * 2. Tools within each category are sorted alphabetically by title.
   * This logic is documented here to ensure consistent presentation across page mounts and rebuilds.
   */
  const groupedCategories = useMemo(() => {
    const groups: Record<string, Tool[]> = {};

    tools.forEach((tool) => {
      const cat = tool.category || "Unassigned";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(tool);
    });

    const sortedCatNames = Object.keys(groups).sort((a, b) =>
      a.localeCompare(b),
    );

    sortedCatNames.forEach((catName) => {
      groups[catName].sort((a, b) => a.title.localeCompare(b.title));
    });

    return sortedCatNames.map((catName) => ({
      name: catName,
      items: groups[catName],
    }));
  }, [tools]);

  return (
    <div className="w-full">
      {groupedCategories.map((group) => (
        <CategoryGroup
          key={group.name}
          category={group.name}
          count={group.items.length}
        >
          {group.items.map((tool) => (
            <InstrumentRow key={tool.slug} tool={tool} />
          ))}
        </CategoryGroup>
      ))}

      {groupedCategories.length === 0 && (
        <div
          className="border border-dashed p-8 text-center font-mono text-xs"
          style={{
            borderColor: "rgba(255, 180, 84, 0.15)",
            color: "var(--text-muted)",
          }}
        >
          [SYSTEM_LOG] NO INSTRUMENTS CURRENTLY REGISTERED IN CATALOG.
        </div>
      )}
    </div>
  );
}
