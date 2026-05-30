import { Resend } from "resend";

/**
 * Sends a plain-text lead notification via Resend when configured. If
 * RESEND_API_KEY is absent (e.g. on a fresh preview deploy), it no-ops
 * gracefully so the form flow still succeeds — the lead is also logged.
 */
export async function sendLeadEmail(
  subject: string,
  lines: string[],
): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Mothership <onboarding@resend.dev>";
  const to = process.env.LEAD_NOTIFICATION_EMAIL ?? "brandon@bucksd.com";

  if (!apiKey) {
    console.info(`[lead] (email skipped — no RESEND_API_KEY)\n${subject}\n${lines.join("\n")}`);
    return { sent: false };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to, subject, text: lines.join("\n") });
    return { sent: true };
  } catch (error) {
    console.error("[lead] Resend send failed:", error);
    return { sent: false };
  }
}
