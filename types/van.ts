/** A view of the Mothership shown in the gallery and on /vans/[slug]. */
export interface Van {
  /** URL slug, e.g. "the-lounge". */
  slug: string;
  /** Title / space name. */
  title: string;
  /** Short editorial blurb. */
  blurb: string;
  /** Platform / chassis. */
  platform: string;
  /** Accent color (fallback tint behind the image). */
  accent: string;
  /** Card / hero image (path under /public). */
  image: string;
  /** Longer editorial description for the detail page. */
  description?: string;
  /** Additional images for the detail-page gallery (paths under /public). */
  gallery?: string[];
}

/** A labelled spec line shown on van detail pages. */
export interface VanSpec {
  label: string;
  value: string;
}
