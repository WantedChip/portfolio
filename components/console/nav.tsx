"use client";

/**
 * components/console/nav.tsx
 *
 * Console-style deployable navigation panel — not a conventional horizontal navbar.
 * A terminal/command-palette inspired side panel that slides in from the right.
 *
 * Items: Home, Projects, Tools, About, Resume, Log, Contact, Manual.
 * Game is intentionally NOT listed (per phase-2 spec — it's a hidden route, Phase 8).
 *
 * Keyboard accessibility:
 *   - Toggle button accessible with Enter/Space
 *   - Open panel traps focus within it
 *   - Escape closes the panel
 *   - All links tab-navigable in order
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSound } from "@/lib/audio";

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home",     href: "/",        code: "~" },
  { label: "Projects", href: "/projects", code: "01" },
  { label: "Tools",    href: "/tools",    code: "02" },
  { label: "About",    href: "/about",    code: "03" },
  { label: "Resume",   href: "/resume",   code: "04" },
  { label: "Log",      href: "/log",      code: "05" },
  { label: "Contact",  href: "/contact",  code: "06" },
  { label: "Manual",   href: "/manual",   code: "07" },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { play: playBlip } = useSound("/audio/blip.mp3");

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape; trap focus when open
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  // Close when route changes
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Focus first nav link when panel opens
  useEffect(() => {
    if (open) {
      const first = panelRef.current?.querySelector<HTMLElement>("a");
      setTimeout(() => first?.focus(), 60);
    }
  }, [open]);

  return (
    <>
      {/* ── Toggle button (hamburger / close) ─────────────────────────────── */}
      <button
        ref={toggleRef}
        id="nav-toggle"
        onClick={() => {
          playBlip();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-controls="nav-panel"
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="fixed right-6 top-6 z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={
          {
            "--tw-ring-color": "var(--phosphor-amber)",
            "--tw-ring-offset-color": "var(--void-black)",
          } as React.CSSProperties
        }
      >
        {/* Three-bar → X morphing lines */}
        <span
          className="block h-px w-6 origin-center transition-transform duration-200"
          style={{
            backgroundColor: "var(--text-primary)",
            transform: open ? "translateY(4px) rotate(45deg)" : "none",
          }}
        />
        <span
          className="block h-px w-6 transition-opacity duration-200"
          style={{
            backgroundColor: "var(--text-primary)",
            opacity: open ? 0 : 1,
          }}
        />
        <span
          className="block h-px w-6 origin-center transition-transform duration-200"
          style={{
            backgroundColor: "var(--text-primary)",
            transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
          }}
        />
      </button>

      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(5, 6, 10, 0.6)" }}
          onClick={() => {
            playBlip();
            close();
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Nav panel ─────────────────────────────────────────────────────── */}
      <div
        id="nav-panel"
        ref={panelRef}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!open}
        className="fixed right-0 top-0 z-40 flex h-full w-72 flex-col overflow-y-auto border-l pt-20 pb-8 transition-transform duration-200"
        style={{
          backgroundColor: "var(--deep-navy)",
          borderColor: "rgba(255, 180, 84, 0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          // Ensure panel isn't reachable by keyboard when closed
          visibility: open ? "visible" : "hidden",
        }}
      >
        {/* Console header */}
        <div className="px-8 pb-6 border-b" style={{ borderColor: "rgba(255, 180, 84, 0.1)" }}>
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--phosphor-amber)" }}
          >
            Navigation
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-4 pt-4 gap-1">
          {NAV_ITEMS.map(({ label, href, code }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                tabIndex={open ? 0 : -1}
                className="group flex items-center gap-4 px-4 py-3 transition-colors duration-150 focus:outline-none focus-visible:ring-1"
                style={
                  {
                    backgroundColor: isActive
                      ? "rgba(255, 180, 84, 0.08)"
                      : "transparent",
                    "--tw-ring-color": "var(--phosphor-amber)",
                  } as React.CSSProperties
                }
                onClick={playBlip}
                onMouseEnter={(e) => {
                  playBlip();
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      "rgba(255, 180, 84, 0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      "transparent";
                }}
              >
                {/* Index code */}
                <span
                  className="w-6 shrink-0 font-mono text-xs"
                  style={{
                    color: isActive
                      ? "var(--phosphor-amber)"
                      : "var(--text-muted)",
                  }}
                >
                  {code}
                </span>

                {/* Label */}
                <span
                  className="font-sans text-sm tracking-wide"
                  style={{
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span
                    className="ml-auto h-1 w-1 rounded-full"
                    style={{ backgroundColor: "var(--phosphor-amber)" }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="mt-auto px-8 pt-6 border-t"
          style={{ borderColor: "rgba(255, 180, 84, 0.1)" }}
        >
          <p
            className="font-mono text-xs"
            style={{ color: "var(--text-muted)", opacity: 0.5 }}
          >
            Esc to close
          </p>
        </div>
      </div>
    </>
  );
}
