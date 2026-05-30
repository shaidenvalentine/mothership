/**
 * Demo-van availability — the single source of truth for the creators calendar.
 *
 * Edit this file to update what the public sees:
 *  - `applicationWindow`  : the overall season the van can be applied for.
 *  - `blocks`             : dates the van is already committed (events) or
 *                           held back (maintenance). Anything not in a block,
 *                           inside the window, and not in the past = OPEN.
 *  - `contentTiers`       : what we expect in exchange, scaled by trip length.
 *  - `alwaysExpected`     : the baseline that applies to every trip.
 *
 * Dates are plain ISO `YYYY-MM-DD` strings and ranges are INCLUSIVE on both
 * ends (start and end day are both treated as committed).
 */

export type DayStatus = "open" | "booked" | "held" | "closed" | "past";

export interface AvailabilityBlock {
  /** First committed day (inclusive), YYYY-MM-DD. */
  start: string;
  /** Last committed day (inclusive), YYYY-MM-DD. */
  end: string;
  /** `booked` = out for an event/shoot. `held` = maintenance/internal. */
  status: "booked" | "held";
  /** Shown on hover and in the legend list, e.g. "SEMA Show". */
  label: string;
}

/** The season the van is open to creator applications. */
export const applicationWindow = {
  start: "2026-06-01",
  end: "2026-11-30",
};

/**
 * Committed dates. EDIT THESE as the schedule firms up — these are examples.
 * Keep them sorted by start date for readability (order doesn't matter to the code).
 */
export const blocks: AvailabilityBlock[] = [
  {
    start: "2026-06-12",
    end: "2026-06-15",
    status: "booked",
    label: "Overland Expo West",
  },
  {
    start: "2026-07-03",
    end: "2026-07-06",
    status: "booked",
    label: "Private event — Lake Tahoe",
  },
  {
    start: "2026-07-20",
    end: "2026-07-24",
    status: "held",
    label: "Maintenance & detailing",
  },
  {
    start: "2026-09-10",
    end: "2026-09-15",
    status: "booked",
    label: "Brand shoot",
  },
  {
    start: "2026-11-03",
    end: "2026-11-07",
    status: "booked",
    label: "SEMA Show — Las Vegas",
  },
];

export interface ContentTier {
  /** Applies when the selected trip is at least this many nights. */
  minNights: number;
  label: string;
  /** What we'd expect back for a trip of this length. */
  deliverables: string[];
}

/**
 * Content expectations scaled by trip length. The longest tier whose
 * `minNights` the trip meets is the one shown.
 */
export const contentTiers: ContentTier[] = [
  {
    minNights: 1,
    label: "Weekend — 1 to 3 nights",
    deliverables: [
      "1 Reel or TikTok built around the van",
      "3+ story frames from the trip",
      "A small set of edited photos we can repost",
    ],
  },
  {
    minNights: 4,
    label: "Week — 4 to 7 nights",
    deliverables: [
      "2 Reels or TikToks from the road",
      "1 YouTube Short or an integrated mention in a video",
      "Story coverage across the trip",
      "A photo set we can use on our own channels",
    ],
  },
  {
    minNights: 8,
    label: "Expedition — 8+ nights",
    deliverables: [
      "A long-form trip film or a dedicated YouTube video",
      "3+ Reels or TikToks",
      "Full story coverage, start to finish",
      "A complete photo set for our use",
    ],
  },
];

/** The baseline that applies to every trip, regardless of length. */
export const alwaysExpected = [
  "Tag @mothershipvehicles in every post and story from the trip.",
  "One clear mention that it's a Mothership — on camera or in the caption.",
  "Send the raw clips and photos back to us to use on our own channels.",
];

/** Pick the richest tier a given trip length qualifies for. */
export function tierForNights(nights: number): ContentTier | null {
  if (nights <= 0) return null;
  return (
    [...contentTiers]
      .reverse()
      .find((tier) => nights >= tier.minNights) ?? null
  );
}
