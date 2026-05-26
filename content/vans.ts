import type { Van } from "@/types";

/**
 * Gallery of the Mothership — one design, shown across its spaces and angles.
 * Photography + renders from bucksd.com. Grounded copy, no fabricated specs.
 */
export const vans: Van[] = [
  {
    slug: "the-stealth-exterior",
    title: "The Stealth Exterior",
    blurb: "Luxury that hides in plain sight.",
    platform: "Mercedes-Benz Sprinter 170",
    accent: "oklch(0.5 0.01 250)",
    image: "/images/exterior-front.jpg",
  },
  {
    slug: "the-lounge",
    title: "The Lounge",
    blurb: "Ambient-lit living that glows at golden hour.",
    platform: "3D-printed interior",
    accent: "oklch(0.72 0.18 50)",
    image: "/images/lounge-golden.jpg",
  },
  {
    slug: "the-galley",
    title: "The Galley",
    blurb: "A real kitchen, beautifully integrated.",
    platform: "3D-printed interior",
    accent: "oklch(0.45 0.02 80)",
    image: "/images/kitchen-detail.jpg",
  },
  {
    slug: "the-bedroom",
    title: "The Bedroom",
    blurb: "Wake up to the view, wherever you parked.",
    platform: "3D-printed interior",
    accent: "oklch(0.72 0.18 50)",
    image: "/images/render-bed.jpg",
  },
];

/** Lookup helper for /vans/[slug]. */
export function getVanBySlug(slug: string): Van | undefined {
  return vans.find((van) => van.slug === slug);
}
