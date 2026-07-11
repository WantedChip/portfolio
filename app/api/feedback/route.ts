import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * app/api/feedback/route.ts — Transactional feedback API route handler
 *
 * Phase 7C. Ground Report Submission.
 * Actions:
 *   - Receives JSON payload (name, email, category, message, difficulty, botField)
 *   - Honeypot check: returns successful response quietly if botField is filled
 *   - Checks environment config for RESEND_API_KEY
 *     - If missing: prints payload to stdout (console) and returns success (dev environment friendly)
 *     - If present: initializes Resend and sends transactional email to operator's inbox
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, message, difficultyRating, botField } = body;

    // ── Honeypot Spam Mitigation ──
    if (botField && botField.trim() !== "") {
      console.warn("[spam_mitigation] Honeypot field populated. Quietly discarding.");
      // Return 200 OK to simulate success
      return NextResponse.json({ success: true, telemetry: "discarded" });
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message narrative is required." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    // ── Safe Local Fallback ──
    // If no Resend API key is configured, log data to server console and report success.
    // This allows build/deploy pipeline checks and local QA to execute without API key blocks.
    if (!resendApiKey) {
      console.log("\n========================================");
      console.log("[SYS_LOG_FEEDBACK] NEW GROUND REPORT RECEIVED (FALLBACK):");
      console.log(`- Operator:       ${name || "Anonymous"}`);
      console.log(`- Coordinate/Email: ${email || "None"}`);
      console.log(`- Category:       ${category.toUpperCase()}`);
      if (category === "game" && difficultyRating) {
        console.log(`- Game Difficulty: ${difficultyRating} / 5`);
      }
      console.log(`- Narrative:\n${message}`);
      console.log("========================================\n");

      return NextResponse.json({ success: true, fallback: true });
    }

    // ── Resend Email Integration ──
    const resend = new Resend(resendApiKey);

    const emailSubject = `[Cosmos Registry] Ground Report: ${category.toUpperCase()}`;
    const emailHtml = `
      <h2>System Ground Report Registry</h2>
      <p><strong>Operator Name:</strong> ${name || "Anonymous"}</p>
      <p><strong>Return Coordinate/Email:</strong> ${email || "None"}</p>
      <p><strong>Classification:</strong> ${category}</p>
      ${
        category === "game" && difficultyRating
          ? `<p><strong>Game Difficulty Rating:</strong> ${difficultyRating} / 5</p>`
          : ""
      }
      <hr />
      <h3>Narrative:</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    `;

    // Transmit email via Resend onboarding address
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "soham@example.com", // Owner destination coordinates
      replyTo: email || undefined,
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/feedback] Route handler exception occurred:", error);
    return NextResponse.json(
      { error: "Internal transmission error occurred." },
      { status: 500 }
    );
  }
}
