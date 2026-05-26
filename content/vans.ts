import type { Van } from "@/types";

/**
 * Past builds gallery (brief §7). The brief references Mothership #3, #5 and the
 * newer 3D-printed builds but does not provide per-build specs/copy — the
 * fields below are PLACEHOLDERS pending Shaiden's real build photos + data.
 */
export const vans: Van[] = [
  {
    slug: "mothership-3",
    number: "#3",
    title: "Mothership #3",
    blurb: "Full off-grid conversion. Proof of the platform.",
    year: 2023,
    platform: "Sprinter 170 EXT",
    accent: "oklch(0.5 0.01 250)",
    image: "/images/lounge-warm.jpg",
  },
  {
    slug: "mothership-5",
    number: "#5",
    title: "Mothership #5",
    blurb: "Refined layout, expanded power, four-season capability.",
    year: 2024,
    platform: "Sprinter 170 EXT",
    accent: "oklch(0.4 0.07 50)",
    image: "/images/lounge-golden.jpg",
  },
  {
    slug: "mothership-6",
    number: "#6",
    title: "Mothership #6",
    blurb: "First build with 3D-printed interior architecture.",
    year: 2025,
    platform: "3D-printed Mothership",
    accent: "oklch(0.78 0.16 230)",
    image: "/images/render-dining.jpg",
  },
  {
    slug: "mothership-7",
    number: "#7",
    title: "Mothership #7",
    blurb: "Fully electric drivetrain. The production blueprint.",
    year: 2026,
    platform: "3D-printed Mothership",
    accent: "oklch(0.72 0.18 50)",
    image: "/images/render-bed.jpg",
  },
];

/** Lookup helper for /vans/[slug]. */
export function getVanBySlug(slug: string): Van | undefined {
  return vans.find((van) => van.slug === slug);
}
