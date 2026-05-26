/** A standout vehicle feature surfaced in the homepage feature-reveal sequence. */
export interface Feature {
  /** Stable identifier / URL fragment. */
  id: string;
  /** Editorial index ornament, e.g. "01". */
  index: string;
  /** Feature name. */
  title: string;
  /** One-line cinematic tagline (verbatim from brief). */
  subtitle: string;
  /** Single key spec, drawn from brief facts. */
  keySpec: string;
  /** Destination for the "learn more" link. */
  learnMoreHref: string;
  /** Panel image (path under /public). */
  image: string;
}
