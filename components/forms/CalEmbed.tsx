"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Cal.com inline booking embed for the discovery call with Shaiden. Driven by
 * NEXT_PUBLIC_CAL_LINK; when it's not set (e.g. before the account is wired up)
 * we show a clean fallback instead of an empty embed.
 */
export function CalEmbed() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

  useEffect(() => {
    if (!calLink) return;
    void (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [calLink]);

  if (!calLink) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-ms-graphite/70 bg-ms-obsidian p-10 text-center">
        <span className="ms-caption text-ms-ion">Discovery call</span>
        <h3 className="mt-4 max-w-md font-display text-display-md leading-tight text-ms-bone">
          Booking with Shaiden opens here soon.
        </h3>
        <p className="mt-3 max-w-sm text-body text-ms-fog">
          In the meantime, email brandon@bucksd.com or DM @mothershipvehicles and
          we&apos;ll get you scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ms-graphite/70">
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", minHeight: "560px" }}
        config={{ layout: "month_view", theme: "dark" }}
      />
    </div>
  );
}
