import type { Feature } from "@/types";

/**
 * The 8 standout features, in brief order (Homepage §3).
 * `subtitle` taglines are verbatim from the brief. `keySpec` values are
 * condensed from brief facts (tech callouts / numbers / configurator), not invented.
 */
export const features: Feature[] = [
  {
    id: "printed-architecture",
    index: "01",
    title: "3D-printed interior architecture",
    subtitle: "Geometry that wasn't possible before",
    keySpec: "Patent-pending · zero-fastener assembly",
    learnMoreHref: "/technology",
    image: "/images/render-consoles.png",
  },
  {
    id: "electric-drivetrain",
    index: "02",
    title: "Fully integrated electric drivetrain",
    subtitle: "Silent. Off-grid. Always ready.",
    keySpec: "Fully electric",
    learnMoreHref: "/technology",
    image: "/images/exterior-head-on.jpg",
  },
  {
    id: "spark-core",
    index: "03",
    title: "Spark Core power system",
    subtitle: "15+ kWh. Solar + dual alternator. Weeks off-grid.",
    keySpec: "15+ kWh onboard storage",
    learnMoreHref: "/technology",
    image: "/images/systems-rear-doors.jpg",
  },
  {
    id: "spa-bathroom",
    index: "04",
    title: "Spa bathroom with incinerating toilet",
    subtitle: "No dump stations. Ever.",
    keySpec: "Incinerating toilet · no dump stations",
    learnMoreHref: "/technology",
    image: "/images/render-toilet.jpg",
  },
  {
    id: "induction-kitchen",
    index: "05",
    title: "Invisible induction kitchen",
    subtitle: "Surface up. Surface down. Magic.",
    keySpec: "Flush induction surface",
    learnMoreHref: "/technology",
    image: "/images/render-kitchen.jpg",
  },
  {
    id: "spa-shower",
    index: "06",
    title: "Spa shower with real tile + teak",
    subtitle: "Five-star hotel, anywhere on Earth.",
    keySpec: "Real tile + teak",
    learnMoreHref: "/technology",
    image: "/images/render-shower.jpg",
  },
  {
    id: "awd-suspension",
    index: "07",
    title: "AWD + lifted suspension",
    subtitle: "Drive past where the pavement ends.",
    keySpec: "All-wheel drive · lifted",
    learnMoreHref: "/technology",
    image: "/images/exterior-front.jpg",
  },
  {
    id: "starlink-smart-home",
    index: "08",
    title: "Starlink + smart home control",
    subtitle: "Work anywhere. Live everywhere.",
    keySpec: "Starlink · smart-home control",
    learnMoreHref: "/technology",
    image: "/images/render-desk.jpg",
  },
];
