/** A past build shown in the homepage gallery and on /vans/[slug]. */
export interface Van {
  /** URL slug, e.g. "mothership-3". */
  slug: string;
  /** Build number ornament, e.g. "#3". */
  number: string;
  /** Build name / title. */
  title: string;
  /** Short editorial blurb (placeholder pending real build data). */
  blurb: string;
  /** Year completed. */
  year: number;
  /** Platform / chassis. */
  platform: string;
  /** Accent color (fallback tint behind the image). */
  accent: string;
  /** Card / hero image (path under /public). */
  image: string;
}
