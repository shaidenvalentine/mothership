import type { SiteConfig } from "@/types";

export const site: SiteConfig = {
  name: "Mothership",
  wordmark: "MOTHERSHIP",
  tagline: "Luxury redefined.",
  description:
    "Mercedes Sprinter luxury stealth camper vans with proprietary 3D-printed interiors. One design, perfected through years of real-world experience. Built in San Diego, delivered across the continental US.",
  url: "https://mothership.com",
  address: "San Diego, California",
  copyright: "Mothership © 2026",

  navLinks: [
    { label: "Process", href: "/process" },
    { label: "Builds", href: "/vans" },
    { label: "Tax Benefits", href: "/tax-benefits" },
    { label: "About", href: "/about" },
  ],

  primaryCta: { label: "Reserve", href: "/configure" },

  footerColumns: [
    {
      heading: "Vehicle",
      links: [
        { label: "Reserve", href: "/configure" },
        { label: "The Build", href: "/technology" },
        { label: "Builds", href: "/vans" },
        { label: "Process", href: "/process" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Tax Benefits", href: "/tax-benefits" },
      ],
    },
    {
      heading: "Buying",
      links: [
        { label: "Reserve a build", href: "/configure" },
        { label: "Schedule a consultation", href: "/contact" },
        { label: "Section 179", href: "/tax-benefits" },
      ],
    },
    {
      heading: "Connect",
      links: [
        {
          label: "Instagram",
          href: "https://instagram.com/bucksd",
          external: true,
        },
        { label: "Email", href: "mailto:brandon@bucksd.com", external: true },
      ],
    },
  ],

  socials: [
    { label: "Instagram", href: "https://instagram.com/bucksd" },
    { label: "Email", href: "mailto:brandon@bucksd.com" },
  ],
};
