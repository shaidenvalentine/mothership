"use client";

import { useState } from "react";

import { Reveal } from "@/components/anim/Reveal";
import { WordReveal } from "@/components/anim/WordReveal";
import { alwaysExpected, tierForNights } from "@/content/availability";
import { formatLong, nightsBetween } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  AvailabilityCalendar,
  type DateRange,
} from "./AvailabilityCalendar";
import { CreatorApplicationForm } from "./CreatorApplicationForm";

function Step({
  n,
  label,
  active,
}: {
  n: string;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span
        className={cn(
          "font-mono text-display-md leading-none",
          active ? "text-ms-ion" : "text-ms-graphite",
        )}
      >
        {n}
      </span>
      <span className="ms-caption">{label}</span>
    </div>
  );
}

export function CreatorBooking() {
  const [range, setRange] = useState<DateRange | null>(null);

  const complete = Boolean(range && range.end);
  const nights = complete ? nightsBetween(range!.start, range!.end!) : 0;
  const tier = tierForNights(nights);

  return (
    <div className="space-y-20">
      {/* Step 1 — choose dates */}
      <div>
        <Step n="01" label="Choose your dates" active />
        <h3 className="mt-6 max-w-2xl font-display text-display-lg leading-tight text-ms-bone">
          <WordReveal text="Pick an open stretch on the calendar." />
        </h3>
        <p className="mt-6 max-w-2xl text-body-lg text-ms-fog">
          Tap a start day, then an end day. Greyed and struck-through dates are
          already booked or held for maintenance — pick any open run between
          them.
        </p>
        <div className="mt-10 rounded-2xl border border-ms-graphite/60 bg-ms-obsidian p-6 lg:p-10">
          <AvailabilityCalendar value={range} onChange={setRange} />
        </div>

        {/* Selection summary */}
        {range ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-body">
            {complete ? (
              <>
                <span className="text-ms-bone">
                  {formatLong(range.start)} &ndash; {formatLong(range.end!)}
                </span>
                <span className="font-mono text-body-sm text-ms-ion">
                  {nights} {nights === 1 ? "night" : "nights"}
                </span>
              </>
            ) : (
              <span className="text-ms-fog">
                Start: {formatLong(range.start)} — now pick your return day.
              </span>
            )}
            <button
              type="button"
              onClick={() => setRange(null)}
              className="font-mono text-body-sm text-ms-ash underline-offset-4 transition-colors hover:text-ms-bone hover:underline"
            >
              Clear
            </button>
          </div>
        ) : null}
      </div>

      {/* Step 2 — content expectations (revealed once a range is picked) */}
      {complete && tier ? (
        <Reveal y={20}>
          <div>
            <Step n="02" label="What we'd expect" active />
            <h3 className="mt-6 max-w-2xl font-display text-display-lg leading-tight text-ms-bone">
              The trade for {nights} {nights === 1 ? "night" : "nights"}.
            </h3>
            <p className="mt-6 max-w-2xl text-body-lg text-ms-fog">
              No fee, no rental. In exchange for the keys over your dates, here&rsquo;s
              what we&rsquo;d expect back — final scope is agreed together once
              you&rsquo;re approved.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ms-graphite/60 bg-ms-graphite/60 lg:grid-cols-2">
              <div className="bg-ms-black p-8 lg:p-10">
                <span className="ms-caption text-ms-ion">{tier.label}</span>
                <ul className="mt-6 space-y-4">
                  {tier.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex gap-3 text-body-lg text-ms-bone"
                    >
                      <span aria-hidden className="text-ms-ion">
                        &rarr;
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ms-black p-8 lg:p-10">
                <span className="ms-caption">Every trip</span>
                <ul className="mt-6 space-y-4">
                  {alwaysExpected.map((d) => (
                    <li
                      key={d}
                      className="flex gap-3 text-body-lg text-ms-fog"
                    >
                      <span aria-hidden className="text-ms-graphite">
                        &rarr;
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      ) : null}

      {/* Step 3 — apply */}
      <Reveal y={20}>
        <div>
          <Step n="03" label="Apply" active={complete} />
          <h3 className="mt-6 max-w-2xl font-display text-display-lg leading-tight text-ms-bone">
            Tell us who you are.
          </h3>
          {complete ? (
            <p className="mt-6 max-w-2xl text-body-lg text-ms-fog">
              Your dates are locked in below. Approval is per-trip — we review
              for fit, following, and route.
            </p>
          ) : (
            <p className="mt-6 max-w-2xl text-body-lg text-ms-fog">
              Pick your dates above first, then this form fills in with your
              trip.
            </p>
          )}
          <div className="mt-12">
            <CreatorApplicationForm
              pickupDate={complete ? range!.start : undefined}
              returnDate={complete ? range!.end! : undefined}
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
