/**
 * Public events — where the van will be, for anyone who wants to see or test
 * it in person. This is the PUBLIC-facing list (richer than the availability
 * blocks in `content/availability.ts`, and intentionally separate so private
 * bookings/shoots never leak here).
 *
 * Tip: if an event also takes the van off the road, add a matching entry to
 * `blocks` in content/availability.ts so the creators calendar shows it busy.
 *
 * Dates are inclusive ISO `YYYY-MM-DD`.
 */

export interface PublicEvent {
  id: string;
  name: string;
  /** Venue / location name, e.g. "Fort Tuthill County Park". */
  venue: string;
  /** City + region, e.g. "Flagstaff, AZ". */
  city: string;
  start: string;
  end: string;
  /** One or two lines on what's happening / what visitors can do. */
  blurb: string;
  /** Optional official event link (tickets / info). */
  url?: string;
  /** True if people can book an in-person viewing slot at this event. */
  appointments: boolean;
}

/**
 * EDIT THESE for your real schedule. Seeded with examples — replace with the
 * van's actual public appearances.
 */
export const events: PublicEvent[] = [
  {
    id: "overland-expo-west-2026",
    name: "Overland Expo West",
    venue: "Fort Tuthill County Park",
    city: "Flagstaff, AZ",
    start: "2026-06-12",
    end: "2026-06-15",
    blurb:
      "Walk through the full build, talk to the team, and step inside the 3D-printed interior. Find us in the vehicle showcase.",
    url: "https://www.overlandexpo.com/",
    appointments: true,
  },
  {
    id: "mothership-open-house-summer-2026",
    name: "Mothership Open House",
    venue: "Mothership HQ",
    city: "San Diego, CA",
    start: "2026-08-08",
    end: "2026-08-08",
    blurb:
      "An afternoon at the shop. See the van up close, meet Brandon and Shaiden, and test the systems for yourself.",
    appointments: true,
  },
  {
    id: "adventure-van-expo-sd-2026",
    name: "Adventure Van Expo",
    venue: "Del Mar Fairgrounds",
    city: "San Diego, CA",
    start: "2026-09-26",
    end: "2026-09-27",
    blurb:
      "Our home-turf show. The demo van will be open all weekend for walk-throughs.",
    url: "https://adventurevanexpo.com/",
    appointments: false,
  },
  {
    id: "sema-2026",
    name: "SEMA Show",
    venue: "Las Vegas Convention Center",
    city: "Las Vegas, NV",
    start: "2026-11-03",
    end: "2026-11-07",
    blurb:
      "Industry week. The van is on display — reach out ahead of time to set up a private walk-through.",
    url: "https://www.semashow.com/",
    appointments: true,
  },
];
