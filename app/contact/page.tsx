"use client";

/**
 * app/contact/page.tsx — Contact & Ground Report Feedback Form
 *
 * Phase 7B & 7C. Uplink links & interactive feedback form.
 * Contains direct link telemetry channels (Email, GitHub, LinkedIn, X)
 * and the Ground Report form with:
 *   - Category selection (General, Game Difficulty, UX, Bug)
 *   - Dynamic conditional render for Game Difficulty rating (1–5) if selected
 *   - Honeypot spam mitigation
 *   - Custom success confirmation screen ("Report received")
 */

import { useState } from "react";

type Category = "general" | "game" | "ux" | "bug";

export default function ContactPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [message, setMessage] = useState("");
  const [difficultyRating, setDifficultyRating] = useState("3");
  const [botField, setBotField] = useState(""); // Honeypot field

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          category,
          message,
          difficultyRating: category === "game" ? parseInt(difficultyRating) : undefined,
          botField, // Honeypot payload
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Uplink transmission failed.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage("Uplink channel connection lost.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-dvh px-6 pt-24 pb-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10"
      style={{ color: "var(--text-primary)" }}
    >
      {/* ── Left Column: Direct Uplinks ── */}
      <div>
        <header
          className="mb-8 border-b pb-6 font-mono text-xs"
          style={{ borderColor: "rgba(136, 144, 166, 0.15)" }}
        >
          <span style={{ color: "var(--phosphor-amber)", opacity: 0.7 }}>
            COMM_LINK // SYS_PORT_09
          </span>
          <h1
            className="font-display text-3xl md:text-4xl leading-tight mt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Establish Uplink
          </h1>
          <p className="mt-1 text-text-muted" style={{ opacity: 0.8 }}>
            DIRECT TELEMETRY CONNECTIONS TO THE OPERATOR.
          </p>
        </header>

        <div className="space-y-6 font-mono text-xs text-text-muted">
          <div className="border p-4" style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}>
            <span style={{ color: "var(--phosphor-amber)" }} className="block mb-2">
              // EMAIL_UPLINK
            </span>
            <a
              href="mailto:soham@example.com"
              className="hover:opacity-85 font-semibold text-text-primary text-sm break-all"
            >
              soham@example.com
            </a>
          </div>

          <div className="border p-4" style={{ borderColor: "rgba(136, 144, 166, 0.12)" }}>
            <span style={{ color: "var(--phosphor-amber)" }} className="block mb-2">
              // REGISTRY_PLATFORMS
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/WantedChip"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--phosphor-green)" }}
                  className="hover:opacity-85 block"
                >
                  → GITHUB: WantedChip
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/soham-ee"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-primary)" }}
                  className="hover:opacity-85 block"
                >
                  → LINKEDIN: soham-ee
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/soham-ee"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--text-primary)" }}
                  className="hover:opacity-85 block"
                >
                  → X_PLATFORM: @soham-ee
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right Column: Ground Report Form ── */}
      <div>
        <div
          className="border p-6"
          style={{
            borderColor: "rgba(255, 180, 84, 0.15)",
            backgroundColor: "rgba(11, 18, 38, 0.2)",
          }}
        >
          <h2
            className="font-mono text-xs tracking-widest uppercase mb-4 border-b pb-2"
            style={{
              color: "var(--text-primary)",
              borderColor: "rgba(136, 144, 166, 0.12)",
            }}
          >
            Ground Report Registry
          </h2>

          {submitStatus === "success" ? (
            /* Themed confirmation state screen */
            <div className="font-mono text-xs py-10 text-center space-y-4">
              <span
                style={{ color: "var(--phosphor-green)" }}
                className="text-2xl block"
              >
                ✓ UPLINK_SUCCESS
              </span>
              <p style={{ color: "var(--text-primary)" }}>
                REPORT RECEIVED. DATA RECORDED IN SYSTEM SHIELD LOGS.
              </p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="px-3 py-1.5 border hover:bg-amber/5"
                style={{
                  borderColor: "rgba(255, 180, 84, 0.3)",
                  color: "var(--phosphor-amber)",
                }}
              >
                TRANSMIT NEW REPORT
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (hidden from users, but filled by spam bots) */}
              <div
                className="opacity-0 absolute w-0 h-0 pointer-events-none -z-50"
                aria-hidden="true"
              >
                <label htmlFor="botField">Leave this empty</label>
                <input
                  id="botField"
                  type="text"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name (Optional) */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="font-mono text-[10px] uppercase text-text-muted"
                >
                  Operator Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="bg-void border p-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                  style={{
                    borderColor: "rgba(136, 144, 166, 0.25)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Email (Optional) */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="font-mono text-[10px] uppercase text-text-muted"
                >
                  Return Coordinates [Email] (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="bg-void border p-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                  style={{
                    borderColor: "rgba(136, 144, 166, 0.25)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="category"
                  className="font-mono text-[10px] uppercase text-text-muted"
                >
                  Report Classification
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="bg-void border p-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                  style={{
                    borderColor: "rgba(136, 144, 166, 0.25)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="general">GENERAL COMMENTS</option>
                  <option value="game">GAME DIFFICULTY</option>
                  <option value="ux">USER EXPERIENCE</option>
                  <option value="bug">BUG REPORT</option>
                </select>
              </div>

              {/* Difficulty Rating (Conditional) */}
              {category === "game" && (
                <div className="flex flex-col gap-1 border-l-2 pl-3 py-1 animate-pulse" style={{ borderColor: "var(--phosphor-amber)" }}>
                  <label
                    htmlFor="difficulty"
                    className="font-mono text-[10px] uppercase text-text-muted"
                  >
                    Asteroids Vector Difficulty [1 - 5]
                  </label>
                  <select
                    id="difficulty"
                    value={difficultyRating}
                    onChange={(e) => setDifficultyRating(e.target.value)}
                    className="bg-void border p-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                    style={{
                      borderColor: "rgba(136, 144, 166, 0.25)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="1">1 - DRIFT (VERY EASY)</option>
                    <option value="2">2 - ACCRETION (EASY)</option>
                    <option value="3">3 - ACCELERATION (STANDARD)</option>
                    <option value="4">4 - GRAVITY WELL (HARD)</option>
                    <option value="5">5 - EVENT HORIZON (EXTREME)</option>
                  </select>
                </div>
              )}

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="message"
                  className="font-mono text-[10px] uppercase text-text-muted"
                >
                  Telemetry Narrative [Message]
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message details..."
                  required
                  rows={4}
                  className="bg-void border p-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber"
                  style={{
                    borderColor: "rgba(136, 144, 166, 0.25)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-mono text-xs py-2 border uppercase text-center focus:outline-none focus-visible:ring-1"
                style={
                  {
                    borderColor: "var(--phosphor-amber)",
                    color: "var(--phosphor-amber)",
                    backgroundColor: "transparent",
                    "--tw-ring-color": "var(--phosphor-amber)",
                  } as React.CSSProperties
                }
              >
                {isSubmitting ? "TRANSMITTING..." : "TRANSMIT REPORT"}
              </button>

              {/* Error messages */}
              {submitStatus === "error" && (
                <div
                  className="font-mono text-[10px] uppercase text-center mt-2"
                  style={{ color: "var(--signal-red)" }}
                >
                  Error: {errorMessage}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
