"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Read-only-ish availability view for the demo van. Driven by
 * NEXT_PUBLIC_CREATOR_CAL_LINK (typically a Cal.com event where Shaiden marks
 * the van busy on dates it's already booked or being maintained). When the env
 * isn't set yet, we show a clean placeholder rather than fake availability.
 */
export function CreatorCalendar() {
  const calLink = process.env.NEXT_PUBLIC_CREATOR_CAL_LINK;

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
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-ms-graphite/70 bg-ms-obsidian p-10 text-center">
        <span className="ms-caption text-ms-ion">Availability</span>
        <h3 className="mt-4 max-w-md font-display text-display-md leading-tight text-ms-bone">
          The live calendar lands here soon.
        </h3>
        <p className="mt-3 max-w-sm text-body text-ms-fog">
          For now, submit your dates in the application below and Shaiden will
          confirm whether the van&apos;s free.
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
