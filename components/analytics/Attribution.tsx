"use client";

import { useEffect } from "react";

/**
 * First-touch attribution capture. On the visitor's first page load we record
 * UTM params, referrer and the landing path into a 90-day cookie. The /api/lead
 * route reads this cookie server-side when a form is submitted, so every lead
 * is tagged with where it came from — with no changes needed to the forms.
 *
 * First-touch: we never overwrite an existing cookie, so the *original* source
 * is preserved even if the visitor navigates around before converting.
 */
const COOKIE = "ms_attribution";

function deriveSource(utmSource: string, referrer: string): string {
  const s = utmSource.toLowerCase();
  if (s) return s;
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("instagram")) return "instagram";
    if (host.includes("youtube") || host.includes("youtu.be")) return "youtube";
    if (host.includes("google")) return "google";
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("facebook") || host.includes("fb.")) return "facebook";
    return host;
  } catch {
    return "referral";
  }
}

export function Attribution() {
  useEffect(() => {
    if (document.cookie.includes(`${COOKIE}=`)) return;

    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get("utm_source") ?? "",
      medium: params.get("utm_medium") ?? "",
      campaign: params.get("utm_campaign") ?? "",
      content: params.get("utm_content") ?? "",
      term: params.get("utm_term") ?? "",
    };
    const referrer = document.referrer || "";
    const payload = {
      source: deriveSource(utm.source, referrer),
      utm,
      referrer,
      landing: window.location.pathname,
    };

    const value = encodeURIComponent(JSON.stringify(payload));
    const maxAge = 60 * 60 * 24 * 90; // 90 days
    document.cookie = `${COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
  }, []);

  return null;
}
