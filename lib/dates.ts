/**
 * Tiny dependency-free date helpers for the availability calendar.
 *
 * Everything works on ISO `YYYY-MM-DD` strings. Because that format sorts
 * lexicographically in date order, comparisons are plain string compares.
 * Day math goes through UTC to dodge DST / timezone drift.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Build an ISO date string from 1-based month. */
export function iso(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Today's date as YYYY-MM-DD in the visitor's local timezone. */
export function todayISO(): string {
  const now = new Date();
  return iso(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** Number of days in a given (1-based) month. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Weekday index (0 = Sun) of the 1st of a (1-based) month. */
export function firstWeekday(year: number, month: number): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

/** Inclusive night count between two ISO dates (return − pickup). */
export function nightsBetween(start: string, end: string): number {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const a = Date.UTC(sy, sm - 1, sd);
  const b = Date.UTC(ey, em - 1, ed);
  return Math.round((b - a) / 86_400_000);
}

/** Iterate each ISO day from start to end, inclusive. */
export function* eachDay(start: string, end: string): Generator<string> {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const cur = new Date(Date.UTC(sy, sm - 1, sd));
  const last = new Date(Date.UTC(ey, em - 1, ed));
  while (cur <= last) {
    yield iso(cur.getUTCFullYear(), cur.getUTCMonth() + 1, cur.getUTCDate());
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
}

/** "Jul 4" style label. */
export function formatShort(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${MONTHS_SHORT[m - 1]} ${d}`;
}

/** "July 4, 2026" style label. */
export function formatLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export { MONTHS, MONTHS_SHORT };
