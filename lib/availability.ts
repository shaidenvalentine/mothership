/**
 * Server-side availability source for the public /creators calendar.
 *
 * Reads committed dates from the `bookings` table and the application window /
 * content tiers from `settings`, falling back to the hand-authored
 * `content/availability.ts` when the database is not configured (or empty).
 * This lets Shaiden manage dates from the admin without code edits, while the
 * file remains the seed + offline fallback.
 */
import {
  alwaysExpected as fileAlwaysExpected,
  applicationWindow as fileWindow,
  blocks as fileBlocks,
  contentTiers as fileTiers,
  type AvailabilityBlock,
  type ContentTier,
} from "@/content/availability";
import { getSetting, listBookings } from "@/lib/db/queries";

export interface AvailabilityData {
  blocks: AvailabilityBlock[];
  applicationWindow: { start: string; end: string };
  contentTiers: ContentTier[];
  alwaysExpected: string[];
}

export async function getAvailability(): Promise<AvailabilityData> {
  const bookings = await listBookings();

  // DB bookings → public calendar blocks. A `pending` (unapproved creator
  // request) blocks the dates as "held" so two people can't claim the same run.
  const dbBlocks: AvailabilityBlock[] = bookings.map((b) => ({
    start: b.startDate,
    end: b.endDate,
    status: b.status === "booked" ? "booked" : "held",
    label: b.label,
  }));

  const window =
    (await getSetting<{ start: string; end: string }>("applicationWindow")) ??
    fileWindow;
  const tiers =
    (await getSetting<ContentTier[]>("contentTiers")) ?? fileTiers;
  const always =
    (await getSetting<string[]>("alwaysExpected")) ?? fileAlwaysExpected;

  return {
    blocks: dbBlocks.length > 0 ? dbBlocks : fileBlocks,
    applicationWindow: window,
    contentTiers: tiers,
    alwaysExpected: always,
  };
}
