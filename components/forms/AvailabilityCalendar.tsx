"use client";

import { useEffect, useMemo, useState } from "react";

import {
  applicationWindow,
  blocks,
  type DayStatus,
} from "@/content/availability";
import {
  daysInMonth,
  eachDay,
  firstWeekday,
  iso,
  MONTHS,
  todayISO,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

export interface DateRange {
  /** Pickup day, YYYY-MM-DD. */
  start: string;
  /** Return day, YYYY-MM-DD. Null while mid-selection. */
  end: string | null;
}

interface AvailabilityCalendarProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

interface DayInfo {
  status: DayStatus;
  label?: string;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/** Which committed block (if any) covers a given day. */
function blockFor(date: string) {
  return blocks.find((b) => date >= b.start && date <= b.end);
}

function dayInfo(date: string, today: string): DayInfo {
  if (date < today) return { status: "past" };
  if (date < applicationWindow.start || date > applicationWindow.end) {
    return { status: "closed" };
  }
  const block = blockFor(date);
  if (block) return { status: block.status, label: block.label };
  return { status: "open" };
}

/** True only if every day in [start, end] is open. */
function rangeIsClear(start: string, end: string, today: string): boolean {
  for (const day of eachDay(start, end)) {
    if (dayInfo(day, today).status !== "open") return false;
  }
  return true;
}

/** List of {year, month} to render — every month the window touches, from today on. */
function monthsToRender(today: string): Array<{ year: number; month: number }> {
  const startKey = applicationWindow.start > today ? applicationWindow.start : today;
  const [sy, sm] = startKey.split("-").map(Number);
  const [ey, em] = applicationWindow.end.split("-").map(Number);
  const out: Array<{ year: number; month: number }> = [];
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    out.push({ year: y, month: m });
    if (m === 12) {
      m = 1;
      y += 1;
    } else {
      m += 1;
    }
  }
  return out;
}

export function AvailabilityCalendar({
  value,
  onChange,
}: AvailabilityCalendarProps) {
  // Compute "today" only after mount so the server-rendered markup (which has
  // no stable notion of the visitor's date) doesn't cause a hydration mismatch.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayISO()), []);
  const months = useMemo(
    () => (today ? monthsToRender(today) : []),
    [today],
  );

  if (!today) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-ms-graphite/40 bg-ms-obsidian/40">
        <span className="font-mono text-body-sm text-ms-ash">
          Loading availability…
        </span>
      </div>
    );
  }

  // `today` is guaranteed a string past the guard above; capture it so the
  // closures below narrow correctly.
  const currentToday: string = today;

  function handleDayClick(date: string) {
    const info = dayInfo(date, currentToday);
    if (info.status !== "open") return;

    // Fresh selection: nothing chosen yet, or a complete range already exists.
    if (!value || value.end) {
      onChange({ start: date, end: null });
      return;
    }

    // A start is set, choosing the second endpoint.
    if (date === value.start) {
      onChange(null); // tap the start again to clear
      return;
    }
    if (date < value.start) {
      onChange({ start: date, end: null }); // earlier day → restart there
      return;
    }
    // date > start: only accept if the whole span is clear.
    if (rangeIsClear(value.start, date, currentToday)) {
      onChange({ start: value.start, end: date });
    } else {
      onChange({ start: date, end: null }); // blocked in between → restart
    }
  }

  function isSelected(date: string) {
    if (!value) return false;
    if (!value.end) return date === value.start;
    return date >= value.start && date <= value.end;
  }

  function isEndpoint(date: string) {
    if (!value) return false;
    return date === value.start || date === value.end;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
        {months.map(({ year, month }) => {
          const total = daysInMonth(year, month);
          const lead = firstWeekday(year, month);
          const cells: Array<string | null> = [
            ...Array<null>(lead).fill(null),
            ...Array.from({ length: total }, (_, i) => iso(year, month, i + 1)),
          ];

          return (
            <div key={`${year}-${month}`}>
              <h4 className="font-display text-body-lg text-ms-bone">
                {MONTHS[month - 1]}{" "}
                <span className="text-ms-ash">{year}</span>
              </h4>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {WEEKDAYS.map((d, i) => (
                  <span
                    key={i}
                    className="pb-1 text-center font-mono text-[0.65rem] uppercase tracking-wider text-ms-ash"
                  >
                    {d}
                  </span>
                ))}
                {cells.map((date, i) => {
                  if (!date) return <span key={`b-${i}`} />;
                  const info = dayInfo(date, currentToday);
                  const selectable = info.status === "open";
                  const selected = isSelected(date);
                  const endpoint = isEndpoint(date);
                  const [, , dd] = date.split("-").map(Number);

                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={!selectable}
                      onClick={() => handleDayClick(date)}
                      title={info.label}
                      aria-label={`${date}${info.label ? ` — ${info.label}` : ""}`}
                      aria-pressed={selected}
                      className={cn(
                        "relative flex aspect-square items-center justify-center rounded-md text-body-sm transition-colors",
                        // base / open
                        selectable &&
                          "text-ms-bone hover:bg-ms-graphite/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-ms-ion",
                        // in-range (not endpoint)
                        selected && !endpoint && "bg-ms-ion/25 text-ms-bone",
                        // endpoints
                        endpoint && "bg-ms-ion text-ms-black font-medium hover:bg-ms-ion",
                        // booked
                        info.status === "booked" &&
                          "cursor-not-allowed bg-ms-danger/10 text-ms-danger/70 line-through",
                        // held / maintenance
                        info.status === "held" &&
                          "cursor-not-allowed bg-ms-warning/10 text-ms-warning/70 line-through",
                        // past / closed
                        (info.status === "past" || info.status === "closed") &&
                          "cursor-not-allowed text-ms-graphite",
                      )}
                    >
                      {dd}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ms-graphite/60 pt-6 font-mono text-body-sm text-ms-fog">
        <LegendDot className="bg-ms-ion" label="Selected" />
        <LegendDot className="border border-ms-graphite bg-transparent" label="Open to apply" />
        <LegendDot className="bg-ms-danger/40" label="Booked / event" />
        <LegendDot className="bg-ms-warning/40" label="Held / maintenance" />
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("inline-block size-3 rounded-sm", className)} />
      {label}
    </span>
  );
}
