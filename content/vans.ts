import type { Van, VanSpec } from "@/types";

/**
 * Gallery of the Mothership — one design, shown across its spaces and angles.
 * Photography + renders from bucksd.com. Grounded copy, no fabricated specs.
 */
export const vans: Van[] = [
  {
    slug: "the-stealth-exterior",
    title: "The Stealth Exterior",
    blurb: "Luxury that hides in plain sight.",
    platform: "Mercedes-Benz Sprinter",
    accent: "oklch(0.5 0.01 250)",
    image: "/images/exterior-front.jpg",
    description:
      "From the outside, nothing gives it away. The Mothership wears the quiet, blacked-out lines of a working Sprinter — no graphics, no ladders, no roof clutter to announce what's inside. That's the point: it parks anywhere, draws no attention, and keeps everything that matters hidden behind the panels.",
    gallery: [
      "/images/exterior-front.jpg",
      "/images/exterior-head-on.jpg",
      "/images/hero-exterior-sunset.jpg",
      "/images/systems-rear-doors.jpg",
    ],
  },
  {
    slug: "the-lounge",
    title: "The Lounge",
    blurb: "Ambient-lit living that glows at golden hour.",
    platform: "3D-printed carbon-fiber interior",
    accent: "oklch(0.72 0.18 50)",
    image: "/images/lounge-golden.jpg",
    description:
      "The living space is printed as one continuous, organic form — seating, storage, and lighting flowing into each other with no seams or hardware to catch the eye. Real wood, leather, and stone finishes warm up the aerospace-grade composite, and integrated ambient lighting turns the whole cabin gold at dusk.",
    gallery: [
      "/images/lounge-golden.jpg",
      "/images/lounge-warm.jpg",
      "/images/render-consoles.png",
      "/images/render-desk.jpg",
    ],
  },
  {
    slug: "the-galley",
    title: "The Galley",
    blurb: "A real kitchen, beautifully integrated.",
    platform: "3D-printed carbon-fiber interior",
    accent: "oklch(0.45 0.02 80)",
    image: "/images/kitchen-detail.jpg",
    description:
      "A genuine kitchen, not a token cooktop. Induction cooking, a deep basin, and generous counter space are printed directly into the cabinetry — ducting and wiring routed inside the structure so every surface stays clean. Built to actually cook in, on or off the grid.",
    gallery: [
      "/images/kitchen-detail.jpg",
      "/images/render-kitchen.jpg",
      "/images/render-dining.jpg",
    ],
  },
  {
    slug: "the-bedroom",
    title: "The Bedroom & Bath",
    blurb: "Wake up to the view, wherever you parked.",
    platform: "3D-printed carbon-fiber interior",
    accent: "oklch(0.72 0.18 50)",
    image: "/images/render-bed.jpg",
    description:
      "A full-width berth at the rear, plus a real wet bath with shower and toilet — the things that turn a van into a home you can live in for weeks. The printed forms keep everything waterproof and mold-resistant, and the bed frames the view through the rear doors.",
    gallery: [
      "/images/render-bed.jpg",
      "/images/render-shower.jpg",
      "/images/render-toilet.jpg",
    ],
  },
];

/**
 * Shared specs shown on every van detail page — grounded in the real product
 * (Mercedes Sprinter, proprietary 3D-printed interior, all-electric).
 */
export const vanSpecs: VanSpec[] = [
  { label: "Platform", value: 'Mercedes-Benz Sprinter — 144" or 170"' },
  { label: "Interior", value: "Proprietary 3D-printed carbon-fiber composite" },
  { label: "Power", value: "All-electric, self-charging, fully off-grid" },
  { label: "Finishes", value: "Real wood, leather & stone" },
  { label: "Build time", value: "~2 months from deposit" },
  { label: "Built in", value: "San Diego · ships continental US" },
];

/** Lookup helper for /vans/[slug]. */
export function getVanBySlug(slug: string): Van | undefined {
  return vans.find((van) => van.slug === slug);
}
