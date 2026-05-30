import type { SiteConfig } from "@/types";

export const site: SiteConfig = {
  name: "Mothership",
  wordmark: "MOTHERSHIP",
  tagline: "Luxury redefined.",
  description:
    "The all-electric, self-charging, fully off-grid camper van of the future. A proprietary, carbon-fiber 3D-printed interior on the Mercedes Sprinter — built by hand in San Diego, delivered across the continental US.",
  url: "https://mothershipvans.com",
  address: "San Diego, California",
  copyright: "Mothership © 2026",

  navLinks: [
    { label: "Process", href: "/process" },
    { label: "Builds", href: "/vans" },
    { label: "Events", href: "/events" },
    { label: "Tax Benefits", href: "/tax-benefits" },
    { label: "Creators", href: "/creators" },
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
        { label: "See it in person", href: "/events" },
        { label: "Tax Benefits", href: "/tax-benefits" },
      ],
    },
    {
      heading: "Buying",
      links: [
        { label: "Reserve a build", href: "/configure" },
        { label: "Schedule a consultation", href: "/contact" },
        { label: "Section 179", href: "/tax-benefits" },
        { label: "Creators", href: "/creators" },
      ],
    },
    {
      heading: "Connect",
      links: [
        {
          label: "Instagram",
          href: "https://instagram.com/mothershipvehicles",
          external: true,
        },
        { label: "Email", href: "mailto:brandon@bucksd.com", external: true },
      ],
    },
  ],

  socials: [
    { label: "Instagram", href: "https://instagram.com/mothershipvehicles" },
    { label: "Email", href: "mailto:brandon@bucksd.com" },
  ],
};
