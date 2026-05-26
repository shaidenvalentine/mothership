import type { SiteConfig } from "@/types";

export const site: SiteConfig = {
  name: "Mothership",
  wordmark: "MOTHERSHIP",
  tagline: "Your next home may not have an address.",
  description:
    "The world's first 3D-printed, fully-electric, patent-pending luxury adventure van. Six-week builds. Cost basis nobody else can touch.",
  url: "https://mothership.com",
  address: "San Diego, California",
  copyright: "Mothership © 2026",

  navLinks: [
    { label: "Technology", href: "/technology" },
    { label: "Vehicles", href: "/vans" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
  ],

  primaryCta: { label: "Configure", href: "/configure" },

  footerColumns: [
    {
      heading: "Vehicle",
      links: [
        { label: "Configure", href: "/configure" },
        { label: "Technology", href: "/technology" },
        { label: "Past Builds", href: "/vans" },
        { label: "Process", href: "/process" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Order", href: "#" },
        { label: "Financing", href: "#" },
        { label: "Warranty", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      heading: "Connect",
      links: [
        { label: "Instagram", href: "#", external: true },
        { label: "YouTube", href: "#", external: true },
        { label: "TikTok", href: "#", external: true },
      ],
    },
  ],

  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};
