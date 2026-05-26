/** A top-level navigation link. */
export interface NavLink {
  label: string;
  href: string;
}

/** A single footer link (internal route or external placeholder). */
export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

/** A labelled column of footer links. */
export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

/** A social profile link. */
export interface Social {
  label: string;
  href: string;
}

/** Global site configuration consumed by the layout shell. */
export interface SiteConfig {
  name: string;
  wordmark: string;
  tagline: string;
  description: string;
  url: string;
  address: string;
  copyright: string;
  navLinks: NavLink[];
  primaryCta: NavLink;
  footerColumns: FooterColumn[];
  socials: Social[];
}
