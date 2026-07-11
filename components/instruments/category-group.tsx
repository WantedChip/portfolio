/**
 * components/instruments/category-group.tsx
 *
 * Visual group for the instruments catalog.
 * Styled like an equipment ledger section or instrument panel block.
 * Displays the category name, sector telemetry, and count of active instruments.
 *
 * Supports zero, one, or many items gracefully without layout breaking.
 */

import React from "react";

interface CategoryGroupProps {
  category: string;
  count: number;
  children: React.ReactNode;
}

export function CategoryGroup({ category, count, children }: CategoryGroupProps) {
  return (
    <section 
      className="mb-8 w-full border border-dashed p-4 md:p-6"
      style={{
        backgroundColor: "rgba(11, 18, 38, 0.4)",
        borderColor: "rgba(255, 180, 84, 0.12)",
      }}
      aria-label={`Category: ${category}`}
    >
      {/* Section telemetry header */}
      <div 
        className="mb-4 flex items-center justify-between border-b pb-2 font-mono text-xs"
        style={{ borderColor: "rgba(255, 180, 84, 0.2)" }}
      >
        <div className="flex items-center gap-2">
          {/* Decorative console symbol */}
          <span style={{ color: "var(--phosphor-amber)" }} aria-hidden="true">
            [SYS_CAT]
          </span>
          <h2 
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--text-primary)" }}
          >
            {category}
          </h2>
        </div>
        <span style={{ color: "var(--text-muted)", opacity: 0.8 }}>
          TOTAL_INST: {count.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Rows list wrapper */}
      <div className="flex flex-col gap-2">
        {count === 0 ? (
          <div 
            className="py-4 font-mono text-xs italic"
            style={{ color: "var(--text-muted)" }}
          >
            NO ACTIVE INSTRUMENTS IN THIS SECTOR
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
