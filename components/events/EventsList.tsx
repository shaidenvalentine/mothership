"use client";

import { useEffect, useMemo, useState } from "react";

import { events, type PublicEvent } from "@/content/events";
import { MONTHS_SHORT, todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";

/** "Jun 12–15, 2026" / "Oct 30 – Nov 2, 2026" / "Aug 8, 2026". */
function formatRange(start: string, end: string): string {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const sMon = MONTHS_SHORT[sm - 1];
  const eMon = MONTHS_SHORT[em - 1];
  if (start === end) return `${sMon} ${sd}, ${sy}`;
  if (sy === ey && sm === em) return `${sMon} ${sd}–${ed}, ${sy}`;
  if (sy === ey) return `${sMon} ${sd} – ${eMon} ${ed}, ${sy}`;
  return `${sMon} ${sd}, ${sy} – ${eMon} ${ed}, ${ey}`;
}

function EventRow({ event, past }: { event: PublicEvent; past?: boolean }) {
  const [sy, sm, sd] = event.start.split("-").map(Number);
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 border-t border-ms-graphite/60 py-10 md:grid-cols-[10rem_1fr_auto] md:gap-10",
        past && "opacity-50",
      )}
    >
      {/* Date block */}
      <div className="flex items-baseline gap-3 md:flex-col md:gap-1">
        <span className="font-mono text-display-md leading-none text-ms-bone">
          {String(sd).padStart(2, "0")}
        </span>
        <span className="ms-caption">
          {MONTHS_SHORT[sm - 1]} {sy}
        </span>
      </div>

      {/* Detail */}
      <div>
        <h3 className="font-display text-display-md leading-tight text-ms-bone">
          {event.name}
        </h3>
        <p className="mt-2 text-body text-ms-ion">
          {event.venue} · {event.city}
        </p>
        <p className="mt-3 max-w-xl text-body text-ms-fog">{event.blurb}</p>
        <p className="mt-3 font-mono text-body-sm text-ms-ash">
          {formatRange(event.start, event.end)}
        </p>
      </div>

      {/* Actions */}
      {!past ? (
        <div className="flex flex-col items-start gap-3 md:items-end">
          {event.url ? (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body-sm text-ms-bone transition-opacity hover:opacity-70"
            >
              Event info <span aria-hidden>&rarr;</span>
            </a>
          ) : null}
          {event.appointments ? (
            <a
              href="#book"
              className="inline-flex items-center gap-2 rounded-full border border-ms-graphite px-5 py-2 text-body-sm text-ms-bone transition-colors hover:bg-ms-obsidian"
            >
              Book a viewing
            </a>
          ) : null}
        </div>
      ) : (
        <div className="md:text-right">
          <span className="font-mono text-body-sm text-ms-ash">Past</span>
        </div>
      )}
    </div>
  );
}

export function EventsList() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayISO()), []);

  const { upcoming, past } = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
    if (!today) return { upcoming: sorted, past: [] as PublicEvent[] };
    return {
      upcoming: sorted.filter((e) => e.end >= today),
      past: sorted.filter((e) => e.end < today).reverse(),
    };
  }, [today]);

  return (
    <div>
      {upcoming.length > 0 ? (
        <div className="border-b border-ms-graphite/60">
          {upcoming.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <div className="border-y border-ms-graphite/60 py-16 text-center">
          <p className="text-body-lg text-ms-fog">
            No public dates on the calendar right now — book a private viewing
            below and we&rsquo;ll find a time.
          </p>
        </div>
      )}

      {past.length > 0 ? (
        <div className="mt-16">
          <span className="ms-caption text-ms-ash">Past appearances</span>
          <div className="mt-4 border-b border-ms-graphite/60">
            {past.map((e) => (
              <EventRow key={e.id} event={e} past />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
